"""
Sample Data Seeder for Phone Price Database
This script populates the database with sample phones, shops, and prices.
"""

from sqlalchemy.orm import Session
from app.database import SessionLocal, engine
from app import models
from datetime import datetime

def seed_database():
    db = SessionLocal()
    
    try:
        print("🌱 Starting database seeding...")
        
        # Clear existing data (optional - comment out if you want to keep existing data)
        print("🗑️  Clearing existing data...")
        db.query(models.ShopPrice).delete()
        db.query(models.Phone).delete()
        db.query(models.Shop).delete()
        db.commit()
        
        # Create Shops
        print("🏪 Creating shops...")
        shops = [
            models.Shop(
                name="Singer Mega Electronics",
                city="Colombo",
                address="Main Street, Colombo 01",
                phone="+94112345678",
                whatsapp="+94771234567",
                website="https://www.singeronline.com",
                verified=True,
                featured=True
            ),
            models.Shop(
                name="Abans Electronics",
                city="Kandy",
                address="Temple Street, Kandy",
                phone="+94812345678",
                whatsapp="+94777654321",
                website="https://www.abans.lk",
                verified=True,
                featured=True
            ),
            models.Shop(
                name="Softlogic Holdings",
                city="Colombo",
                address="Liberty Plaza, Colombo 03",
                phone="+94112987654",
                website="https://www.softlogic.lk",
                verified=True,
                featured=False
            ),
            models.Shop(
                name="Dialog Store",
                city="Galle",
                address="Galle Road, Galle",
                phone="+94912345678",
                whatsapp="+94763456789",
                verified=True,
                featured=False
            ),
            models.Shop(
                name="Hutchison Store",
                city="Colombo",
                address="Union Place, Colombo 02",
                phone="+94115678901",
                verified=True,
                featured=False
            ),
        ]
        
        db.add_all(shops)
        db.commit()
        print(f"✅ Created {len(shops)} shops")
        
        # Create Phones
        print("📱 Creating phones...")
        phones = [
            # Flagship phones
            models.Phone(
                brand="Apple",
                model="iPhone 15 Pro Max",
                category="flagship",
                image_url="https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&q=80&auto=format&fit=crop",
                release_year=2023
            ),
            models.Phone(
                brand="Samsung",
                model="Galaxy S24 Ultra",
                category="flagship",
                image_url="https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&q=80&auto=format&fit=crop",
                release_year=2024
            ),
            models.Phone(
                brand="Google",
                model="Pixel 8 Pro",
                category="flagship",
                image_url="https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&q=80&auto=format&fit=crop",
                release_year=2023
            ),
            models.Phone(
                brand="OnePlus",
                model="12 Pro",
                category="flagship",
                image_url="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80&auto=format&fit=crop",
                release_year=2024
            ),
            
            # Midrange phones
            models.Phone(
                brand="Samsung",
                model="Galaxy A54 5G",
                category="midrange",
                image_url="https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=600&q=80&auto=format&fit=crop",
                release_year=2023
            ),
            models.Phone(
                brand="Google",
                model="Pixel 7a",
                category="midrange",
                image_url="https://images.unsplash.com/photo-1556656793-08538906a9f8?w=600&q=80&auto=format&fit=crop",
                release_year=2023
            ),
            models.Phone(
                brand="OnePlus",
                model="Nord 3",
                category="midrange",
                image_url="https://images.unsplash.com/photo-1592286927505-98e8e0840a43?w=600&q=80&auto=format&fit=crop",
                release_year=2023
            ),
            models.Phone(
                brand="Xiaomi",
                model="13T Pro",
                category="midrange",
                image_url="https://images.unsplash.com/photo-1567581935884-3349723552ca?w=600&q=80&auto=format&fit=crop",
                release_year=2023
            ),
            
            # Gaming phones
            models.Phone(
                brand="ASUS",
                model="ROG Phone 7",
                category="gaming",
                image_url="https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=600&q=80&auto=format&fit=crop",
                release_year=2023
            ),
            models.Phone(
                brand="Nubia",
                model="RedMagic 9 Pro",
                category="gaming",
                image_url="https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=600&q=80&auto=format&fit=crop",
                release_year=2024
            ),
            
            # Budget phones
            models.Phone(
                brand="Samsung",
                model="Galaxy A14",
                category="budget",
                image_url="https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=600&q=80&auto=format&fit=crop",
                release_year=2023
            ),
            models.Phone(
                brand="Xiaomi",
                model="Redmi Note 13",
                category="budget",
                image_url="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80&auto=format&fit=crop",
                release_year=2024
            ),
            models.Phone(
                brand="Realme",
                model="C55",
                category="budget",
                image_url="https://images.unsplash.com/photo-1591122947157-26bad3a117d2?w=600&q=80&auto=format&fit=crop",
                release_year=2023
            ),
            
            # Foldable phones
            models.Phone(
                brand="Samsung",
                model="Galaxy Z Fold 5",
                category="foldable",
                image_url="https://images.unsplash.com/photo-1678652168675-694b4c17f60f?w=600&q=80&auto=format&fit=crop",
                release_year=2023
            ),
            models.Phone(
                brand="Samsung",
                model="Galaxy Z Flip 5",
                category="foldable",
                image_url="https://images.unsplash.com/photo-1678652168675-694b4c17f60f?w=600&q=80&auto=format&fit=crop",
                release_year=2023
            ),
        ]
        
        db.add_all(phones)
        db.commit()
        print(f"✅ Created {len(phones)} phones")
        
        # Refresh to get IDs
        for phone in phones:
            db.refresh(phone)
        for shop in shops:
            db.refresh(shop)
        
        # Create Shop Prices
        print("💰 Creating shop prices...")
        prices = [
            # iPhone 15 Pro Max prices
            models.ShopPrice(phone_id=phones[0].id, shop_id=shops[0].id, price=580000, currency="LKR", is_active=True),
            models.ShopPrice(phone_id=phones[0].id, shop_id=shops[1].id, price=575000, currency="LKR", is_active=True),
            models.ShopPrice(phone_id=phones[0].id, shop_id=shops[2].id, price=590000, currency="LKR", is_active=True),
            
            # Galaxy S24 Ultra prices
            models.ShopPrice(phone_id=phones[1].id, shop_id=shops[0].id, price=480000, currency="LKR", is_active=True),
            models.ShopPrice(phone_id=phones[1].id, shop_id=shops[1].id, price=475000, currency="LKR", is_active=True),
            models.ShopPrice(phone_id=phones[1].id, shop_id=shops[3].id, price=485000, currency="LKR", is_active=True),
            
            # Pixel 8 Pro prices
            models.ShopPrice(phone_id=phones[2].id, shop_id=shops[0].id, price=380000, currency="LKR", is_active=True),
            models.ShopPrice(phone_id=phones[2].id, shop_id=shops[2].id, price=375000, currency="LKR", is_active=True),
            models.ShopPrice(phone_id=phones[2].id, shop_id=shops[4].id, price=385000, currency="LKR", is_active=True),
            
            # OnePlus 12 Pro prices
            models.ShopPrice(phone_id=phones[3].id, shop_id=shops[1].id, price=320000, currency="LKR", is_active=True),
            models.ShopPrice(phone_id=phones[3].id, shop_id=shops[3].id, price=315000, currency="LKR", is_active=True),
            
            # Galaxy A54 5G prices
            models.ShopPrice(phone_id=phones[4].id, shop_id=shops[0].id, price=145000, currency="LKR", is_active=True),
            models.ShopPrice(phone_id=phones[4].id, shop_id=shops[1].id, price=140000, currency="LKR", is_active=True),
            models.ShopPrice(phone_id=phones[4].id, shop_id=shops[2].id, price=148000, currency="LKR", is_active=True),
            
            # Pixel 7a prices
            models.ShopPrice(phone_id=phones[5].id, shop_id=shops[0].id, price=165000, currency="LKR", is_active=True),
            models.ShopPrice(phone_id=phones[5].id, shop_id=shops[3].id, price=160000, currency="LKR", is_active=True),
            
            # OnePlus Nord 3 prices
            models.ShopPrice(phone_id=phones[6].id, shop_id=shops[1].id, price=125000, currency="LKR", is_active=True),
            models.ShopPrice(phone_id=phones[6].id, shop_id=shops[4].id, price=120000, currency="LKR", is_active=True),
            
            # Xiaomi 13T Pro prices
            models.ShopPrice(phone_id=phones[7].id, shop_id=shops[0].id, price=175000, currency="LKR", is_active=True),
            models.ShopPrice(phone_id=phones[7].id, shop_id=shops[2].id, price=172000, currency="LKR", is_active=True),
            
            # ROG Phone 7 prices
            models.ShopPrice(phone_id=phones[8].id, shop_id=shops[1].id, price=350000, currency="LKR", is_active=True),
            models.ShopPrice(phone_id=phones[8].id, shop_id=shops[3].id, price=345000, currency="LKR", is_active=True),
            
            # RedMagic 9 Pro prices
            models.ShopPrice(phone_id=phones[9].id, shop_id=shops[0].id, price=280000, currency="LKR", is_active=True),
            models.ShopPrice(phone_id=phones[9].id, shop_id=shops[4].id, price=275000, currency="LKR", is_active=True),
            
            # Galaxy A14 prices
            models.ShopPrice(phone_id=phones[10].id, shop_id=shops[0].id, price=65000, currency="LKR", is_active=True),
            models.ShopPrice(phone_id=phones[10].id, shop_id=shops[1].id, price=62000, currency="LKR", is_active=True),
            models.ShopPrice(phone_id=phones[10].id, shop_id=shops[2].id, price=68000, currency="LKR", is_active=True),
            
            # Redmi Note 13 prices
            models.ShopPrice(phone_id=phones[11].id, shop_id=shops[0].id, price=85000, currency="LKR", is_active=True),
            models.ShopPrice(phone_id=phones[11].id, shop_id=shops[3].id, price=82000, currency="LKR", is_active=True),
            
            # Realme C55 prices
            models.ShopPrice(phone_id=phones[12].id, shop_id=shops[1].id, price=55000, currency="LKR", is_active=True),
            models.ShopPrice(phone_id=phones[12].id, shop_id=shops[4].id, price=52000, currency="LKR", is_active=True),
            
            # Galaxy Z Fold 5 prices
            models.ShopPrice(phone_id=phones[13].id, shop_id=shops[0].id, price=685000, currency="LKR", is_active=True),
            models.ShopPrice(phone_id=phones[13].id, shop_id=shops[2].id, price=680000, currency="LKR", is_active=True),
            
            # Galaxy Z Flip 5 prices
            models.ShopPrice(phone_id=phones[14].id, shop_id=shops[1].id, price=420000, currency="LKR", is_active=True),
            models.ShopPrice(phone_id=phones[14].id, shop_id=shops[3].id, price=415000, currency="LKR", is_active=True),
        ]
        
        db.add_all(prices)
        db.commit()
        print(f"✅ Created {len(prices)} shop prices")
        
        print("\n🎉 Database seeding completed successfully!")
        print(f"\n📊 Summary:")
        print(f"   - Shops: {len(shops)}")
        print(f"   - Phones: {len(phones)}")
        print(f"   - Prices: {len(prices)}")
        print(f"\n🌐 You can now access:")
        print(f"   - Frontend: http://localhost:5173")
        print(f"   - Backend API: http://localhost:8000")
        print(f"   - API Docs: http://localhost:8000/docs")
        
    except Exception as e:
        print(f"❌ Error seeding database: {e}")
        db.rollback()
        raise
    finally:
        db.close()

if __name__ == "__main__":
    print("🚀 Phone Price Database Seeder")
    print("=" * 50)
    seed_database()
