"""
Test database connection
"""
from app.database import engine
from sqlalchemy import text

try:
    print("Testing database connection...")
    with engine.connect() as connection:
        result = connection.execute(text("SELECT DATABASE()"))
        db_name = result.fetchone()[0]
        print(f"✅ Successfully connected to database: {db_name}")
        
        # List existing tables
        result = connection.execute(text("SHOW TABLES"))
        tables = result.fetchall()
        
        if tables:
            print(f"\n✅ Found {len(tables)} existing tables:")
            for table in tables:
                print(f"  - {table[0]}")
        else:
            print("\n⚠️  No tables found in database")
        
        print("\n✅ Database connection is working!")
        
except Exception as e:
    print(f"❌ Connection failed: {e}")
