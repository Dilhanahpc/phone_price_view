import pymysql
import os
from dotenv import load_dotenv

# Load local environment
load_dotenv('phone_price_backend/.env')

# Local database connection
local_conn = pymysql.connect(
    host='localhost',
    user='root',
    password='20040127Ch@',
    database='phone_prices',
    charset='utf8mb4'
)

# Railway database connection (get from Railway MySQL variables)
railway_url = input("Paste Railway DATABASE_URL (from Railway MySQL Variables tab): ")
# Parse URL: mysql://user:password@host:port/database
railway_url = railway_url.replace('mysql://', '')
user_pass, host_db = railway_url.split('@')
user, password = user_pass.split(':')
host_port, database = host_db.split('/')
host, port = host_port.split(':')

railway_conn = pymysql.connect(
    host=host,
    port=int(port),
    user=user,
    password=password,
    database=database,
    charset='utf8mb4'
)

print("✅ Connected to both databases!")

# Get all tables from local database in correct order (to handle foreign keys)
local_cursor = local_conn.cursor()
# Order matters: parent tables first, then child tables
tables = ['users', 'shops', 'phones', 'specs', 'phone_features', 'phone_ratings', 
          'shop_prices', 'reviews', 'price_alerts', 'affiliate_links', 'subscribers']

print(f"\n📋 Migrating {len(tables)} tables in order...")

railway_cursor = railway_conn.cursor()

# Copy data from each table
for table in tables:
    print(f"\n🔄 Copying table: {table}")
    
    # Get all data from local table
    local_cursor.execute(f"SELECT * FROM {table}")
    rows = local_cursor.fetchall()
    
    if len(rows) == 0:
        print(f"   ⚠️  Table {table} is empty, skipping...")
        continue
    
    # Get column names
    local_cursor.execute(f"DESCRIBE {table}")
    columns = [col[0] for col in local_cursor.fetchall()]
    
    # Check if table exists in Railway, if not create it
    railway_cursor.execute(f"SHOW TABLES LIKE '{table}'")
    table_exists = railway_cursor.fetchone()
    
    if not table_exists:
        # Create table in Railway
        local_cursor.execute(f"SHOW CREATE TABLE {table}")
        create_stmt = local_cursor.fetchone()[1]
        railway_cursor.execute(create_stmt)
        print(f"   📋 Created table structure")
    
    # Clear existing data
    railway_cursor.execute(f"DELETE FROM {table}")
    railway_conn.commit()
    
    # Insert data
    placeholders = ', '.join(['%s'] * len(columns))
    column_names = ', '.join([f'`{col}`' for col in columns])
    insert_sql = f"INSERT INTO {table} ({column_names}) VALUES ({placeholders})"
    
    railway_cursor.executemany(insert_sql, rows)
    railway_conn.commit()
    
    print(f"   ✅ Copied {len(rows)} rows to {table}")

print("\n🎉 Database migration completed successfully!")

local_conn.close()
railway_conn.close()
