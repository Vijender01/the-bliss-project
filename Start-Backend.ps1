# Food Bliss Backend Startup Script
Write-Host "`n🍛 Starting Food Bliss Backend..." -ForegroundColor Green
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "`nDatabase: PostgreSQL at localhost:5432/foodbliss" -ForegroundColor Gray
Write-Host "Backend:  http://localhost:5000`n" -ForegroundColor Gray

# Kill existing processes
Get-Process node -ErrorAction SilentlyContinue | ForEach-Object { 
  Write-Host "⚠️  Stopping existing node process (PID $($_.Id))..." -ForegroundColor Yellow
  Stop-Process -Id $_.Id -Force -ErrorAction SilentlyContinue
}

Start-Sleep -Seconds 1

# Start server
Set-Location -Path "e:\2026\food bliss attempt 2\backend"
& node src/server.js
