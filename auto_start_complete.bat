@echo off
echo ========================================
echo    NexusVerse Complete Auto-Start
echo ========================================
echo.

echo [1/5] Checking MySQL service...
net start mysql >nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ MySQL service started successfully
) else if %errorlevel% equ 2 (
    echo ⚠ MySQL service is already running
) else (
    echo ✗ Failed to start MySQL service
    echo Please make sure XAMPP is installed correctly.
    pause
    exit /b 1
)
echo.

echo [2/5] Waiting for MySQL to initialize...
timeout /t 5 /nobreak >nul
echo ✓ MySQL initialization complete
echo.

echo [3/5] Setting environment variables...
set DB_HOST=localhost
set DB_USER=root
set DB_PASSWORD=
set DB_NAME=virtual_server
echo ✓ Environment variables configured
echo.

echo [4/5] Starting NexusVerse server...
cd /d "D:\AntiGravity AI File\AI-Agent-SoftWare"
if not exist "server.js" (
    echo ✗ server.js not found in current directory
    echo Please check the installation path
    pause
    exit /b 1
)

start /b node server.js > server_log.txt 2>&1
echo ✓ Server started in background
echo.

echo [5/5] Verifying server startup...
timeout /t 3 /nobreak >nul

curl -s http://localhost:3000/api/test >nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ Server is responding correctly
    echo.
    echo ================================
    echo     NexusVerse Started Successfully!
    echo ================================
    echo.
    echo 🌐 Server URL: http://localhost:3000
    echo 🔑 Admin Login: victoryka123 / Tpdlflszkdltm1@
    echo 📝 Log file: server_log.txt
    echo.
    echo Opening browser in 3 seconds...
    timeout /t 3 /nobreak >nul
    start http://localhost:3000
) else (
    echo ✗ Server failed to respond
    echo Check server_log.txt for error details
    echo.
    echo Press any key to view log file...
    pause >nul
    notepad server_log.txt
)

echo.
echo NexusVerse auto-start complete.
echo Press any key to exit...
pause >nul
