@echo off
echo ===============================================
echo Rava Kids Center - Server Setup & Start
echo ===============================================
echo.

REM Change to server directory
cd supabase\functions\server

if not exist "node_modules" (
    echo Installing dependencies...
    npm install
    echo.
)

echo.
echo ===============================================
echo Starting server with Nodemon...
echo ===============================================
echo Server will be available at: http://localhost:3000
echo.
echo Press Ctrl+C to stop the server
echo.

npm run dev

pause
