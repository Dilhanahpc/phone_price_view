# PRICERA - Quick Start Guide

## 🚀 Start Both Servers

### Terminal 1: Backend
```powershell
cd C:\Users\ASUS\OneDrive\Desktop\phone\phone_price_backend
.\venv\Scripts\Activate.ps1
uvicorn app.main:app --reload
```
✅ Backend: http://localhost:8000
📚 API Docs: http://localhost:8000/docs

### Terminal 2: Frontend
```powershell
cd C:\Users\ASUS\OneDrive\Desktop\phone\phone_price_frontend
npm run dev
```
✅ Frontend: http://localhost:5174

---

## 📱 Features You Can Test

### 1. Homepage (http://localhost:5174/)
- View trending phones with prices
- See latest 6 phones from database
- Professional dark theme with phone image blending
- Click "Compare" or "Ask AI" buttons

### 2. Compare Page (http://localhost:5174/compare)
- Search phones by name
- Filter by category (budget, midrange, flagship, gaming, foldable)
- Select up to 3 phones
- Compare prices across shops
- See best deals highlighted

### 3. AI Picks Page (http://localhost:5174/ai-picks)
- View AI-powered recommendations
- Filter by category
- Adjust price range slider
- Sort by: AI recommended, price, newest
- See recommendation scores

### 4. API Testing (http://localhost:8000/docs)
- Try all endpoints interactively
- View request/response schemas
- Test with different parameters

---

## 🎯 Sample Searches to Try

### By Brand
- Search: "Samsung" → See Galaxy phones
- Search: "Apple" → See iPhone
- Search: "Google" → See Pixel phones

### By Category
- Budget → Phones under 90,000 LKR
- Midrange → Phones 120,000-180,000 LKR
- Flagship → Premium phones 300,000+ LKR
- Gaming → ROG Phone, RedMagic
- Foldable → Z Fold 5, Z Flip 5

### Price Ranges to Test
- 50,000 - 100,000 → Budget phones
- 100,000 - 200,000 → Midrange phones
- 300,000 - 600,000 → Flagship phones

---

## 📊 Sample Data Available

### Phones (15 total)
- **Apple**: iPhone 15 Pro Max (575,000-590,000 LKR)
- **Samsung**: Galaxy S24 Ultra (475,000-485,000 LKR)
- **Google**: Pixel 8 Pro (375,000-385,000 LKR)
- **OnePlus**: 12 Pro (315,000-320,000 LKR)
- **Samsung**: Galaxy A54 5G (140,000-148,000 LKR)
- **Xiaomi**: 13T Pro (172,000-175,000 LKR)
- **ASUS**: ROG Phone 7 (345,000-350,000 LKR)
- And 8 more...

### Shops (5 total)
- Singer Mega Electronics (Colombo)
- Abans Electronics (Kandy)
- Softlogic Holdings (Colombo)
- Dialog Store (Galle)
- Hutchison Store (Colombo)

---

## 🔗 Quick API Calls

### Get All Phones
```
GET http://localhost:8000/api/phones
```

### Search by Brand
```
GET http://localhost:8000/api/search/phones?q=samsung
```

### Price Range
```
GET http://localhost:8000/api/prices/range?min_price=100000&max_price=200000
```

### Compare Phone Prices
```
GET http://localhost:8000/api/prices/phone/25/compare
```

---

## 🎨 Design Highlights

- **Dark Navy Background**: #0a0a1f
- **Accent Colors**: Indigo 600, Purple 600
- **Phone Image Blending**: Radial mask + mix-blend-screen
- **Cards**: Glassmorphism with backdrop blur
- **Buttons**: Pill-style with gradient shadows
- **Animations**: Smooth hover and scale effects

---

## 🐛 Quick Fixes

### Backend not connecting?
1. Check MySQL is running
2. Verify database exists: `phone_price_db`
3. Check `.env` file has correct credentials

### Frontend showing errors?
1. Refresh the page
2. Check backend is running (http://localhost:8000)
3. Open browser console (F12) to see errors

### No images showing?
- Images use Unsplash URLs (requires internet)
- Fallback images are configured
- Check browser console for image load errors

---

## 📝 Common Tasks

### Add New Phone (via API Docs)
1. Go to http://localhost:8000/docs
2. Find POST /api/phones
3. Click "Try it out"
4. Enter phone data (brand, model, category, etc.)
5. Click "Execute"

### Add Price Entry
1. Go to http://localhost:8000/docs
2. Find POST /api/prices
3. Enter phone_id, shop_id, price
4. Click "Execute"

### Refresh Sample Data
```powershell
cd phone_price_backend
python seed_data.py
```
(This will clear and re-seed the database)

---

## ✅ Health Check

### Is Everything Working?
- [ ] Backend responds at http://localhost:8000/health
- [ ] Frontend shows at http://localhost:5174
- [ ] Homepage displays phones from database
- [ ] Compare page allows selecting phones
- [ ] AI Picks shows filtered phones
- [ ] Images load and blend smoothly

If all checked ✅, you're good to go! 🎉

---

**Last Updated**: December 6, 2025
**Status**: ✅ Running & Fully Operational
