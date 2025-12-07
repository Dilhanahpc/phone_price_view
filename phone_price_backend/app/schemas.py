from pydantic import BaseModel, Field
from typing import Optional, List, Literal
from datetime import datetime

# Phone Schemas
class PhoneBase(BaseModel):
    brand: str
    model: str
    category: Literal['budget', 'midrange', 'flagship', 'gaming', 'foldable'] = Field(
        ..., 
        description="Phone category. Must be one of: budget, midrange, flagship, gaming, foldable"
    )
    image_url: Optional[str] = None
    release_year: Optional[int] = None

class PhoneCreate(PhoneBase):
    pass

class Phone(PhoneBase):
    id: int
    created_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

# Shop Schemas
class ShopBase(BaseModel):
    name: str
    city: Optional[str] = None
    address: Optional[str] = None
    phone: Optional[str] = None
    whatsapp: Optional[str] = None
    website: Optional[str] = None
    verified: Optional[bool] = False
    featured: Optional[bool] = False

class ShopCreate(ShopBase):
    pass

class Shop(ShopBase):
    id: int
    created_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

# ShopPrice Schemas
class ShopPriceBase(BaseModel):
    phone_id: int
    shop_id: int
    price: int  # Using int to match BigInteger database column
    currency: Optional[str] = "LKR"
    is_active: Optional[bool] = True

class ShopPriceCreate(ShopPriceBase):
    pass

class ShopPrice(ShopPriceBase):
    id: int
    updated_at: Optional[datetime] = None
    phone: Optional[Phone] = None
    shop: Optional[Shop] = None
    
    class Config:
        from_attributes = True

# Spec Schemas
class SpecBase(BaseModel):
    phone_id: int
    key_name: str
    value: str

class SpecCreate(SpecBase):
    pass

class Spec(SpecBase):
    id: int
    
    class Config:
        from_attributes = True

# PhoneFeature Schemas
class PhoneFeatureBase(BaseModel):
    phone_id: int
    feature: str
    score: float

class PhoneFeatureCreate(PhoneFeatureBase):
    pass

class PhoneFeature(PhoneFeatureBase):
    id: int
    
    class Config:
        from_attributes = True

# PhoneRating Schemas
class PhoneRatingBase(BaseModel):
    phone_id: int
    user_id: int
    rating: Optional[int] = None
    comment: Optional[str] = None

class PhoneRatingCreate(PhoneRatingBase):
    pass

class PhoneRating(PhoneRatingBase):
    id: int
    created_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

# AffiliateLink Schemas
class AffiliateLinkBase(BaseModel):
    phone_id: int
    shop_id: int
    link: str
    clicks: Optional[int] = 0

class AffiliateLinkCreate(AffiliateLinkBase):
    pass

class AffiliateLink(AffiliateLinkBase):
    id: int
    created_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

# PriceAlert Schemas
class PriceAlertBase(BaseModel):
    user_id: int
    phone_id: int
    target_price: int
    active: Optional[bool] = True

class PriceAlertCreate(PriceAlertBase):
    pass

class PriceAlert(PriceAlertBase):
    id: int
    created_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

# User Schemas
class UserBase(BaseModel):
    name: str
    email: str
    role: Optional[Literal['user', 'admin', 'shop_owner']] = Field(
        'user',
        description="User role. Must be one of: user, admin, shop_owner"
    )
    shop_id: Optional[int] = None

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    created_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

# Search Response Schema
class SearchResponse(BaseModel):
    phones: List[Phone]
    total_count: int

# Price Comparison Schema
class PriceComparison(BaseModel):
    phone: Phone
    prices: List[ShopPrice]

# Review Schemas
class ReviewBase(BaseModel):
    phone_id: int
    user_name: str
    rating: int = Field(..., ge=1, le=5, description="Rating must be between 1 and 5")
    comment: str

class ReviewCreate(ReviewBase):
    pass

class ReviewUpdate(BaseModel):
    helpful: Optional[int] = None

class Review(ReviewBase):
    id: int
    helpful: int = 0
    created_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

class ReviewWithPhone(Review):
    phone_name: str

