from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Subscriber
from app.services.email_service import send_welcome_email
from typing import List
from pydantic import BaseModel, EmailStr

# Define schemas inline since schemas.py doesn't have these
class SubscriberCreate(BaseModel):
    email: EmailStr
    name: str = None

class SubscriberResponse(BaseModel):
    id: int
    email: str
    name: str = None
    is_active: bool
    
    class Config:
        from_attributes = True

router = APIRouter(prefix="/api/subscribers", tags=["subscribers"])

@router.post("/", response_model=SubscriberResponse)
def create_subscriber(subscriber: SubscriberCreate, db: Session = Depends(get_db)):
    """Subscribe to price update notifications"""
    # Check if email already exists
    db_subscriber = db.query(Subscriber).filter(Subscriber.email == subscriber.email).first()
    if db_subscriber:
        if db_subscriber.is_active:
            raise HTTPException(status_code=400, detail="Email already subscribed")
        else:
            # Reactivate subscription
            db_subscriber.is_active = True
            db_subscriber.name = subscriber.name
            db.commit()
            db.refresh(db_subscriber)
            # Send welcome email
            send_welcome_email(db_subscriber.email, db_subscriber.name)
            return db_subscriber
    
    # Create new subscriber
    new_subscriber = Subscriber(
        email=subscriber.email,
        name=subscriber.name
    )
    db.add(new_subscriber)
    db.commit()
    db.refresh(new_subscriber)
    
    # Send welcome email
    send_welcome_email(new_subscriber.email, new_subscriber.name)
    
    return new_subscriber

@router.delete("/{email}")
def unsubscribe(email: str, db: Session = Depends(get_db)):
    """Unsubscribe from notifications"""
    subscriber = db.query(Subscriber).filter(Subscriber.email == email).first()
    if not subscriber:
        raise HTTPException(status_code=404, detail="Subscriber not found")
    
    subscriber.is_active = False
    db.commit()
    return {"message": "Successfully unsubscribed"}

@router.get("/", response_model=List[SubscriberResponse])
def get_all_subscribers(db: Session = Depends(get_db)):
    """Get all active subscribers (admin only)"""
    subscribers = db.query(Subscriber).filter(Subscriber.is_active == True).all()
    return subscribers
