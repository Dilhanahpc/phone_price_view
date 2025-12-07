import mysql.connector
from mysql.connector import Error

def create_reviews_table():
    try:
        # Connect to MySQL
        connection = mysql.connector.connect(
            host='localhost',
            user='root',
            password='20040127Ch@',
            database='phone_prices'
        )
        
        if connection.is_connected():
            cursor = connection.cursor()
            
            # Create reviews table
            create_table_query = """
            CREATE TABLE IF NOT EXISTS reviews (
                id INT AUTO_INCREMENT PRIMARY KEY,
                phone_id INT NOT NULL,
                user_name VARCHAR(255) NOT NULL,
                rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
                comment TEXT NOT NULL,
                helpful INT DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (phone_id) REFERENCES phones(id) ON DELETE CASCADE,
                INDEX idx_phone_id (phone_id),
                INDEX idx_rating (rating),
                INDEX idx_created_at (created_at)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
            """
            
            cursor.execute(create_table_query)
            print("✅ Reviews table created successfully!")
            
            # Insert some sample reviews
            sample_reviews = [
                (1, 'Kasun Perera', 5, 'Excellent phone! Camera quality is outstanding and battery lasts all day. Highly recommended for photography enthusiasts.', 24),
                (1, 'Nimal Silva', 4, 'Great performance and display. Only downside is it gets a bit warm during heavy gaming sessions.', 15),
                (2, 'Ayesha Fernando', 5, 'Best iPhone yet! The camera is incredible, and the battery life is much better than previous models.', 32)
            ]
            
            insert_query = """
            INSERT INTO reviews (phone_id, user_name, rating, comment, helpful)
            VALUES (%s, %s, %s, %s, %s)
            """
            
            cursor.executemany(insert_query, sample_reviews)
            connection.commit()
            print(f"✅ Inserted {cursor.rowcount} sample reviews!")
            
            # Show created table structure
            cursor.execute("DESCRIBE reviews")
            print("\n📋 Reviews table structure:")
            for row in cursor.fetchall():
                print(f"  {row[0]}: {row[1]}")
            
            cursor.close()
            
    except Error as e:
        print(f"❌ Error: {e}")
    finally:
        if connection.is_connected():
            connection.close()
            print("\n✅ Database connection closed")

if __name__ == "__main__":
    create_reviews_table()
