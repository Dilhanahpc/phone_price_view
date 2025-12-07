"""Test database connection"""
from sqlalchemy import create_engine, text
from dotenv import load_dotenv
import os

load_dotenv()

DATABASE_URL = os.getenv('DATABASE_URL')
DB_NAME = os.getenv('DB_NAME')

print(f"\n{'='*50}")
print("🔌 TESTING DATABASE CONNECTION")
print(f"{'='*50}\n")
print(f"Database: {DB_NAME}")
print(f"Host: localhost:3306")
print(f"User: root\n")

try:
    engine = create_engine(DATABASE_URL)
    with engine.connect() as conn:
        result = conn.execute(text("SELECT DATABASE()"))
        current_db = result.scalar()
        print(f"✅ Connection successful!")
        print(f"✅ Connected to database: {current_db}\n")
        
        # Test if tables exist
        result = conn.execute(text("SHOW TABLES"))
        tables = [row[0] for row in result]
        
        if tables:
            print(f"📊 Found {len(tables)} tables:")
            for table in tables:
                print(f"   - {table}")
        else:
            print("⚠️  No tables found. Run seed_data.py to populate database.")
        
        print(f"\n{'='*50}")
        print("✅ BACKEND IS READY TO CONNECT!")
        print(f"{'='*50}\n")
        
except Exception as e:
    print(f"❌ Connection failed: {e}\n")
    print("Check:")
    print("1. MySQL is running")
    print("2. Password is correct: 20040127Ch@")
    print("3. Database 'phone_prices' exists")
