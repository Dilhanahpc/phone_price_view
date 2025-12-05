"""
Check actual table structure in database
"""
import mysql.connector
from dotenv import load_dotenv
import os

load_dotenv()

DB_HOST = os.getenv("DB_HOST", "127.0.0.1")
DB_USER = os.getenv("DB_USER", "root")
DB_PASSWORD = os.getenv("DB_PASSWORD", "")
DB_NAME = os.getenv("DB_NAME", "phone_prices")

try:
    connection = mysql.connector.connect(
        host=DB_HOST,
        user=DB_USER,
        password=DB_PASSWORD,
        database=DB_NAME
    )
    
    cursor = connection.cursor()
    
    # Get all tables
    cursor.execute("SHOW TABLES")
    tables = cursor.fetchall()
    
    print(f"Database: {DB_NAME}\n")
    
    for table in tables:
        table_name = table[0]
        print(f"📋 Table: {table_name}")
        print("=" * 60)
        
        # Describe table structure
        cursor.execute(f"DESCRIBE `{table_name}`")
        columns = cursor.fetchall()
        
        for col in columns:
            print(f"  {col[0]:20} {col[1]:20} {col[2]:8} {col[3]:8}")
        print()
    
    cursor.close()
    connection.close()
    
except Exception as e:
    print(f"❌ Error: {e}")
