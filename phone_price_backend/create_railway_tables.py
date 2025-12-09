"""
Script to create all database tables on Railway MySQL
Run this to initialize the Railway database with complete schema
"""
import sys
import os

# Add parent directory to path for imports
sys.path.insert(0, os.path.dirname(__file__))

from sqlalchemy import create_engine, text
from app.database import Base
from app import models  # This imports all models

# Railway MySQL connection
RAILWAY_DATABASE_URL = "mysql+pymysql://root:EvkCbyDIZpTVaHuJsaSwjVOsLgzrZcxB@shuttle.proxy.rlwy.net:26131/railway"

def create_all_tables():
    """Create all tables on Railway database"""
    print("=" * 60)
    print("🚀 CREATING ALL TABLES ON RAILWAY MYSQL")
    print("=" * 60)
    print(f"\nConnecting to Railway MySQL...")
    
    try:
        # Create engine for Railway database
        engine = create_engine(
            RAILWAY_DATABASE_URL,
            echo=True,  # Show SQL commands
            pool_pre_ping=True
        )
        
        # Test connection
        with engine.connect() as conn:
            result = conn.execute(text("SELECT 1"))
            print("✅ Connected to Railway MySQL successfully!\n")
        
        # Drop all tables first (optional - uncomment if you want fresh start)
        # print("⚠️  Dropping existing tables...")
        # Base.metadata.drop_all(bind=engine)
        # print("✅ Existing tables dropped\n")
        
        # Create all tables
        print("Creating tables from SQLAlchemy models...")
        Base.metadata.create_all(bind=engine)
        
        print("\n" + "=" * 60)
        print("✅ ALL TABLES CREATED SUCCESSFULLY!")
        print("=" * 60)
        
        # List all created tables
        with engine.connect() as conn:
            result = conn.execute(text("SHOW TABLES"))
            tables = [row[0] for row in result]
            
            print(f"\n📊 Total tables created: {len(tables)}")
            print("\nTables in Railway database:")
            for i, table in enumerate(tables, 1):
                print(f"   {i}. {table}")
        
        print("\n✅ Railway database is ready to use!")
        return True
        
    except Exception as e:
        print(f"\n❌ Error creating tables: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    create_all_tables()
