# Phone Price Comparison - Startup Script
# Run this script to start both frontend and backend servers

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  PHONE PRICE COMPARISON - STARTUP" -ForegroundColor Cyan  
Write-Host "========================================`n" -ForegroundColor Cyan

# Stop any existing servers
Write-Host "Stopping existing servers..." -ForegroundColor Yellow
Get-Process python,node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Get-Job | Stop-Job -ErrorAction SilentlyContinue
Get-Job | Remove-Job -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

# Start Backend
Write-Host "`n✅ Starting Backend API..." -ForegroundColor Green
Start-Job -Name "Backend" -ScriptBlock {
    Set-Location "C:\Users\ASUS\OneDrive\Desktop\phone\phone_price_backend"
    python -m uvicorn app.main:app --reload
} | Out-Null

Start-Sleep -Seconds 5

# Start Frontend
Write-Host "✅ Starting Frontend..." -ForegroundColor Green
Start-Job -Name "Frontend" -ScriptBlock {
    Set-Location "C:\Users\ASUS\OneDrive\Desktop\phone\phone_price_frontend"
    npm run dev
} | Out-Null

Start-Sleep -Seconds 3

# Check status
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  SERVER STATUS" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

try {
    $response = Invoke-RestMethod -Uri "http://localhost:8000/api/phones/?skip=0&limit=1" -TimeoutSec 3
    Write-Host "✅ Backend API: " -NoNewline -ForegroundColor Green
    Write-Host "http://localhost:8000" -ForegroundColor White
    Write-Host "   Database: Connected ✓" -ForegroundColor Gray
    Write-Host "   API Status: Working ✓" -ForegroundColor Gray
} catch {
    Write-Host "❌ Backend API: Not responding" -ForegroundColor Red
}

try {
    $response = Invoke-WebRequest -Uri "http://localhost:5173" -UseBasicParsing -TimeoutSec 2 -ErrorAction SilentlyContinue
    Write-Host "`n✅ Frontend: " -NoNewline -ForegroundColor Green
    Write-Host "http://localhost:5173" -ForegroundColor White
} catch {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:5174" -UseBasicParsing -TimeoutSec 2
        Write-Host "`n✅ Frontend: " -NoNewline -ForegroundColor Green
        Write-Host "http://localhost:5174" -ForegroundColor White
    } catch {
        Write-Host "`n❌ Frontend: Not responding" -ForegroundColor Red
    }
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  FEATURES AVAILABLE" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan
Write-Host "📱 Browse phones from multiple brands" -ForegroundColor White
Write-Host "💰 Compare prices across shops" -ForegroundColor White
Write-Host "📧 Subscribe to price drop alerts" -ForegroundColor White
Write-Host "🤖 AI-powered phone recommendations" -ForegroundColor White
Write-Host "🔍 Real-time price tracking`n" -ForegroundColor White

Write-Host "========================================`n" -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop all servers" -ForegroundColor Yellow
Write-Host "`nServers running in background jobs:" -ForegroundColor Gray
Get-Job

# Keep script running
while ($true) {
    Start-Sleep -Seconds 60
    # Check if jobs are still running
    $jobs = Get-Job -State Running
    if ($jobs.Count -eq 0) {
        Write-Host "`n⚠️ All servers stopped!" -ForegroundColor Red
        break
    }
}
