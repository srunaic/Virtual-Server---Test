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
if not exist "node_modules\electron" (
    echo [3/3] Electron 엔진 설치 중 (최초 1회)...
    echo 이 과정은 인터넷 속도에 따라 1~2분 정도 소요됩니다.
    call npm install --save-dev electron --no-package-lock
) else (
    echo [3/3] 패키지 확인 완료.
)

echo.
echo [OK] 런처를 실행합니다. 잠시만 기다려 주세요...
echo (창이 뜨지 않으면 이 창의 메시지를 확인해 주세요.)
echo.

call npm run launcher
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] 런처 실행 중 오류가 발생했습니다. (에러 코드: %errorlevel%)
    echo 1. Node.js가 정상적으로 설치되었는지 확인해 주세요.
    echo 2. 인터넷 연결을 확인해 주세요.
    echo 3. 권한 문제일 수 있으니 '관리자 권한'으로 실행해 보세요.
    pause
)

exit /b
