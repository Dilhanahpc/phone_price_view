"""
Quick Email Configuration Test
Run this script to verify your email settings are working.
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from dotenv import load_dotenv

# Load environment variables
load_dotenv()

print("=" * 60)
print("📧 EMAIL CONFIGURATION DIAGNOSTIC")
print("=" * 60)

# Check all required variables
smtp_server = os.getenv('SMTP_SERVER')
smtp_port = os.getenv('SMTP_PORT')
smtp_username = os.getenv('SMTP_USERNAME')
smtp_password = os.getenv('SMTP_PASSWORD')
from_email = os.getenv('FROM_EMAIL')

print("\n1️⃣ Configuration Values:")
print(f"   SMTP_SERVER: {smtp_server}")
print(f"   SMTP_PORT: {smtp_port}")
print(f"   SMTP_USERNAME: {smtp_username}")
print(f"   SMTP_PASSWORD: {'*' * len(smtp_password) if smtp_password else 'NOT SET'} ({len(smtp_password) if smtp_password else 0} characters)")
print(f"   FROM_EMAIL: {from_email}")

print("\n2️⃣ Configuration Check:")
issues = []

if not smtp_username or smtp_username == 'your-email@gmail.com':
    issues.append("❌ SMTP_USERNAME needs to be your actual email")
else:
    print("   ✅ SMTP_USERNAME is set")

if not smtp_password or smtp_password == 'your-app-password-here':
    issues.append("❌ SMTP_PASSWORD needs to be your actual App Password")
else:
    print("   ✅ SMTP_PASSWORD is set")

if not from_email or from_email == 'noreply@pricera.com':
    issues.append("⚠️  FROM_EMAIL should match your SMTP_USERNAME for Gmail")
else:
    print("   ✅ FROM_EMAIL is set")

if smtp_username and from_email and smtp_username != from_email:
    issues.append("⚠️  FROM_EMAIL should match SMTP_USERNAME for Gmail")

if issues:
    print("\n3️⃣ Issues Found:")
    for issue in issues:
        print(f"   {issue}")
    print("\n📝 TO FIX:")
    print("   1. Edit the .env file in phone_price_backend folder")
    print("   2. Replace 'your-email@gmail.com' with your actual Gmail")
    print("   3. Replace 'your-app-password-here' with your Gmail App Password")
    print("   4. Set FROM_EMAIL to match your Gmail address")
    print("\n🔐 How to get Gmail App Password:")
    print("   1. Enable 2FA: https://myaccount.google.com/security")
    print("   2. Create App Password: https://myaccount.google.com/apppasswords")
    print("   3. Copy the 16-character password to .env file")
else:
    print("\n3️⃣ Configuration looks good! ✅")
    print("\n4️⃣ Testing email connection...")
    
    try:
        from app.services.email_service import send_email
        
        # Ask for test email
        test_email = input("\n📬 Enter an email address to send a test message to (or press Enter to skip): ").strip()
        
        if test_email:
            print(f"\n📨 Sending test email to {test_email}...")
            
            test_html = """
            <html>
                <body style="font-family: Arial, sans-serif;">
                    <h2 style="color: #667eea;">🎉 Email Test Successful!</h2>
                    <p>Your Pricera email notification system is working correctly.</p>
                    <p>You will now receive price drop alerts when phones go on sale.</p>
                    <hr>
                    <p style="color: #888; font-size: 12px;">
                        This is a test email from your Pricera Phone Price Alert system.
                    </p>
                </body>
            </html>
            """
            
            success = send_email(test_email, "✅ Pricera Email Test - System Working!", test_html)
            
            if success:
                print("✅ Email sent successfully!")
                print(f"📬 Check the inbox of {test_email}")
                print("💡 If you don't see it, check your spam/junk folder")
            else:
                print("❌ Email sending failed!")
                print("🔧 Check the error message above for details")
        else:
            print("⏭️  Skipping email test")
            
    except Exception as e:
        print(f"\n❌ Error testing email: {str(e)}")
        print("\n🔧 Troubleshooting:")
        print("   - Make sure your App Password is correct")
        print("   - Verify 2FA is enabled on your Gmail account")
        print("   - Check your internet connection")

print("\n" + "=" * 60)
print("📚 For detailed setup instructions, see:")
print("   phone_price_backend/EMAIL_SETUP.md")
print("=" * 60)
