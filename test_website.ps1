# Quick Test Script - Run this after disconnecting VPN

Write-Host "🚀 Opening Pricera Website Test..." -ForegroundColor Green
Write-Host ""
Write-Host "Opening 3 tabs:" -ForegroundColor Yellow
Write-Host "  1. Your website (main)"
Write-Host "  2. Backend API test"
Write-Host "  3. VPN compatibility test"
Write-Host ""

# Open main website
Start-Process msedge -ArgumentList "https://dilhanahpc.github.io/phone_price_view/"
Start-Sleep -Seconds 1

# Open backend API
Start-Process msedge -ArgumentList "https://phonepriceview-production.up.railway.app/api/phones/"
Start-Sleep -Seconds 1

# Open VPN test
Start-Process "c:\Users\ASUS\OneDrive\Desktop\phone\vpn_test.html"

Write-Host ""
Write-Host "✅ All tabs opened!" -ForegroundColor Green
Write-Host ""
Write-Host "If you see errors, make sure VPN is DISCONNECTED!" -ForegroundColor Yellow
