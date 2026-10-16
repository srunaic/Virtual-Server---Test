@echo off
chcp 65001 >nul
echo ========================================
echo  Angel Kitty Virtual Server Auto-Start
echo  (Template Script for Local Deployment)
echo ========================================
echo.

REM 1. Check & start local database
echo [1/3] Starting database service...
net start mysql >nul 2>&1

REM 2. Set environment parameters
set NODE_ENV=production
set PORT=3000

REM 3. Start server
echo [2/3] Starting server process...
if exist "server.js" (
    node server.js
) else (
    echo [ERROR] server.js not found in current directory.
)

pause
