from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

load_dotenv()

# Database connection string
# Railway MySQL provides individual variables, construct the URL
def get_database_url():
    # Try Railway-style MySQL variables first
    mysql_host = os.getenv("MYSQLHOST")
    mysql_port = os.getenv("MYSQLPORT", "3306")
    mysql_user = os.getenv("MYSQLUSER", "root")
    mysql_password = os.getenv("MYSQLPASSWORD")
    mysql_database = os.getenv("MYSQLDATABASE", "railway")
    
    if mysql_host and mysql_password:
        return f"mysql+pymysql://{mysql_user}:{mysql_password}@{mysql_host}:{mysql_port}/{mysql_database}"
    
    # Fallback to DATABASE_URL if provided
    database_url = os.getenv("DATABASE_URL")
    if database_url:
        # Convert postgresql:// to mysql+pymysql:// if needed
        if database_url.startswith("postgresql://"):
            database_url = database_url.replace("postgresql://", "mysql+pymysql://", 1)
        elif database_url.startswith("mysql://"):
            database_url = database_url.replace("mysql://", "mysql+pymysql://", 1)
        return database_url
    
    # Default fallback for local development
    return "mysql+pymysql://root:password@localhost:3306/phone_price_db"

DATABASE_URL = get_database_url()

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
