"""
Complete data migration from local MySQL to Railway MySQL
Migrates ALL data in correct order to handle foreign key constraints
"""
import pymysql
from datetime import datetime

# Local database connection
LOCAL_DB = {
    'host': 'localhost',
    'user': 'root',
    'password': '20040127Ch@',
    'database': 'phone_prices',
    'charset': 'utf8mb4'
}

# Railway database connection
RAILWAY_DB = {
    'host': 'shuttle.proxy.rlwy.net',
    'port': 26131,
    'user': 'root',
    'password': 'EvkCbyDIZpTVaHuJsaSwjVOsLgzrZcxB',
    'database': 'railway',
    'charset': 'utf8mb4'
}

# Tables in order (respecting foreign key dependencies)
TABLES_ORDER = [
    'users',        # No dependencies
    'shops',        # No dependencies
    'phones',       # No dependencies
    'specs',        # Depends on phones
    'phone_features',  # Depends on phones
    'shop_prices',  # Depends on phones, shops
    'reviews',      # Depends on phones
    'price_alerts', # Depends on users, phones
    'affiliate_links',  # Depends on phones, shops
    'subscribers',  # No dependencies
    'phone_ratings' # Depends on phones, users
]

def migrate_table(source_conn, dest_conn, table_name):
    """Migrate a single table from source to destination"""
    print(f"\n{'='*60}")
    print(f"📊 Migrating table: {table_name}")
    print(f"{'='*60}")
    
    try:
        # Get data from source
        with source_conn.cursor() as cursor:
            cursor.execute(f"SELECT * FROM {table_name}")
            rows = cursor.fetchall()
            columns = [desc[0] for desc in cursor.description]
            
        if not rows:
            print(f"⚠️  Table '{table_name}' is empty - skipping")
            return True
            
        print(f"Found {len(rows)} rows to migrate")
        
        # Clear destination table first
        with dest_conn.cursor() as cursor:
            cursor.execute(f"DELETE FROM {table_name}")
            dest_conn.commit()
            print(f"✅ Cleared existing data from Railway table")
        
        # Insert data into destination
        placeholders = ', '.join(['%s'] * len(columns))
        column_names = ', '.join([f'`{col}`' for col in columns])
        insert_query = f"INSERT INTO {table_name} ({column_names}) VALUES ({placeholders})"
        
        with dest_conn.cursor() as cursor:
            # Insert in batches of 100
            batch_size = 100
            for i in range(0, len(rows), batch_size):
                batch = rows[i:i + batch_size]
                cursor.executemany(insert_query, batch)
                dest_conn.commit()
                print(f"  ✓ Inserted batch {i//batch_size + 1} ({len(batch)} rows)")
        
        print(f"✅ Successfully migrated {len(rows)} rows from {table_name}")
        return True
        
    except Exception as e:
        print(f"❌ Error migrating table '{table_name}': {e}")
        import traceback
        traceback.print_exc()
        return False

def main():
    print("\n" + "=" * 70)
    print("🚀 COMPLETE DATABASE MIGRATION: LOCAL → RAILWAY")
    print("=" * 70)
    print(f"\nSource: {LOCAL_DB['host']}/{LOCAL_DB['database']}")
    print(f"Destination: {RAILWAY_DB['host']}/{RAILWAY_DB['database']}")
    print(f"\nMigrating {len(TABLES_ORDER)} tables in dependency order...")
    
    # Connect to both databases
    try:
        print("\n📡 Connecting to databases...")
        source_conn = pymysql.connect(**LOCAL_DB)
        dest_conn = pymysql.connect(**RAILWAY_DB)
        print("✅ Connected to both databases!")
        
        # Disable foreign key checks temporarily
        with dest_conn.cursor() as cursor:
            cursor.execute("SET FOREIGN_KEY_CHECKS = 0")
            dest_conn.commit()
        
        # Migrate each table
        success_count = 0
        failed_tables = []
        
        for table_name in TABLES_ORDER:
            if migrate_table(source_conn, dest_conn, table_name):
                success_count += 1
            else:
                failed_tables.append(table_name)
        
        # Re-enable foreign key checks
        with dest_conn.cursor() as cursor:
            cursor.execute("SET FOREIGN_KEY_CHECKS = 1")
            dest_conn.commit()
        
        # Summary
        print("\n" + "=" * 70)
        print("📊 MIGRATION SUMMARY")
        print("=" * 70)
        print(f"✅ Successfully migrated: {success_count}/{len(TABLES_ORDER)} tables")
        if failed_tables:
            print(f"❌ Failed tables: {', '.join(failed_tables)}")
        else:
            print("🎉 ALL TABLES MIGRATED SUCCESSFULLY!")
        print("=" * 70)
        
        # Close connections
        source_conn.close()
        dest_conn.close()
        
        return len(failed_tables) == 0
        
    except Exception as e:
        print(f"\n❌ Connection error: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)
