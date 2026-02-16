@echo off
REM Run this file as Administrator to fix the firewall issue

echo.
echo ============================================
echo Food Bliss - Firewall Fix
echo ============================================
echo.

REM Check if running as admin
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: This script requires Administrator privileges!
    echo.
    echo Please right-click this file and select "Run as administrator"
    pause
    exit /b 1
)

echo Adding firewall rule for Vite Dev Server (Port 5173)...
echo.

REM Add the firewall rule
netsh advfirewall firewall add rule name="Vite Dev Server (Port 5173)" dir=in action=allow protocol=tcp localport=5173 profile=any

if %errorlevel% equ 0 (
    echo.
    echo ✓ Firewall rule added successfully!
    echo.
    echo You can now access the app on mobile at:
    echo http://192.168.29.136:5173/
    echo.
    echo Please reload the page on your mobile browser.
    echo.
) else (
    echo.
    echo ERROR: Failed to add firewall rule
    echo Please check if you have administrator privileges
    echo.
)

echo Done. You can close this window.
pause
