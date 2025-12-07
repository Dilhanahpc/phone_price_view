from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.database import get_db
from app import models, schemas
from app.services.email_service import notify_all_subscribers

router = APIRouter()

@router.get("/", response_model=list[schemas.ShopPrice])
async def get_prices(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    phone_id: int = Query(None),
    shop_id: int = Query(None),
    db: Session = Depends(get_db)
):
    """Get prices with optional filtering by phone_id or shop_id"""
    query = db.query(models.ShopPrice)
    
    if phone_id:
        query = query.filter(models.ShopPrice.phone_id == phone_id)
    if shop_id:
        query = query.filter(models.ShopPrice.shop_id == shop_id)
    
    prices = query.offset(skip).limit(limit).all()
    return prices

@router.get("/range", response_model=list[schemas.ShopPrice])
async def get_phones_by_price_range(
    min_price: int = Query(..., ge=0, description="Minimum price"),
    max_price: int = Query(..., ge=0, description="Maximum price"),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    db: Session = Depends(get_db)
):
    """Get all phones within a price range"""
    if min_price > max_price:
        raise HTTPException(status_code=400, detail="min_price cannot be greater than max_price")
    
    prices = db.query(models.ShopPrice).filter(
        models.ShopPrice.price >= min_price,
        models.ShopPrice.price <= max_price,
        models.ShopPrice.is_active == True
    ).offset(skip).limit(limit).all()
    
    return prices

@router.post("/", response_model=schemas.ShopPrice)
async def create_price(price: schemas.ShopPriceCreate, db: Session = Depends(get_db)):
    """Create a new price entry"""
    # Verify phone and shop exist
    phone = db.query(models.Phone).filter(models.Phone.id == price.phone_id).first()
    shop = db.query(models.Shop).filter(models.Shop.id == price.shop_id).first()
    
    if not phone:
        raise HTTPException(status_code=404, detail="Phone not found")
    if not shop:
        raise HTTPException(status_code=404, detail="Shop not found")
    
    db_price = models.ShopPrice(**price.model_dump())
    db.add(db_price)
    db.commit()
    db.refresh(db_price)
    return db_price

@router.put("/{price_id}", response_model=schemas.ShopPrice)
async def update_price(price_id: int, price: schemas.ShopPriceCreate, db: Session = Depends(get_db)):
    """Update a price entry"""
    db_price = db.query(models.ShopPrice).filter(models.ShopPrice.id == price_id).first()
    if not db_price:
        raise HTTPException(status_code=404, detail="Price not found")
    
    # Store old price for comparison
    old_price = db_price.price
    new_price = price.price
    
    # Check if price changed significantly (more than 1% change to avoid minor fluctuations)
    price_changed = old_price != new_price and abs((new_price - old_price) / old_price) >= 0.01
    
    # Get phone and shop details for notification
    phone = db.query(models.Phone).filter(models.Phone.id == db_price.phone_id).first()
    shop = db.query(models.Shop).filter(models.Shop.id == db_price.shop_id).first()
    
    # Update the price
    for key, value in price.model_dump().items():
        setattr(db_price, key, value)
    
    db.commit()
    db.refresh(db_price)
    
    # Send notifications for any significant price change (increase OR decrease)
    if price_changed and phone and shop:
        try:
            phone_name = f"{phone.brand} {phone.model}"
            shop_name = shop.name
            success_count, total_subscribers = notify_all_subscribers(
                db, phone_name, old_price, new_price, shop_name
            )
            change_type = "drop" if new_price < old_price else "increase"
            print(f"📧 Price {change_type} notification sent to {success_count}/{total_subscribers} subscribers")
        except Exception as e:
            print(f"⚠️ Failed to send notifications: {e}")
            # Don't fail the price update if email fails
    
    return db_price

@router.delete("/{price_id}")
async def delete_price(price_id: int, db: Session = Depends(get_db)):
    """Delete a price entry"""
    db_price = db.query(models.ShopPrice).filter(models.ShopPrice.id == price_id).first()
    if not db_price:
        raise HTTPException(status_code=404, detail="Price not found")
    
    db.delete(db_price)
    db.commit()
    return {"message": "Price deleted successfully"}

@router.get("/phone/{phone_id}/compare", response_model=list[schemas.ShopPrice])
async def compare_prices(phone_id: int, db: Session = Depends(get_db)):
    """Get all prices for a phone across all shops (for price comparison)"""
    prices = db.query(models.ShopPrice).filter(
        models.ShopPrice.phone_id == phone_id
    ).order_by(models.ShopPrice.price).all()
    
    if not prices:
        raise HTTPException(status_code=404, detail="No prices found for this phone")
    
    return prices

