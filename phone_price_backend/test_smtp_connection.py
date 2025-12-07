"""
Simple Gmail SMTP Connection Test
"""
import socket
import smtplib
import os
from dotenv import load_dotenv

load_dotenv()

print("=" * 60)
print("🔍 GMAIL SMTP CONNECTION TEST")
print("=" * 60)

# Test 1: Can we resolve the domain?
print("\n1️⃣ Testing DNS resolution...")
try:
    ip = socket.gethostbyname('smtp.gmail.com')
    print(f"   ✅ smtp.gmail.com resolves to: {ip}")
except Exception as e:
    print(f"   ❌ DNS resolution failed: {e}")
    exit(1)

# Test 2: Can we connect to port 587?
print("\n2️⃣ Testing port 587 connection...")
try:
    sock = socket.create_connection(('smtp.gmail.com', 587), timeout=10)
    print(f"   ✅ Successfully connected to smtp.gmail.com:587")
    sock.close()
except Exception as e:
    print(f"   ❌ Connection failed: {e}")
    print("   ⚠️  Your firewall or network might be blocking port 587")
    exit(1)

# Test 3: Try SMTP handshake
print("\n3️⃣ Testing SMTP handshake...")
try:
    server = smtplib.SMTP('smtp.gmail.com', 587, timeout=30)
    server.set_debuglevel(1)  # Show detailed logs
    print("   ✅ SMTP connection established")
    
    print("\n4️⃣ Testing STARTTLS...")
    server.ehlo()
    server.starttls()
    server.ehlo()
    print("   ✅ STARTTLS successful")
    
    print("\n5️⃣ Testing authentication...")
    username = os.getenv('SMTP_USERNAME')
    password = os.getenv('SMTP_PASSWORD')
    
    server.login(username, password)
    print(f"   ✅ Authentication successful for {username}")
    
    server.quit()
    print("\n🎉 ALL TESTS PASSED! Email system is ready to use!")
    
except smtplib.SMTPAuthenticationError as e:
    print(f"   ❌ Authentication failed: {e}")
    print("   🔧 Your App Password might be incorrect")
    print("   🔧 Try generating a new App Password")
except Exception as e:
    print(f"   ❌ Error: {e}")
    print("   🔧 Check your internet connection")
    print("   🔧 Check if your network blocks port 587")

print("=" * 60)
