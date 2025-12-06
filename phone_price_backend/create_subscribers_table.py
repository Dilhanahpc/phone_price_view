"""
Run this script to create the subscribers table in the database.
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database import engine, Base
from app.models import Subscriber

def create_subscribers_table():
    print("Creating subscribers table...")
    Base.metadata.create_all(bind=engine, tables=[Subscriber.__table__])
    print("✅ Subscribers table created successfully!")

if __name__ == "__main__":
    create_subscribers_table()
