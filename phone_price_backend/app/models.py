from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text, Boolean, BigInteger, Enum, DECIMAL, TIMESTAMP
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class Phone(Base):
    __tablename__ = "phones"
    
    id = Column(Integer, primary_key=True, index=True)
    brand = Column(String(100), index=True, nullable=False)
    model = Column(String(255), nullable=False)
    category = Column(Enum('budget', 'midrange', 'flagship', 'gaming', 'foldable'), nullable=False)
    image_url = Column(String(500), nullable=True)
    release_year = Column(Integer, nullable=True)
    created_at = Column(TIMESTAMP, nullable=True)
    
    shop_prices = relationship("ShopPrice", back_populates="phone")
    specs = relationship("Spec", back_populates="phone")
    phone_features = relationship("PhoneFeature", back_populates="phone")
    phone_ratings = relationship("PhoneRating", back_populates="phone")
    affiliate_links = relationship("AffiliateLink", back_populates="phone")
    price_alerts = relationship("PriceAlert", back_populates="phone")

class Shop(Base):
    __tablename__ = "shops"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    city = Column(String(100), nullable=True)
    address = Column(Text, nullable=True)
    phone = Column(String(50), nullable=True)
    whatsapp = Column(String(50), nullable=True)
    website = Column(String(255), nullable=True)
    verified = Column(Boolean, nullable=True)
    featured = Column(Boolean, nullable=True)
    created_at = Column(TIMESTAMP, nullable=True)
    
    shop_prices = relationship("ShopPrice", back_populates="shop")
    affiliate_links = relationship("AffiliateLink", back_populates="shop")

class ShopPrice(Base):
    __tablename__ = "shop_prices"
    
    id = Column(Integer, primary_key=True, index=True)
    phone_id = Column(Integer, ForeignKey("phones.id"), index=True, nullable=False)
    shop_id = Column(Integer, ForeignKey("shops.id"), index=True, nullable=False)
    price = Column(BigInteger, nullable=False, index=True)
    currency = Column(String(10), nullable=True)
    is_active = Column(Boolean, nullable=True)
    updated_at = Column(TIMESTAMP, nullable=True)
    
    phone = relationship("Phone", back_populates="shop_prices")
    shop = relationship("Shop", back_populates="shop_prices")

class Spec(Base):
    __tablename__ = "specs"
    
    id = Column(Integer, primary_key=True, index=True)
    phone_id = Column(Integer, ForeignKey("phones.id"), index=True, nullable=False)
    key_name = Column(String(100), nullable=False, index=True)
    value = Column(Text, nullable=False)
    
    phone = relationship("Phone", back_populates="specs")

class PhoneFeature(Base):
    __tablename__ = "phone_features"
    
    id = Column(Integer, primary_key=True, index=True)
    phone_id = Column(Integer, ForeignKey("phones.id"), index=True, nullable=False)
    feature = Column(String(100), nullable=False, index=True)
    score = Column(DECIMAL(3, 2), nullable=False)
    
    phone = relationship("Phone", back_populates="phone_features")

class PhoneRating(Base):
    __tablename__ = "phone_ratings"
    
    id = Column(Integer, primary_key=True, index=True)
    phone_id = Column(Integer, ForeignKey("phones.id"), index=True, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), index=True, nullable=False)
    rating = Column(Integer, nullable=True)
    comment = Column(Text, nullable=True)
    created_at = Column(TIMESTAMP, nullable=True)
    
    phone = relationship("Phone", back_populates="phone_ratings")
    user = relationship("User", back_populates="phone_ratings")

class AffiliateLink(Base):
    __tablename__ = "affiliate_links"
    
    id = Column(Integer, primary_key=True, index=True)
    phone_id = Column(Integer, ForeignKey("phones.id"), index=True, nullable=False)
    shop_id = Column(Integer, ForeignKey("shops.id"), index=True, nullable=False)
    link = Column(String(500), nullable=False)
    clicks = Column(Integer, nullable=True)
    created_at = Column(TIMESTAMP, nullable=True)
    
    phone = relationship("Phone", back_populates="affiliate_links")
    shop = relationship("Shop", back_populates="affiliate_links")

class PriceAlert(Base):
    __tablename__ = "price_alerts"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True, nullable=False)
    phone_id = Column(Integer, ForeignKey("phones.id"), index=True, nullable=False)
    target_price = Column(BigInteger, nullable=False)
    active = Column(Boolean, nullable=True)
    created_at = Column(TIMESTAMP, nullable=True)
    
    phone = relationship("Phone", back_populates="price_alerts")
    user = relationship("User", back_populates="price_alerts")

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False, unique=True)
    password_hash = Column(String(255), nullable=False)
    role = Column(Enum('user', 'admin', 'shop_owner'), nullable=True)
    shop_id = Column(Integer, ForeignKey("shops.id"), index=True, nullable=True)
    created_at = Column(TIMESTAMP, nullable=True)
    
    phone_ratings = relationship("PhoneRating", back_populates="user")
    price_alerts = relationship("PriceAlert", back_populates="user")

class Subscriber(Base):
    __tablename__ = "subscribers"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    name = Column(String(255), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(TIMESTAMP, nullable=True)
    updated_at = Column(TIMESTAMP, nullable=True)
