from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app import models, schemas

router = APIRouter()

@router.get("/", response_model=list[schemas.Phone])
async def get_phones(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """Get all phones with pagination"""
    phones = db.query(models.Phone).offset(skip).limit(limit).all()
    return phones

@router.get("/{phone_id}", response_model=schemas.Phone)
async def get_phone(phone_id: int, db: Session = Depends(get_db)):
    """Get a specific phone by ID"""
    phone = db.query(models.Phone).filter(models.Phone.id == phone_id).first()
    if not phone:
        raise HTTPException(status_code=404, detail="Phone not found")
    return phone

@router.post("/", response_model=schemas.Phone)
async def create_phone(phone: schemas.PhoneCreate, db: Session = Depends(get_db)):
    """Create a new phone"""
    db_phone = models.Phone(**phone.model_dump())
    db.add(db_phone)
    db.commit()
    db.refresh(db_phone)
    return db_phone

@router.put("/{phone_id}", response_model=schemas.Phone)
async def update_phone(phone_id: int, phone: schemas.PhoneCreate, db: Session = Depends(get_db)):
    """Update a phone"""
    db_phone = db.query(models.Phone).filter(models.Phone.id == phone_id).first()
    if not db_phone:
        raise HTTPException(status_code=404, detail="Phone not found")
    
    for key, value in phone.model_dump().items():
        setattr(db_phone, key, value)
    
    db.commit()
    db.refresh(db_phone)
    return db_phone

@router.delete("/{phone_id}")
async def delete_phone(phone_id: int, db: Session = Depends(get_db)):
    """Delete a phone"""
    db_phone = db.query(models.Phone).filter(models.Phone.id == phone_id).first()
    if not db_phone:
        raise HTTPException(status_code=404, detail="Phone not found")
    
    db.delete(db_phone)
    db.commit()
    return {"message": "Phone deleted successfully"}
