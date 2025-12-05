from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

load_dotenv()

# Database connection string
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "mysql+pymysql://root:password@localhost:3306/phone_price_db"
)

# Create engine with lazy initialization
try:
    engine = create_engine(
        DATABASE_URL,
        echo=os.getenv("DEBUG", "False") == "True",
        pool_pre_ping=True,
        pool_recycle=3600,
        connect_args={"connect_timeout": 10}
    )
except Exception as e:
    print(f"Warning: Database connection failed - {e}")
    engine = None

# Session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for models
Base = declarative_base()

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
