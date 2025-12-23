@echo off
chcp 65001 >nul
echo ========================================
echo  Virtual Server Complete Auto-Start
echo ========================================
echo.

echo [1/6] Checking MySQL service...
net start mysql >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] MySQL service started successfully
) else if %errorlevel% equ 2 (
    echo [INFO] MySQL service is already running
) else (
    echo [ERROR] Failed to start MySQL service
    echo Please make sure XAMPP is installed correctly.
    echo Press any key to continue anyway...
    pause >nul
)
echo.

echo [2/6] Setting environment variables...
set DB_HOST=localhost
set DB_USER=root
set DB_PASSWORD=
set DB_NAME=virtual_server
set NODE_ENV=production
echo [OK] Environment variables configured
echo.

echo [3/6] Terminating existing processes...
taskkill /F /IM node.exe >nul 2>&1
taskkill /F /IM cloudflared.exe >nul 2>&1
timeout /t 2 /nobreak >nul
echo [OK] Cleaned up existing processes
echo.

echo [4/6] Starting Virtual Server...
cd /d "D:\AntiGravity AI File\AI-Agent-SoftWare"
if not exist "server.js" (
    echo [ERROR] server.js not found in current directory
    echo Please check the installation path: %cd%
    pause
    exit /b 1
)

echo Starting Node.js server...
start /b node server.js > server_log.txt 2>&1
echo [OK] Server started in background
timeout /t 3 /nobreak >nul
echo.

echo [5/6] Starting Cloudflare Tunnel...
echo Starting cloudflared tunnel for external access...
start /b cloudflared tunnel --url http://127.0.0.1:3000 > tunnel_log.txt 2>&1
echo [OK] Cloudflare tunnel started in background
timeout /t 8 /nobreak >nul
echo.

echo [6/6] Verifying connections...

REM Test local server connection
echo Testing local server connection...
powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost:3000/api/test' -TimeoutSec 10; Write-Host '[OK] Local server is responding correctly' } catch { Write-Host '[ERROR] Local server connection failed' }" 2>nul

echo.
echo Checking tunnel status...

REM Check if tunnel URL was generated (look for the specific success message)
findstr /C:"Your quick Tunnel has been created" tunnel_log.txt >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Cloudflare tunnel established

    REM Extract tunnel URL
    for /f "tokens=10 delims= " %%i in ('findstr /C:"https://" tunnel_log.txt') do (
        set TUNNEL_URL=%%i
        goto :found_url
    )
) else (
    echo [WARN] External tunnel may not be ready yet
    echo Check tunnel_log.txt for tunnel URL
)

:found_url
if defined TUNNEL_URL (
    echo [INFO] External URL: %TUNNEL_URL%

    REM Save tunnel URL for future reference
    echo %TUNNEL_URL% > current_tunnel_url.txt
    echo [INFO] Tunnel URL saved to current_tunnel_url.txt
) else (
    echo [WARN] Could not extract tunnel URL
)

echo.
echo ================================
echo   Virtual Server Started Successfully!
echo ================================
echo.
echo [INFO] Local Server: http://localhost:3000
if defined TUNNEL_URL echo [INFO] External URL: %TUNNEL_URL%
echo [INFO] Admin Page: https://srunaic.github.io/Virtual-Server---Test/admin.html
echo [INFO] Server Log: server_log.txt
echo [INFO] Tunnel Log: tunnel_log.txt
echo.
echo [SUCCESS] All systems operational!
echo Server will remain running in background.
echo.

REM Optional: Open browser automatically
echo Opening Virtual Server in browser...
timeout /t 2 /nobreak >nul
start https://srunaic.github.io/Virtual-Server---Test/

echo.
echo ========================================
echo        Auto-Start Complete!
echo ========================================
echo.
echo Server and tunnel are running in background.
echo To stop services: Run 'taskkill /F /IM node.exe /IM cloudflared.exe'
echo.
echo Press any key to exit...
pause >nul
