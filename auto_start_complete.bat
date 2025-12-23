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

echo [4/6] Starting NexusVerse server...
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

echo [5/6] Starting localtunnel for external access...
start /b npx localtunnel --port 3000 > tunnel_log.txt 2>&1
echo ✓ Localtunnel started in background
echo.

echo [6/6] Verifying connections...
timeout /t 8 /nobreak >nul

curl -s http://localhost:3000/api/test >nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ Local server is responding correctly

    REM Check if tunnel URL was generated
    findstr "your url is:" tunnel_log.txt >nul 2>&1
    if %errorlevel% equ 0 (
        echo ✓ External tunnel established
        for /f "tokens=4" %%i in ('findstr "your url is:" tunnel_log.txt') do set TUNNEL_URL=%%i
        echo 🌐 External URL: !TUNNEL_URL!
    ) else (
        echo ⚠ External tunnel may not be ready yet
        echo Check tunnel_log.txt for tunnel URL
    )

    echo.
    echo ================================
    echo     NexusVerse Started Successfully!
    echo ================================
    echo.
    echo 🌐 Local Server: http://localhost:3000
    if defined TUNNEL_URL echo 🌐 External URL: !TUNNEL_URL!
    echo 🔑 Admin Login: Check .env file for credentials
    echo 📝 Server Log: server_log.txt
    echo 📝 Tunnel Log: tunnel_log.txt
    echo.
    echo Opening browser in 3 seconds...
    timeout /t 3 /nobreak >nul
    start http://localhost:3000
) else (
    echo ✗ Server failed to respond
    echo Check server_log.txt for error details
    echo.
    echo Press any key to view log files...
    pause >nul
    notepad server_log.txt
    notepad tunnel_log.txt
)

echo.
echo NexusVerse auto-start complete.
echo Press any key to exit...
pause >nul
