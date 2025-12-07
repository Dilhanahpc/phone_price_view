# Phone Price Comparison Platform - PRICERA

A full-stack web application for comparing smartphone prices across different shops in Sri Lanka with AI-powered recommendations.

## 🚀 Features

- **Real-time Price Comparison**: Compare prices from multiple shops instantly
- **AI-Powered Recommendations**: Get personalized phone suggestions based on your preferences
- **Advanced Search & Filters**: Search by brand, model, category, and price range
- **Side-by-Side Comparison**: Compare up to 3 phones simultaneously
- **Professional UI**: Dark theme with smooth animations and responsive design
- **Live Price Tracking**: Monitor price changes across different retailers

## 🛠️ Technology Stack

### Backend
- **FastAPI**: Modern Python web framework
- **SQLAlchemy**: ORM for database operations
- **MySQL**: Relational database
- **Pydantic**: Data validation
- **Uvicorn**: ASGI server

### Frontend
- **React 18**: UI library
- **Vite**: Build tool and dev server
- **Tailwind CSS v3**: Utility-first CSS framework
- **React Router**: Client-side routing
- **Axios**: HTTP client
- **Lucide React**: Icon library

## 📦 Project Structure

```
phone/
├── phone_price_backend/      # FastAPI backend
│   ├── app/
│   │   ├── main.py          # Application entry point
│   │   ├── models.py        # SQLAlchemy models
│   │   ├── schemas.py       # Pydantic schemas
│   │   ├── database.py      # Database connection
│   │   └── routes/          # API endpoints
│   │       ├── phones.py    # Phone CRUD operations
│   │       ├── shops.py     # Shop management
│   │       ├── prices.py    # Price operations
│   │       ├── search.py    # Search functionality
│   │       └── ai_predict.py # AI predictions
│   └── venv/                # Python virtual environment
│
└── phone_price_frontend/     # React frontend
    ├── src/
    │   ├── App.jsx          # Main app component
    │   ├── main.jsx         # Entry point
    │   ├── index.css        # Global styles
    │   ├── components/      # Reusable components
    │   │   ├── Navbar.jsx
    │   │   └── PhoneCard.jsx
    │   ├── pages/           # Page components
    │   │   ├── HomePage.jsx
    │   │   ├── ComparePage.jsx
    │   │   ├── AIPicksPage.jsx
    │   │   └── PriceSearchPage.jsx
    │   ├── services/        # API services
    │   │   └── api.js
    │   └── assets/          # Images and static files
    └── node_modules/        # NPM dependencies
```

## 🚦 Getting Started

### Prerequisites

- Python 3.8 or higher
- Node.js 16 or higher
- MySQL 8.0 or higher
- npm or yarn

### Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd phone_price_backend
   ```

2. **Create and activate virtual environment**:
   ```bash
   python -m venv venv
   # On Windows PowerShell:
   .\venv\Scripts\Activate.ps1
   # On Unix/MacOS:
   source venv/bin/activate
   ```

3. **Install dependencies**:
   ```bash
   pip install fastapi uvicorn sqlalchemy pymysql python-dotenv pydantic
   ```

4. **Configure database**:
   - Create a MySQL database named `phone_price_db`
   - Update connection string in `app/database.py` if needed:
     ```python
     DATABASE_URL = "mysql+pymysql://root:your_password@localhost/phone_price_db"
     ```

5. **Create database tables**:
   ```bash
   python create_tables.py
   ```

6. **Start the backend server**:
   ```bash
   uvicorn app.main:app --reload
   ```

   Backend will be available at: `http://localhost:8000`
   API documentation: `http://localhost:8000/docs`

### Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd phone_price_frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment**:
   - The `.env` file is already created with:
     ```env
     VITE_API_BASE_URL=http://localhost:8000/api
     ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```

   Frontend will be available at: `http://localhost:5173` (or `http://localhost:5174` if 5173 is busy)

## 📊 API Endpoints

### Phones
- `GET /api/phones` - Get all phones (with pagination)
- `GET /api/phones/{id}` - Get phone by ID
- `POST /api/phones` - Create new phone
- `PUT /api/phones/{id}` - Update phone
- `DELETE /api/phones/{id}` - Delete phone

### Search
- `GET /api/search/phones?q={query}` - Search phones by brand/model
- `GET /api/search/by-brand?brand={brand}` - Search by brand
- `GET /api/search/shops?q={query}` - Search shops

### Prices
- `GET /api/prices` - Get all prices
- `GET /api/prices/range?min_price={min}&max_price={max}` - Get phones by price range
- `GET /api/prices/phone/{phone_id}/compare` - Compare prices for a phone
- `POST /api/prices` - Create price entry

### Shops
- `GET /api/shops` - Get all shops
- `GET /api/shops/{id}` - Get shop by ID

## 🎨 Design Reference

The frontend design is based on the professional Pricera concept with:
- Dark navy background (`#0a0a1f`)
- Indigo/purple gradient accents
- Premium glassmorphism effects
- Smooth animations and transitions
- Responsive grid layouts
- Professional phone image blending

## 🔧 Configuration

### Backend Configuration
- Database: Update `app/database.py`
- CORS: Configured in `app/main.py` (currently allows all origins)
- Port: Default 8000, change in uvicorn command

### Frontend Configuration
- API URL: Set in `.env` file (`VITE_API_BASE_URL`)
- Theme: Customize in `tailwind.config.js`
- Routes: Configure in `src/App.jsx`

## 📝 Sample Data

To populate the database with sample data, you can use the following SQL or create a Python script:

```sql
-- Sample phone data
INSERT INTO phones (brand, model, category, image_url, release_year)
VALUES 
  ('Apple', 'iPhone 15 Pro Max', 'flagship', 'https://example.com/iphone.jpg', 2023),
  ('Samsung', 'Galaxy S24 Ultra', 'flagship', 'https://example.com/samsung.jpg', 2024),
  ('Google', 'Pixel 8 Pro', 'flagship', 'https://example.com/pixel.jpg', 2023);

-- Sample shop data
INSERT INTO shops (name, city, verified, featured)
VALUES 
  ('Mobile Hub', 'Colombo', 1, 1),
  ('Tech Plaza', 'Kandy', 1, 0),
  ('Phone Store', 'Galle', 1, 0);

-- Sample price data
INSERT INTO shop_prices (phone_id, shop_id, price, currency, is_active)
VALUES 
  (1, 1, 450000, 'LKR', 1),
  (1, 2, 445000, 'LKR', 1),
  (2, 1, 380000, 'LKR', 1);
```

## 🚀 Deployment

### Backend Deployment
- Use Gunicorn with Uvicorn workers for production
- Set up environment variables for database connection
- Configure CORS for production domain
- Use a process manager like systemd or supervisor

### Frontend Deployment
- Build for production: `npm run build`
- Deploy `dist` folder to static hosting (Vercel, Netlify, etc.)
- Update API URL in environment variables

## 🐛 Troubleshooting

### Backend Issues
- **Database connection error**: Check MySQL is running and credentials are correct
- **Module not found**: Ensure virtual environment is activated and dependencies installed
- **Port already in use**: Change port in uvicorn command

### Frontend Issues
- **API connection failed**: Verify backend is running on http://localhost:8000
- **Port 5173 in use**: Vite will automatically try port 5174
- **Tailwind not working**: Clear cache and restart dev server

## 📄 License

This project is for educational purposes.

## 👥 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📞 Support

For issues and questions:
- Backend API docs: http://localhost:8000/docs
- Frontend: Check browser console for errors
- Database: Verify with MySQL Workbench or similar tool

---

Built with ❤️ using FastAPI and React

