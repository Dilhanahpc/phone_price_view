# Phone Price Tracking Backend

A FastAPI-based backend for tracking phone prices across different shops in Sri Lanka.

## ✅ Setup Complete

Your backend is now fully configured and running!

### 🔧 Environment Details
- **Python Version**: 3.13
- **Database**: MySQL (phone_prices)
- **Host**: 127.0.0.1:3306
- **Server**: http://127.0.0.1:8000
- **Auto-reload**: Enabled

## 📊 Database Schema

Your database has **9 tables**:

1. **phones** - Phone information (brand, model, category, etc.)
2. **shops** - Shop information (name, city, contact details, etc.)
3. **shop_prices** - Price listings for phones at different shops
4. **specs** - Phone technical specifications
5. **phone_features** - Phone features with scores
6. **phone_ratings** - User ratings and comments
7. **affiliate_links** - Affiliate links for shops
8. **price_alerts** - Price alerts for users
9. **users** - User accounts

## 🚀 Running the Server

```powershell
cd phone_price_backend
.\venv\Scripts\Activate.ps1
uvicorn app.main:app --reload
```

The server will start at: **http://127.0.0.1:8000**

## 📝 API Documentation

Once the server is running, visit:
- **Swagger UI**: http://127.0.0.1:8000/docs
- **ReDoc**: http://127.0.0.1:8000/redoc

## 🔌 API Endpoints

### Phones
- `GET /api/phones` - Get all phones (with pagination)
- `GET /api/phones/{phone_id}` - Get specific phone
- `POST /api/phones` - Create new phone
- `PUT /api/phones/{phone_id}` - Update phone
- `DELETE /api/phones/{phone_id}` - Delete phone

### Shops
- `GET /api/shops` - Get all shops
- `GET /api/shops/{shop_id}` - Get specific shop
- `POST /api/shops` - Create new shop
- `PUT /api/shops/{shop_id}` - Update shop
- `DELETE /api/shops/{shop_id}` - Delete shop

### Prices
- `GET /api/prices` - Get all prices (filterable by phone_id or shop_id)
- `GET /api/prices/{price_id}` - Get specific price
- `POST /api/prices` - Create new price
- `PUT /api/prices/{price_id}` - Update price
- `DELETE /api/prices/{price_id}` - Delete price
- `GET /api/prices/phone/{phone_id}/compare` - Compare prices for a phone

### Search
- `GET /api/search/phones?q={query}` - Search phones by brand/model
- `GET /api/search/shops?q={query}` - Search shops by name/city
- `GET /api/search/prices/range?min_price={min}&max_price={max}` - Search by price range
- `GET /api/search/by-brand?brand={brand}` - Get phones by brand

### AI Predictions
- `GET /api/ai/predict/{phone_id}` - Get average price prediction
- `GET /api/ai/price-range/{phone_id}` - Get price range statistics
- `GET /api/ai/comparison/{phone_id}` - Get price comparison across shops

## 📦 Installed Packages

- **FastAPI** 0.123.9 - Web framework
- **Uvicorn** 0.38.0 - ASGI server
- **SQLAlchemy** 2.0.44 - ORM
- **MySQL Connector** 9.5.0 - MySQL driver
- **PyMySQL** 1.1.1 - MySQL adapter
- **Cryptography** 44.0.0 - Security library
- **Pydantic** 2.10.5 - Data validation
- **Python-dotenv** 1.0.1 - Environment management

## 🌐 CORS Configuration

CORS is enabled for:
- http://localhost:3000
- http://localhost:5173

You can modify this in `app/main.py` if needed.

## 📂 Project Structure

```
phone_price_backend/
├── app/
│   ├── __init__.py
│   ├── main.py           # FastAPI app entry point
│   ├── database.py       # Database connection
│   ├── models.py         # SQLAlchemy models
│   ├── schemas.py        # Pydantic schemas
│   └── routes/
│       ├── __init__.py
│       ├── phones.py     # Phone endpoints
│       ├── shops.py      # Shop endpoints
│       ├── prices.py     # Price endpoints
│       ├── search.py     # Search endpoints
│       └── ai_predict.py # AI/prediction endpoints
├── venv/                 # Virtual environment
├── .env                  # Environment variables
└── README.md             # This file
```

## 🔐 Environment Variables

Your `.env` file contains:
```
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=phone_prices
DB_USER=root
DB_PASSWORD=20040127Ch@
DATABASE_URL=mysql+mysqlconnector://root:20040127Ch%40@127.0.0.1:3306/phone_prices
```

## ✨ Example API Request

### Get All Phones:
```bash
curl http://127.0.0.1:8000/api/phones
```

### Create a New Phone:
```bash
curl -X POST http://127.0.0.1:8000/api/phones \
  -H "Content-Type: application/json" \
  -d '{
    "brand": "Samsung",
    "model": "Galaxy A54",
    "category": "midrange",
    "image_url": "https://example.com/image.jpg",
    "release_year": 2023
  }'
```

### Search Phones:
```bash
curl "http://127.0.0.1:8000/api/search/phones?q=Samsung"
```

## 🎯 Next Steps

1. ✅ Backend is running
2. 📝 Test API endpoints using Swagger UI (http://127.0.0.1:8000/docs)
3. 🌐 Connect your frontend to the API
4. 📊 Add data to the database through the API

## 🐛 Troubleshooting

### Server won't start?
1. Make sure virtual environment is activated: `.\venv\Scripts\Activate.ps1`
2. Check if MySQL is running
3. Verify database credentials in `.env`

### Database connection error?
1. Confirm MySQL service is running
2. Check database name is `phone_prices`
3. Verify password in `.env` is correct

### Import errors?
1. Make sure all packages are installed: `pip install -r requirements.txt`
2. Check Python version: `python --version` (should be 3.13)

## 📚 Technologies Used

- **FastAPI** - Modern web framework for building APIs
- **SQLAlchemy** - SQL toolkit and ORM
- **MySQL** - Relational database
- **Pydantic** - Data validation
- **Uvicorn** - ASGI server

---

**Status**: ✅ Backend Running Successfully
**Server**: http://127.0.0.1:8000
**Documentation**: http://127.0.0.1:8000/docs
