"""
List all databases on MySQL server
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
    
    # Show all databases
    cursor.execute("SHOW DATABASES")
    print("\n📋 All databases on your MySQL server:")
    for db in cursor:
        print(f"  - {db[0]}")
    
    cursor.close()
    connection.close()
    
    print("\n✅ Connection successful!")
    print("\nPlease tell me which database name you want to use from the list above.")
    
except Exception as e:
    print(f"❌ Error: {e}")
