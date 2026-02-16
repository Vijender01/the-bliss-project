@echo off
REM Food Bliss Complete Startup Script
REM Starts both frontend (SPA-aware) and backend servers

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║         🍛 Food Bliss - Starting All Services...              ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

REM Kill any existing node processes
taskkill /F /IM node.exe >nul 2>&1

echo [1/2] Starting Backend (Express + PostgreSQL)...
start "Food Bliss Backend" cmd /k "cd backend && node src/server.js"

timeout /t 2 /nobreak >nul

echo [2/2] Starting Frontend (SPA Server)...
start "Food Bliss Frontend" cmd /k "node serve-spa.js"

timeout /t 2 /nobreak >nul

echo.
echo ✓ Both servers started!
echo.
echo 📱 Access on Phone: http://192.168.29.136:5173
echo 🔌 Backend API: http://192.168.29.136:5000/api
echo.
echo ✨ Features:
echo   - SPA routing works on refresh
echo   - Click Food Bliss logo to go home
echo   - Sign up, login, add to cart, place orders
echo.
echo 📋 Windows will show 2 new command windows above
echo    Keep both running while testing
echo.
pause
