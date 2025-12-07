# Pricera Deployment Guide 🚀

## Overview
This guide will help you deploy your phone price comparison website with:
- **Frontend**: GitHub Pages (Free)
- **Backend + Database**: Railway.app ($5/month)
- **Custom Domain**: Optional (.lk domain ~$10/year)

---

## 📋 Step 1: Deploy Frontend to GitHub Pages

### 1.1 Configure GitHub Repository
1. Go to: https://github.com/Dilhanahpc/phone_price_view/settings/pages
2. Under "Build and deployment":
   - Source: Select **"GitHub Actions"**
3. Click **Save**

### 1.2 Add Environment Secret
1. Go to: https://github.com/Dilhanahpc/phone_price_view/settings/secrets/actions
2. Click **"New repository secret"**
3. Name: `VITE_API_BASE_URL`
4. Value: `https://your-backend-url.railway.app/api` (we'll update this after deploying backend)
5. Click **Add secret**

### 1.3 Push GitHub Actions Workflow
```powershell
cd C:\Users\ASUS\OneDrive\Desktop\phone
git add .
git commit -m "Add GitHub Actions workflow for deployment"
git push origin main
```

### 1.4 Verify Deployment
- Go to: https://github.com/Dilhanahpc/phone_price_view/actions
- Wait for the workflow to complete (green checkmark)
- Your site will be live at: **https://dilhanahpc.github.io/phone_price_view/**

---

## 📋 Step 2: Deploy Backend to Railway

### 2.1 Create Railway Account
1. Go to: https://railway.app/
2. Sign up with GitHub (free $5 credit)
3. Upgrade to Hobby plan ($5/month for MySQL)

### 2.2 Prepare Backend Files

**Create `requirements.txt`:**
```powershell
cd C:\Users\ASUS\OneDrive\Desktop\phone\phone_price_backend
pip freeze > requirements.txt
```

**Create `Procfile`:**
Create a file named `Procfile` (no extension) with:
```
web: uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

**Create `railway.json`:**
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "uvicorn app.main:app --host 0.0.0.0 --port $PORT",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### 2.3 Deploy to Railway

1. **Create New Project**:
   - Go to: https://railway.app/new
   - Click **"Deploy from GitHub repo"**
   - Select your repository: `phone_price_view`
   - Select root path: `/phone_price_backend`

2. **Add MySQL Database**:
   - Click **"+ New"** → **"Database"** → **"Add MySQL"**
   - Railway will create a MySQL instance

3. **Set Environment Variables**:
   Click on your backend service → **Variables** → Add:
   ```
   DATABASE_URL=mysql+pymysql://root:[PASSWORD]@[HOST]:[PORT]/railway
   MYSQL_HOST=[Copy from MySQL service]
   MYSQL_PORT=[Copy from MySQL service]
   MYSQL_USER=root
   MYSQL_PASSWORD=[Copy from MySQL service]
   MYSQL_DATABASE=railway
   SMTP_SERVER=smtp.gmail.com
   SMTP_PORT=465
   SMTP_EMAIL=chandupadilhan04@gmail.com
   SMTP_PASSWORD=qjldhgutcyqxraqq
   FRONTEND_URL=https://dilhanahpc.github.io/phone_price_view
   ```

4. **Get Your Backend URL**:
   - Click **Settings** → **Generate Domain**
   - Copy the URL (e.g., `your-backend-url.railway.app`)

### 2.4 Update Backend CORS

Edit `app/main.py` to allow your frontend:
```python
origins = [
    "http://localhost:5173",
    "https://dilhanahpc.github.io",  # Add this
]
```

Push changes:
```powershell
git add .
git commit -m "Update CORS for production"
git push origin main
```

---

## 📋 Step 3: Connect Frontend to Backend

### 3.1 Update Frontend Environment Variable
1. Go to: https://github.com/Dilhanahpc/phone_price_view/settings/secrets/actions
2. Edit `VITE_API_BASE_URL` secret
3. Update value to: `https://your-backend-url.railway.app/api`
4. Click **Update secret**

### 3.2 Update `.env.production` File
Edit `phone_price_frontend/.env.production`:
```env
VITE_API_BASE_URL=https://your-backend-url.railway.app/api
```

Push changes:
```powershell
git add .
git commit -m "Update production API URL"
git push origin main
```

This will trigger automatic redeployment!

---

## 📋 Step 4: Migrate Database

### 4.1 Export Local Data
```powershell
# Export your local database
mysqldump -u root -p phone_prices > backup.sql
```

### 4.2 Import to Railway
1. In Railway, click on MySQL service → **Data** → **Connect**
2. Copy the connection command
3. Use MySQL Workbench or command line:
```powershell
mysql -h [RAILWAY_HOST] -u root -p -P [PORT] railway < backup.sql
```

### 4.3 Run Creation Scripts
```powershell
# Connect to Railway MySQL
python create_tables.py  # Update connection string first
python create_reviews_table.py  # Update connection string first
```

---

## 📋 Step 5: Custom Domain (Optional)

### 5.1 Buy Domain
- Go to: https://www.domains.lk/
- Search for: `pricera.lk`
- Purchase (~$10/year)

### 5.2 Configure DNS
In your domain provider's DNS settings:
```
Type: CNAME
Name: www
Value: dilhanahpc.github.io
```

```
Type: A
Name: @
Value: 185.199.108.153
```

### 5.3 Add CNAME to Repository
Create `phone_price_frontend/public/CNAME`:
```
pricera.lk
```

Push to GitHub:
```powershell
git add .
git commit -m "Add custom domain"
git push origin main
```

### 5.4 Update GitHub Pages
1. Go to: https://github.com/Dilhanahpc/phone_price_view/settings/pages
2. Custom domain: Enter `pricera.lk`
3. Check **"Enforce HTTPS"**

---

## ✅ Verification Checklist

- [ ] Frontend deploys successfully on GitHub Actions
- [ ] Frontend accessible at: https://dilhanahpc.github.io/phone_price_view/
- [ ] Backend deploys on Railway
- [ ] MySQL database created on Railway
- [ ] Environment variables set correctly
- [ ] Database tables migrated
- [ ] Frontend can communicate with backend
- [ ] Reviews system works end-to-end
- [ ] Email notifications working
- [ ] Social media links functional
- [ ] Custom domain configured (optional)

---

## 🔧 Troubleshooting

### Frontend Not Loading
- Check GitHub Actions logs
- Verify `vite.config.js` has correct `base` path
- Clear browser cache

### Backend API Errors
- Check Railway logs: Click service → **Deployments** → View logs
- Verify DATABASE_URL is correct
- Check CORS settings in `main.py`

### Database Connection Issues
- Verify MySQL service is running on Railway
- Check environment variables match MySQL service
- Ensure firewall allows Railway IPs

### 404 on GitHub Pages
- Verify GitHub Pages is enabled
- Check repository is public
- Wait 2-3 minutes for DNS propagation

---

## 📞 Support

If you encounter issues:
1. Check Railway logs
2. Check GitHub Actions logs
3. Test API endpoints with Postman
4. Verify environment variables

---

## 💰 Cost Summary

| Service | Cost | Purpose |
|---------|------|---------|
| GitHub Pages | Free | Frontend hosting |
| Railway Hobby | $5/month | Backend + MySQL |
| .lk Domain | ~$10/year | Custom domain (optional) |
| **Total** | **$5-6/month** | Complete hosting |

---

**Ready to deploy? Start with Step 1! 🚀**
