# 📧 Email Notification System Setup

This guide will help you set up automated email notifications for price drops.

## Features

✅ **Automated Price Drop Alerts** - Customers receive instant email notifications when phone prices decrease
✅ **Welcome Emails** - New subscribers get a welcome email upon registration
✅ **Subscription Management** - Easy subscribe/unsubscribe functionality
✅ **Beautiful Email Templates** - Professional HTML emails with branding

## Setup Instructions

### 1. Configure Email Settings

Copy the `.env.example` file to `.env`:
```bash
cp .env.example .env
```

### 2. Gmail Setup (Recommended)

If using Gmail:

1. **Enable 2-Factor Authentication**
   - Go to your Google Account settings
   - Navigate to Security → 2-Step Verification
   - Enable 2FA

2. **Generate App Password**
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" and your device
   - Copy the generated 16-character password

3. **Update .env file**
```env
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-16-char-app-password
FROM_EMAIL=your-email@gmail.com
```

### 3. Other Email Providers

#### Outlook/Hotmail
```env
SMTP_SERVER=smtp-mail.outlook.com
SMTP_PORT=587
```

#### Yahoo
```env
SMTP_SERVER=smtp.mail.yahoo.com
SMTP_PORT=587
```

### 4. Test the System

1. Start the backend server:
```bash
cd phone_price_backend
python -m uvicorn app.main:app --reload
```

2. Start the frontend:
```bash
cd phone_price_frontend
npm run dev
```

3. Visit http://localhost:5173 and click "Get in Touch" button
4. Subscribe with your email
5. Check your inbox for the welcome email

## API Endpoints

### Subscribe to Alerts
```http
POST /api/subscribers/
Content-Type: application/json

{
  "email": "customer@example.com",
  "name": "John Doe"
}
```

### Unsubscribe
```http
DELETE /api/subscribers/{email}
```

### Get All Subscribers (Admin)
```http
GET /api/subscribers/
```

## Triggering Price Drop Notifications

To manually trigger price drop notifications for testing:

```python
from app.services.email_service import notify_all_subscribers
from app.database import SessionLocal

db = SessionLocal()
notify_all_subscribers(
    db=db,
    phone_name="iPhone 15 Pro",
    old_price=450000,
    new_price=420000,
    shop_name="Tech Store"
)
db.close()
```

## Automated Price Monitoring

To automatically send emails when prices drop, you can:

1. **Add a background task** that checks for price changes periodically
2. **Use database triggers** to detect price updates
3. **Implement a webhook** when prices are updated via admin panel

### Example: Price Update Hook

Add this to your price update route (`app/routes/prices.py`):

```python
from app.services.email_service import notify_all_subscribers

@router.put("/{id}")
def update_price(id: int, price_update: PriceUpdate, db: Session = Depends(get_db)):
    # Update price logic here
    old_price = existing_price.price
    new_price = price_update.price
    
    # If price decreased significantly (e.g., 5% or more)
    if new_price < old_price * 0.95:
        # Notify all subscribers
        notify_all_subscribers(
            db=db,
            phone_name=phone.model,
            old_price=old_price,
            new_price=new_price,
            shop_name=shop.name
        )
    
    return updated_price
```

## Email Templates

Email templates are defined in `app/services/email_service.py`:
- `send_welcome_email()` - Sent when user subscribes
- `send_price_drop_notification()` - Sent when price drops

## Troubleshooting

### Emails Not Sending

1. **Check credentials**: Verify SMTP_USERNAME and SMTP_PASSWORD in .env
2. **Check spam folder**: Welcome emails might be in spam
3. **Check console logs**: Look for error messages in backend terminal
4. **Test SMTP connection**: Use a tool like Telnet to test SMTP server connectivity

### Gmail "Less Secure Apps"

Gmail no longer supports "less secure apps". You MUST use App Passwords with 2FA enabled.

### Rate Limiting

- Gmail free accounts: ~500 emails/day
- Consider using a dedicated email service (SendGrid, Mailgun, AWS SES) for production

## Production Recommendations

For production deployment:

1. **Use a dedicated email service**: SendGrid, Mailgun, AWS SES
2. **Implement email queues**: Use Celery or RQ for async email sending
3. **Add unsubscribe links**: Include working unsubscribe functionality
4. **Track email metrics**: Monitor open rates, bounces, complaints
5. **Follow email regulations**: Comply with CAN-SPAM, GDPR

## Support

For issues or questions, contact: hello@pricera.com
