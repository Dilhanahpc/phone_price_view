from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app import models, schemas

router = APIRouter()

@router.get("/", response_model=list[schemas.Shop])
async def get_shops(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """Get all shops with pagination"""
    shops = db.query(models.Shop).offset(skip).limit(limit).all()
    return shops

@router.get("/{shop_id}", response_model=schemas.Shop)
async def get_shop(shop_id: int, db: Session = Depends(get_db)):
    """Get a specific shop by ID"""
    shop = db.query(models.Shop).filter(models.Shop.id == shop_id).first()
    if not shop:
        raise HTTPException(status_code=404, detail="Shop not found")
    return shop

@router.post("/", response_model=schemas.Shop)
async def create_shop(shop: schemas.ShopCreate, db: Session = Depends(get_db)):
    """Create a new shop"""
    db_shop = models.Shop(**shop.model_dump())
    db.add(db_shop)
    db.commit()
    db.refresh(db_shop)
    return db_shop

@router.put("/{shop_id}", response_model=schemas.Shop)
async def update_shop(shop_id: int, shop: schemas.ShopCreate, db: Session = Depends(get_db)):
    """Update a shop"""
    db_shop = db.query(models.Shop).filter(models.Shop.id == shop_id).first()
    if not db_shop:
        raise HTTPException(status_code=404, detail="Shop not found")
    
    for key, value in shop.model_dump().items():
        setattr(db_shop, key, value)
    
    db.commit()
    db.refresh(db_shop)
    return db_shop

@router.delete("/{shop_id}")
async def delete_shop(shop_id: int, db: Session = Depends(get_db)):
    """Delete a shop"""
    db_shop = db.query(models.Shop).filter(models.Shop.id == shop_id).first()
    if not db_shop:
        raise HTTPException(status_code=404, detail="Shop not found")
    
    db.delete(db_shop)
    db.commit()
    return {"message": "Shop deleted successfully"}
