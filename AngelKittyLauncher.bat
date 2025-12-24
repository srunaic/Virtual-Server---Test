@echo off
setlocal
chcp 65001 >nul
title Angel Kitty Premium Launcher

echo.
echo ==========================================
echo   Angel Kitty Premium Launcher Setup
echo ==========================================
echo.

REM 1. Check for Node.js
echo [1/3] Node.js 엔진 확인 중...
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js가 필요합니다.
    echo https://nodejs.org/ 에서 LTS 버전을 설치해주세요.
    pause
    exit /b
)

REM 2. Download missing files using PowerShell (One-liner for stability)
echo [2/3] 필수 파일 다운로드/검토 중...
powershell -NoProfile -ExecutionPolicy Bypass -Command "$files = @('package.json', 'main.js', 'launcher.html', 'launcher_bg.jpg'); $repo = 'https://raw.githubusercontent.com/srunaic/Virtual-Server---Test/main/'; foreach ($f in $files) { if (!(Test-Path $f)) { Write-Host \"Downloading $f...\"; [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; Invoke-WebRequest -Uri ($repo + $f) -OutFile $f } }"
if %errorlevel% neq 0 (
    echo [ERROR] 파일 다운로드 중 오류가 발생했습니다.
    pause
    exit /b
)

REM 3. Install & Run
if not exist "node_modules" (
    echo [3/3] 패키지 설치 중 (최초 1회)...
    call npm install --no-package-lock
) else (
    echo [3/3] 패키지 확인 완료.
)

echo.
echo [OK] 실행 중...
call npm run launcher
if %errorlevel% neq 0 (
    echo [ERROR] 앱 실행 실패 (Error Code: %errorlevel%)
    pause
)

exit /b
