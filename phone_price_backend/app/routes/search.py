from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.database import get_db
from app import models, schemas

router = APIRouter()

@router.get("/phones", response_model=schemas.SearchResponse)
async def search_phones(
    q: str = Query(..., min_length=1, description="Search query"),
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """Search phones by brand or model"""
    search_term = f"%{q}%"
    
    phones = db.query(models.Phone).filter(
        or_(
            models.Phone.brand.ilike(search_term),
            models.Phone.model.ilike(search_term)
        )
    ).offset(skip).limit(limit).all()
    
    total_count = db.query(models.Phone).filter(
        or_(
            models.Phone.brand.ilike(search_term),
            models.Phone.model.ilike(search_term)
        )
    ).count()
    
    return schemas.SearchResponse(phones=phones, total_count=total_count)

@router.get("/shops", response_model=list[schemas.Shop])
async def search_shops(
    q: str = Query(..., min_length=1, description="Search query"),
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """Search shops by name or city"""
    search_term = f"%{q}%"
    
    shops = db.query(models.Shop).filter(
        or_(
            models.Shop.name.ilike(search_term),
            models.Shop.city.ilike(search_term)
        )
    ).offset(skip).limit(limit).all()
    
    return shops

@router.get("/prices/range", response_model=list[schemas.ShopPrice])
async def search_price_range(
    min_price: int = Query(..., ge=0, description="Minimum price"),
    max_price: int = Query(..., ge=0, description="Maximum price"),
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """Search phones by price range"""
    if min_price > max_price:
        min_price, max_price = max_price, min_price
    
    prices = db.query(models.ShopPrice).filter(
        models.ShopPrice.price.between(min_price, max_price)
    ).offset(skip).limit(limit).all()
    
    return prices

@router.get("/by-brand", response_model=list[schemas.Phone])
async def search_by_brand(
    brand: str = Query(..., min_length=1, description="Brand name"),
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """Get all phones by a specific brand"""
    phones = db.query(models.Phone).filter(
        models.Phone.brand.ilike(f"%{brand}%")
    ).offset(skip).limit(limit).all()
    
    return phones
