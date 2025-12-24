@echo off
setlocal enabledelayedexpansion
chcp 65001 >nul
title Angel Kitty Premium Launcher - Bootstrapping...

set "REPO_URL=https://raw.githubusercontent.com/srunaic/Virtual-Server---Test/main/"
set "FILES=package.json main.js launcher.html launcher_bg.jpg"

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                                                              ║
echo ║          🐱 Angel Kitty Premium Launcher 🐱                  ║
echo ║              환경 구성 및 부트스트래핑                       ║
echo ║                                                              ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

REM 0. Check for write permissions
echo [INFO] 권한 확인 중...
copy /y nul .test >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] 현재 폴더에 파일을 쓸 권한이 없습니다!
    echo 관리자 권한으로 실행하거나 다른 폴더(예: 바탕 화면)로 옮겨서 실행해 주세요.
    pause
    exit /b
)
del .test

REM 1. Node.js check
echo [INFO] Node.js 엔진 확인 중...
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js가 설치되어 있지 않습니다!
    echo 이 런처를 실행하려면 Node.js 설치가 필요합니다.
    echo 설치 페이지를 여시겠습니까? (Y/N)
    set /p choice=선택: 
    if /i "!choice!"=="Y" start "" "https://nodejs.org/"
    pause
    exit /b
)

REM 2. Download missing files using PowerShell (More robust than curl)
for %%f in (%FILES%) do (
    if not exist "%%f" (
        echo [INFO] %%f 파일이 없습니다. 다운로드 중...
        powershell -Command "[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; (New-Object System.Net.WebClient).DownloadFile('%REPO_URL%%%f', '%%f')"
        if !errorlevel! neq 0 (
            echo [ERROR] %%f 다운로드 실패! (Error Code: !errorlevel!)
            echo 인터넷 연결을 확인하거나 보안 소프트를 잠시 꺼보세요.
            pause
            exit /b
        )
    )
)

REM 3. Install dependencies if node_modules missing
if not exist "node_modules\" (
    echo [INFO] 필요한 패키지를 설치하는 중... (최초 1회)
    echo 이 작업은 1~2분 정도 소용될 수 있습니다. 잠시만 기다려 주세요.
    cmd /c "npm install --no-package-lock"
    if !errorlevel! neq 0 (
        echo [ERROR] 패키지 설치 실패! (Error Code: !errorlevel!)
        pause
        exit /b
    )
)

REM 4. Run Launcher
echo.
echo [OK] 런처 준비 완료! 앱을 실행합니다...
npm run launcher

if %errorlevel% neq 0 (
    echo [ERROR] 런처 실행 중 오류가 발생했습니다. (Error Code: %errorlevel%)
    pause
)

exit
