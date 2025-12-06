"""
Example: How to integrate automated email notifications when prices are updated.

Add this code to your price update routes to automatically notify subscribers
when phone prices drop significantly.
"""

from app.services.email_service import notify_all_subscribers
from app.models import Phone, Shop

# Example 1: In your PUT/PATCH price update endpoint
# File: app/routes/prices.py

def update_phone_price(price_id: int, new_price: float, db):
    """
    Update phone price and notify subscribers if price dropped
    """
    # Get existing price
    price_record = db.query(ShopPrice).filter(ShopPrice.id == price_id).first()
    if not price_record:
        return None
    
    old_price = price_record.price
    
    # Calculate price difference
    price_drop_percentage = ((old_price - new_price) / old_price) * 100
    
    # Define threshold for notifications (e.g., 5% drop)
    NOTIFICATION_THRESHOLD = 5.0
    
    # Update the price
    price_record.price = new_price
    db.commit()
    
    # Send notifications if price dropped significantly
    if price_drop_percentage >= NOTIFICATION_THRESHOLD:
        # Get phone and shop details
        phone = db.query(Phone).filter(Phone.id == price_record.phone_id).first()
        shop = db.query(Shop).filter(Shop.id == price_record.shop_id).first()
        
        if phone and shop:
            # Notify all subscribers
            success_count, total_subscribers = notify_all_subscribers(
                db=db,
                phone_name=f"{phone.brand} {phone.model}",
                old_price=old_price,
                new_price=new_price,
                shop_name=shop.name
            )
            
            print(f"✅ Notified {success_count}/{total_subscribers} subscribers about price drop!")
    
    return price_record


# Example 2: Background job to check for price changes
# This could run periodically (e.g., every hour) to check for updates

from datetime import datetime, timedelta

def check_recent_price_drops(db, hours=24):
    """
    Check for significant price drops in the last X hours
    and notify subscribers
    """
    cutoff_time = datetime.now() - timedelta(hours=hours)
    
    # Query price history to find drops
    # This assumes you have a price history table
    # Adjust query based on your schema
    
    recent_drops = db.query(ShopPrice).filter(
        ShopPrice.updated_at >= cutoff_time
    ).all()
    
    notified_count = 0
    
    for current_price in recent_drops:
        # Get previous price (you'd need a price history table)
        # For now, we'll use a simplified approach
        
        phone = db.query(Phone).filter(Phone.id == current_price.phone_id).first()
        shop = db.query(Shop).filter(Shop.id == current_price.shop_id).first()
        
        if phone and shop:
            # Simulate old price (replace with actual history lookup)
            old_price = current_price.price * 1.10  # Assume 10% higher before
            
            if current_price.price < old_price:
                notify_all_subscribers(
                    db=db,
                    phone_name=f"{phone.brand} {phone.model}",
                    old_price=old_price,
                    new_price=current_price.price,
                    shop_name=shop.name
                )
                notified_count += 1
    
    return notified_count


# Example 3: Manual notification trigger (for testing or admin use)

def send_test_notification(db, subscriber_email: str):
    """
    Send a test price drop notification to a specific subscriber
    """
    from app.services.email_service import send_price_drop_notification
    
    # Send test notification
    success = send_price_drop_notification(
        email=subscriber_email,
        phone_name="iPhone 15 Pro Max",
        old_price=525000,
        new_price=475000,
        shop_name="Tech Haven"
    )
    
    return success


# Example 4: Bulk notification for a specific phone

def notify_about_phone_deal(db, phone_id: int, shop_id: int):
    """
    Send notification to all subscribers about a specific phone deal
    """
    phone = db.query(Phone).filter(Phone.id == phone_id).first()
    shop = db.query(Shop).filter(Shop.id == shop_id).first()
    
    if not phone or not shop:
        return False
    
    # Get current and previous prices
    current_price_record = db.query(ShopPrice).filter(
        ShopPrice.phone_id == phone_id,
        ShopPrice.shop_id == shop_id
    ).first()
    
    if not current_price_record:
        return False
    
    # You'll need to implement price history tracking
    # For now, simulate a 10% drop
    old_price = current_price_record.price * 1.10
    new_price = current_price_record.price
    
    success_count, total = notify_all_subscribers(
        db=db,
        phone_name=f"{phone.brand} {phone.model}",
        old_price=old_price,
        new_price=new_price,
        shop_name=shop.name
    )
    
    return success_count > 0


# Example 5: Schedule periodic checks with APScheduler

"""
Install: pip install apscheduler

Add to app/main.py:
"""

from apscheduler.schedulers.background import BackgroundScheduler
from app.database import SessionLocal

def scheduled_price_check():
    """Run every hour to check for price changes"""
    db = SessionLocal()
    try:
        check_recent_price_drops(db, hours=1)
    finally:
        db.close()

# In app/main.py startup event:
@app.on_event("startup")
def start_scheduler():
    scheduler = BackgroundScheduler()
    scheduler.add_job(
        scheduled_price_check,
        'interval',
        hours=1,  # Check every hour
        id='price_check_job'
    )
    scheduler.start()


# Example 6: WebSocket notification (Advanced)

"""
For real-time notifications, you can also use WebSocket
to notify connected users in addition to email
"""

from fastapi import WebSocket

active_connections: list[WebSocket] = []

async def notify_connected_users(message: dict):
    """Send real-time notification to connected users"""
    for connection in active_connections:
        try:
            await connection.send_json(message)
        except:
            active_connections.remove(connection)

# When price drops:
async def on_price_drop(phone_name: str, old_price: float, new_price: float):
    # Send email
    notify_all_subscribers(...)
    
    # Also notify connected users via WebSocket
    await notify_connected_users({
        "type": "price_drop",
        "phone": phone_name,
        "old_price": old_price,
        "new_price": new_price
    })
