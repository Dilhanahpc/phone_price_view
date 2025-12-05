"""
Create the phone database
"""
import mysql.connector
from dotenv import load_dotenv
import os

load_dotenv()

DB_HOST = os.getenv("DB_HOST", "127.0.0.1")
DB_USER = os.getenv("DB_USER", "root")
DB_PASSWORD = os.getenv("DB_PASSWORD", "")

try:
    print(f"Connecting to MySQL at {DB_HOST}...")
    connection = mysql.connector.connect(
        host=DB_HOST,
        user=DB_USER,
        password=DB_PASSWORD
    )
    
    cursor = connection.cursor()
    
    # Create database
    print("Creating database 'phone'...")
    cursor.execute("CREATE DATABASE IF NOT EXISTS `phone` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci")
    print("✅ Database 'phone' created successfully!")
    
    # Show all databases
    cursor.execute("SHOW DATABASES")
    print("\n📋 Available databases:")
    for db in cursor:
        print(f"  - {db[0]}")
    
    cursor.close()
    connection.close()
    
    print("\n✅ Done! Now you can run the application.")
    
except Exception as e:
    print(f"❌ Error: {e}")
