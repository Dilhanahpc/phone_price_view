from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models import Review as ReviewModel, Phone
from app.schemas import Review, ReviewCreate, ReviewUpdate, ReviewWithPhone
from datetime import datetime

router = APIRouter(
    prefix="/api/reviews",
    tags=["reviews"]
)

@router.post("/", response_model=Review)
def create_review(review: ReviewCreate, db: Session = Depends(get_db)):
    """Create a new review"""
    # Verify phone exists
    phone = db.query(Phone).filter(Phone.id == review.phone_id).first()
    if not phone:
        raise HTTPException(status_code=404, detail="Phone not found")
    
    # Create review
    db_review = ReviewModel(
        phone_id=review.phone_id,
        user_name=review.user_name,
        rating=review.rating,
        comment=review.comment,
        helpful=0,
        created_at=datetime.now()
    )
    
    db.add(db_review)
    db.commit()
    db.refresh(db_review)
    
    return db_review

@router.get("/", response_model=List[ReviewWithPhone])
def get_reviews(
    phone_id: Optional[int] = Query(None, description="Filter by phone ID"),
    rating: Optional[int] = Query(None, ge=1, le=5, description="Filter by rating"),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    db: Session = Depends(get_db)
):
    """Get all reviews with optional filters"""
    query = db.query(ReviewModel, Phone).join(Phone, ReviewModel.phone_id == Phone.id)
    
    if phone_id:
        query = query.filter(ReviewModel.phone_id == phone_id)
    
    if rating:
        query = query.filter(ReviewModel.rating == rating)
    
    # Order by created_at descending (most recent first)
    query = query.order_by(ReviewModel.created_at.desc())
    
    reviews = query.offset(skip).limit(limit).all()
    
    # Format response with phone name
    result = []
    for review, phone in reviews:
        result.append({
            "id": review.id,
            "phone_id": review.phone_id,
            "user_name": review.user_name,
            "rating": review.rating,
            "comment": review.comment,
            "helpful": review.helpful,
            "created_at": review.created_at,
            "phone_name": f"{phone.brand} {phone.model}"
        })
    
    return result

@router.get("/{review_id}", response_model=Review)
def get_review(review_id: int, db: Session = Depends(get_db)):
    """Get a specific review by ID"""
    review = db.query(ReviewModel).filter(ReviewModel.id == review_id).first()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    return review

@router.put("/{review_id}", response_model=Review)
def update_review(
    review_id: int, 
    user_name: str = Query(..., description="User name for verification"),
    rating: Optional[int] = Query(None, ge=1, le=5),
    comment: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    """Update a review - only the original author can edit"""
    review = db.query(ReviewModel).filter(ReviewModel.id == review_id).first()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    
    # Verify the user is the original author
    if review.user_name != user_name:
        raise HTTPException(
            status_code=403, 
            detail="You can only edit your own reviews"
        )
    
    # Update fields if provided
    if rating is not None:
        review.rating = rating
    if comment is not None:
        review.comment = comment
    
    db.commit()
    db.refresh(review)
    
    return review

@router.put("/{review_id}/helpful", response_model=Review)
def increment_helpful(review_id: int, db: Session = Depends(get_db)):
    """Increment the helpful count for a review"""
    review = db.query(ReviewModel).filter(ReviewModel.id == review_id).first()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    
    review.helpful += 1
    db.commit()
    db.refresh(review)
    
    return review

@router.delete("/{review_id}")
def delete_review(review_id: int, db: Session = Depends(get_db)):
    """Delete a review (admin only - add authentication later)"""
    review = db.query(ReviewModel).filter(ReviewModel.id == review_id).first()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    
    db.delete(review)
    db.commit()
    
    return {"message": "Review deleted successfully"}

@router.get("/stats/summary")
def get_review_stats(db: Session = Depends(get_db)):
    """Get review statistics"""
    from sqlalchemy import func
    
    total_reviews = db.query(func.count(ReviewModel.id)).scalar()
    avg_rating = db.query(func.avg(ReviewModel.rating)).scalar() or 0
    
    # Rating distribution
    rating_dist = db.query(
        ReviewModel.rating,
        func.count(ReviewModel.id).label('count')
    ).group_by(ReviewModel.rating).all()
    
    distribution = {i: 0 for i in range(1, 6)}
    for rating, count in rating_dist:
        distribution[rating] = count
    
    return {
        "total_reviews": total_reviews,
        "average_rating": round(avg_rating, 2),
        "rating_distribution": distribution
    }
