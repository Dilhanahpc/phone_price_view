import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import List
import os
from dotenv import load_dotenv

load_dotenv()

# Email configuration (set these in .env file)
SMTP_SERVER = os.getenv("SMTP_SERVER", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USERNAME = os.getenv("SMTP_USERNAME", "")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "")
FROM_EMAIL = os.getenv("FROM_EMAIL", "noreply@pricera.com")

def send_email(to_email: str, subject: str, html_content: str):
    """Send an email"""
    if not SMTP_USERNAME or not SMTP_PASSWORD:
        print("⚠️ Email credentials not configured. Skipping email send.")
        return False
    
    try:
        msg = MIMEMultipart('alternative')
        msg['From'] = FROM_EMAIL
        msg['To'] = to_email
        msg['Subject'] = subject
        
        html_part = MIMEText(html_content, 'html')
        msg.attach(html_part)
        
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_USERNAME, SMTP_PASSWORD)
            server.send_message(msg)
        
        print(f"✅ Email sent to {to_email}")
        return True
    except Exception as e:
        print(f"❌ Failed to send email to {to_email}: {str(e)}")
        return False

def send_welcome_email(email: str, name: str = None):
    """Send welcome email to new subscriber"""
    display_name = name if name else "there"
    
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
            .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
            .header {{ background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }}
            .content {{ background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }}
            .button {{ display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin-top: 20px; }}
            .footer {{ text-align: center; margin-top: 20px; color: #888; font-size: 12px; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Welcome to Pricera! 🎉</h1>
            </div>
            <div class="content">
                <p>Hi {display_name},</p>
                <p>Thank you for subscribing to Pricera price alerts!</p>
                <p>You'll now receive instant notifications whenever:</p>
                <ul>
                    <li>📉 Phone prices drop significantly</li>
                    <li>🆕 New phones are added to our database</li>
                    <li>🔥 Special deals become available</li>
                </ul>
                <p>Stay ahead of the curve and never miss a great deal!</p>
                <a href="http://localhost:5173" class="button">Explore Phones</a>
            </div>
            <div class="footer">
                <p>© 2025 Pricera. All rights reserved.</p>
                <p>To unsubscribe, click <a href="#">here</a></p>
            </div>
        </div>
    </body>
    </html>
    """
    
    return send_email(email, "Welcome to Pricera - Price Alerts Activated! 🎉", html_content)

def send_price_drop_notification(email: str, phone_name: str, old_price: float, new_price: float, shop_name: str):
    """Send price drop notification"""
    price_drop = old_price - new_price
    percentage = (price_drop / old_price) * 100
    
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
            .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
            .header {{ background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }}
            .content {{ background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }}
            .price-card {{ background: white; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #667eea; }}
            .old-price {{ text-decoration: line-through; color: #888; font-size: 18px; }}
            .new-price {{ color: #10b981; font-size: 32px; font-weight: bold; }}
            .savings {{ background: #10b981; color: white; padding: 10px 20px; border-radius: 5px; display: inline-block; margin-top: 10px; }}
            .button {{ display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin-top: 20px; }}
            .footer {{ text-align: center; margin-top: 20px; color: #888; font-size: 12px; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🔥 Price Drop Alert!</h1>
            </div>
            <div class="content">
                <h2>{phone_name}</h2>
                <div class="price-card">
                    <p><strong>Shop:</strong> {shop_name}</p>
                    <p class="old-price">Rs. {old_price:,.2f}</p>
                    <p class="new-price">Rs. {new_price:,.2f}</p>
                    <div class="savings">Save Rs. {price_drop:,.2f} ({percentage:.1f}% OFF)</div>
                </div>
                <p>This is a great opportunity to grab your dream phone at a discounted price!</p>
                <a href="http://localhost:5173" class="button">View Deal</a>
            </div>
            <div class="footer">
                <p>© 2025 Pricera. All rights reserved.</p>
                <p>To unsubscribe, click <a href="#">here</a></p>
            </div>
        </div>
    </body>
    </html>
    """
    
    return send_email(email, f"🔥 Price Drop: {phone_name} - Save {percentage:.1f}%!", html_content)

def notify_all_subscribers(db, phone_name: str, old_price: float, new_price: float, shop_name: str):
    """Notify all active subscribers about price drop"""
    from app.models import Subscriber
    
    subscribers = db.query(Subscriber).filter(Subscriber.is_active == True).all()
    
    success_count = 0
    for subscriber in subscribers:
        if send_price_drop_notification(subscriber.email, phone_name, old_price, new_price, shop_name):
            success_count += 1
    
    return success_count, len(subscribers)
