"""
Test Gmail with SSL (port 465) instead of STARTTLS (port 587)
"""
import smtplib
import os
from dotenv import load_dotenv

load_dotenv()

print("=" * 60)
print("🔒 TESTING GMAIL WITH SSL (PORT 465)")
print("=" * 60)

username = os.getenv('SMTP_USERNAME')
password = os.getenv('SMTP_PASSWORD')
port = int(os.getenv('SMTP_PORT', '465'))

print(f"\n📧 Email: {username}")
print(f"🔑 Password: {'*' * len(password)} ({len(password)} chars)")
print(f"🚪 Port: {port}")
print(f"🔒 SSL: Enabled")

print("\n🔄 Attempting SSL connection...")

try:
    # Use SMTP_SSL instead of SMTP with STARTTLS
    server = smtplib.SMTP_SSL('smtp.gmail.com', 465, timeout=30)
    server.set_debuglevel(1)  # Show detailed logs
    print("\n✅ SSL connection established!")
    
    print("\n🔐 Logging in...")
    server.login(username, password)
    print(f"✅ Login successful for {username}!")
    
    # Send a test email
    from email.mime.text import MIMEText
    from email.mime.multipart import MIMEMultipart
    
    test_email = input("\nEnter email to send test to: ")
    
    msg = MIMEMultipart()
    msg['From'] = username
    msg['To'] = test_email
    msg['Subject'] = "✅ Email System Test - Port 465 SSL"
    
    body = """
    <html>
    <body style="font-family: Arial, sans-serif; padding: 20px;">
        <h2 style="color: #10b981;">🎉 Success!</h2>
        <p>Your email system is working perfectly with SSL on port 465!</p>
        <p><strong>Configuration:</strong></p>
        <ul>
            <li>SMTP Server: smtp.gmail.com</li>
            <li>Port: 465</li>
            <li>Security: SSL/TLS</li>
        </ul>
        <p>You can now send automated price drop notifications to your customers!</p>
    </body>
    </html>
    """
    
    msg.attach(MIMEText(body, 'html'))
    
    print(f"\n📨 Sending test email to {test_email}...")
    server.send_message(msg)
    print("✅ Test email sent successfully!")
    
    server.quit()
    print("\n🎉 ALL TESTS PASSED!")
    print("=" * 60)
    print("Your email system is ready to use with SSL!")
    print("=" * 60)
    
except smtplib.SMTPAuthenticationError as e:
    print(f"\n❌ Authentication failed: {e}")
    print("🔧 Check your App Password")
except Exception as e:
    print(f"\n❌ Error: {e}")
    print("🔧 Port 465 might also be blocked by your network")
    print("🔧 Consider using a professional email service like SendGrid or AWS SES")

print("=" * 60)
