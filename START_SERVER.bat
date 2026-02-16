@echo off
REM Food Bliss - Start Server
REM This batch file starts the HTTP server on port 5173

cd /d "e:\2026\food bliss attempt 2\dist"
echo.
echo ============================================
echo   Food Bliss - HTTP Server
echo ============================================
echo.
echo Starting server on port 8000...
echo.
echo Access the app at:
echo   http://192.168.29.136:8000/
echo.
echo On mobile, use:
echo   http://192.168.29.136:8000/
echo.
echo Press Ctrl+C to stop the server
echo.
echo ============================================
echo.

python -m http.server 8000 --bind 0.0.0.0

pause
