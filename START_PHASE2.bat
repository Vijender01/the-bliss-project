@echo off
REM Food Bliss - Phase 2 Quick Start
REM This batch file sets up and starts both frontend and backend

echo.
echo ============================================
echo   Food Bliss - Phase 2 Setup
echo ============================================
echo.

REM Check if backend .env exists
if not exist "backend\.env" (
  echo Creating backend\.env...
  copy backend\.env.example backend\.env
  echo ⚠️  Please edit backend\.env with your PostgreSQL connection details
  echo.
  echo Example:
  echo DATABASE_URL="postgresql://postgres:password@localhost:5432/food_bliss"
  echo.
  pause
)

REM Install dependencies if needed
if not exist "backend\node_modules" (
  echo Installing backend dependencies...
  cd backend
  call npm install
  cd ..
)

if not exist "node_modules" (
  echo Installing frontend dependencies...
  call npm install
)

REM Start backend
echo.
echo Starting backend server...
echo Press Ctrl+C to stop
echo.
start "Food Bliss Backend" cmd /k "cd backend && npm run dev"

REM Wait a moment for backend to start
timeout /t 3 /nobreak

REM Start frontend
echo.
echo Starting frontend server...
echo.
start "Food Bliss Frontend" cmd /k "npm run dev"

echo.
echo ============================================
echo   Servers Starting...
echo ============================================
echo.
echo Frontend: http://localhost:5173
echo Backend:  http://localhost:5000
echo.
echo Press any key in either terminal to stop
pause
