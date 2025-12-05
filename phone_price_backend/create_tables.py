"""
Script to create the database and tables
Run this once to initialize the database
"""
import mysql.connector
from mysql.connector import Error
import os
from dotenv import load_dotenv

load_dotenv()

DB_HOST = os.getenv("DB_HOST", "127.0.0.1")
DB_USER = os.getenv("DB_USER", "root")
DB_PASSWORD = os.getenv("DB_PASSWORD", "")
DB_NAME = os.getenv("DB_NAME", "phone")

def create_database():
    """Create the database if it doesn't exist"""
    try:
        connection = mysql.connector.connect(
            host=DB_HOST,
            user=DB_USER,
            password=DB_PASSWORD
        )
        
        cursor = connection.cursor()
        
        # Create database
        cursor.execute(f"CREATE DATABASE IF NOT EXISTS `{DB_NAME}`")
        print(f"✅ Database '{DB_NAME}' created or already exists")
        
        cursor.close()
        connection.close()
        
        return True
    except Error as e:
        print(f"❌ Error creating database: {e}")
        return False

def create_tables():
    """Create all tables in the database"""
    try:
        from app.database import Base, engine
        from app import models
        
        print("Creating database tables...")
        Base.metadata.create_all(bind=engine)
        print("✅ Database tables created successfully!")
        print("\nTables created:")
        print("  - phones")
        print("  - shops")
        print("  - prices")
        print("  - price_predictions")
        return True
    except Exception as e:
        print(f"❌ Error creating tables: {e}")
        return False

if __name__ == "__main__":
    print(f"Connecting to MySQL at {DB_HOST}...")
    print(f"Database name: {DB_NAME}")
    print()
    
    if create_database():
        print()
        if create_tables():
            print("\n✅ Database setup completed successfully!")
        else:
            print("\n❌ Failed to create tables")
    else:
        print("\n❌ Failed to create database")
