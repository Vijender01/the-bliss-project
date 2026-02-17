# Food Bliss — Auto Start Script
# Run this on boot to start all services
# Save this as: E:\2026\food bliss attempt 2\start-foodbliss.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Starting Food Bliss Production Server" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# 1. Start Backend via PM2 (if not already running)
Write-Host "`n[1/3] Starting Backend (PM2)..." -ForegroundColor Yellow
$pm2Status = pm2 jlist 2>$null
if ($pm2Status -match "foodbliss-api") {
    Write-Host "  PM2 already running — restarting..." -ForegroundColor Green
    pm2 restart foodbliss-api
} else {
    Write-Host "  Starting PM2..." -ForegroundColor Green
    Set-Location "E:\2026\food bliss attempt 2\backend"
    pm2 start ecosystem.config.cjs --env production
}

# 2. Start Nginx (if not already running)
Write-Host "`n[2/3] Starting Nginx..." -ForegroundColor Yellow
$nginxRunning = Get-Process nginx -ErrorAction SilentlyContinue
if ($nginxRunning) {
    Write-Host "  Nginx already running — reloading config..." -ForegroundColor Green
    & "E:\nginx\nginx.exe" -p "E:\nginx" -s reload
} else {
    Write-Host "  Starting Nginx..." -ForegroundColor Green
    Start-Process -FilePath "E:\nginx\nginx.exe" -ArgumentList "-p", "E:\nginx" -WorkingDirectory "E:\nginx"
}

# 3. Start localtunnel
Write-Host "`n[3/3] Starting localtunnel..." -ForegroundColor Yellow
$ltRunning = Get-Process -Name "lt" -ErrorAction SilentlyContinue
if (-not $ltRunning) {
    Start-Process -FilePath "lt" -ArgumentList "--port", "80", "--subdomain", "foodbliss" -NoNewWindow
    Write-Host "  Tunnel starting..." -ForegroundColor Green
    Start-Sleep -Seconds 5
}
Write-Host "  Public URL: https://foodbliss.loca.lt" -ForegroundColor Green

# 4. Wait and verify
Start-Sleep -Seconds 3
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  Verification:" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

try {
    $health = Invoke-RestMethod -Uri 'http://localhost/api/health' -TimeoutSec 5
    Write-Host "  Local API:  OK ($($health.timestamp))" -ForegroundColor Green
} catch {
    Write-Host "  Local API:  FAILED" -ForegroundColor Red
}

Write-Host "`n  Public URL:   https://foodbliss.loca.lt" -ForegroundColor Cyan
Write-Host "  Admin Login:  admin@foodbliss.com / Admin@123" -ForegroundColor White
Write-Host "  Kitchen:      kitchen@foodbliss.com / Kitchen@123" -ForegroundColor White
Write-Host "  Customer:     customer@foodbliss.com / Customer@123" -ForegroundColor White
Write-Host "`n  All services started!" -ForegroundColor Green
