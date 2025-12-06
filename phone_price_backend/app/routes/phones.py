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

@router.get("/{phone_id}/specs")
async def get_phone_specs(phone_id: int, db: Session = Depends(get_db)):
    """Get all specifications for a specific phone"""
    phone = db.query(models.Phone).filter(models.Phone.id == phone_id).first()
    if not phone:
        raise HTTPException(status_code=404, detail="Phone not found")
    
    specs = db.query(models.Spec).filter(models.Spec.phone_id == phone_id).all()
    return [{"key": spec.key_name, "value": spec.value} for spec in specs]

@router.post("/{phone_id}/specs")
async def add_phone_spec(phone_id: int, spec_data: dict, db: Session = Depends(get_db)):
    """Add a specification to a phone"""
    phone = db.query(models.Phone).filter(models.Phone.id == phone_id).first()
    if not phone:
        raise HTTPException(status_code=404, detail="Phone not found")
    
    # Check if spec already exists
    existing = db.query(models.Spec).filter(
        models.Spec.phone_id == phone_id,
        models.Spec.key_name == spec_data.get('key')
    ).first()
    
    if existing:
        # Update existing spec
        existing.value = spec_data.get('value')
        db.commit()
        db.refresh(existing)
        return {"key": existing.key_name, "value": existing.value}
    else:
        # Create new spec
        new_spec = models.Spec(
            phone_id=phone_id,
            key_name=spec_data.get('key'),
            value=spec_data.get('value')
        )
        db.add(new_spec)
        db.commit()
        db.refresh(new_spec)
        return {"key": new_spec.key_name, "value": new_spec.value}

@router.put("/{phone_id}/specs/bulk")
async def update_phone_specs_bulk(phone_id: int, specs_data: list[dict], db: Session = Depends(get_db)):
    """Update multiple specifications for a phone at once"""
    phone = db.query(models.Phone).filter(models.Phone.id == phone_id).first()
    if not phone:
        raise HTTPException(status_code=404, detail="Phone not found")
    
    # Delete all existing specs for this phone
    db.query(models.Spec).filter(models.Spec.phone_id == phone_id).delete()
    
    # Add new specs
    for spec_data in specs_data:
        new_spec = models.Spec(
            phone_id=phone_id,
            key_name=spec_data.get('key'),
            value=spec_data.get('value')
        )
        db.add(new_spec)
    
    db.commit()
    return {"message": "Specifications updated successfully"}
