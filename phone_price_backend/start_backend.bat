@echo off
cd /d C:\Users\ASUS\OneDrive\Desktop\phone\phone_price_backend
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
