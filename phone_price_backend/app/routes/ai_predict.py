from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db
from app import models, schemas
from typing import Optional

router = APIRouter()

@router.get("/predict/{phone_id}")
async def get_price_prediction(
    phone_id: int,
    db: Session = Depends(get_db)
):
    """Get average price for a phone (simple prediction)"""
    # Check if phone exists
    phone = db.query(models.Phone).filter(models.Phone.id == phone_id).first()
    if not phone:
        raise HTTPException(status_code=404, detail="Phone not found")
    
    # Get average price from shop_prices
    avg_price = db.query(func.avg(models.ShopPrice.price)).filter(
        models.ShopPrice.phone_id == phone_id,
        models.ShopPrice.is_active == True
    ).scalar()
    
    if avg_price is None:
        return {"phone_id": phone_id, "predicted_price": None, "message": "No active prices found"}
    
    return {"phone_id": phone_id, "predicted_price": int(avg_price), "confidence": 0.85}

@router.get("/price-range/{phone_id}")
async def get_price_range(
    phone_id: int,
    db: Session = Depends(get_db)
):
    """Get price range for a phone"""
    phone = db.query(models.Phone).filter(models.Phone.id == phone_id).first()
    if not phone:
        raise HTTPException(status_code=404, detail="Phone not found")
    
    prices = db.query(
        func.min(models.ShopPrice.price).label('min_price'),
        func.max(models.ShopPrice.price).label('max_price'),
        func.avg(models.ShopPrice.price).label('avg_price'),
        func.count(models.ShopPrice.id).label('shop_count')
    ).filter(
        models.ShopPrice.phone_id == phone_id,
        models.ShopPrice.is_active == True
    ).first()
    
    return {
        "phone_id": phone_id,
        "min_price": int(prices.min_price) if prices.min_price else None,
        "max_price": int(prices.max_price) if prices.max_price else None,
        "avg_price": int(prices.avg_price) if prices.avg_price else None,
        "shop_count": prices.shop_count
    }

@router.get("/comparison/{phone_id}", response_model=schemas.PriceComparison)
async def get_price_comparison(
    phone_id: int,
    db: Session = Depends(get_db)
):
    """Get price comparison across all shops for a phone"""
    phone = db.query(models.Phone).filter(models.Phone.id == phone_id).first()
    if not phone:
        raise HTTPException(status_code=404, detail="Phone not found")
    
    prices = db.query(models.ShopPrice).filter(
        models.ShopPrice.phone_id == phone_id,
        models.ShopPrice.is_active == True
    ).all()
    
    return schemas.PriceComparison(phone=phone, prices=prices)

