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

REM 1. Node.js check
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

REM 2. Download missing files
for %%f in (%FILES%) do (
    if not exist "%%f" (
        echo [INFO] %%f 파일이 없습니다. 다운로드 중...
        curl -s -L -o "%%f" "%REPO_URL%%%f"
        if !errorlevel! neq 0 (
            echo [ERROR] %%f 다운로드 실패! 인터넷 연결을 확인하세요.
            pause
            exit /b
        )
    )
)

REM 3. Install dependencies if node_modules missing
if not exist "node_modules\" (
    echo [INFO] 필요한 패키지를 설치하는 중... (최초 1회)
    echo 이 작업은 몇 분 정도 걸릴 수 있습니다.
    npm install --no-package-lock
)

REM 4. Run Launcher
echo [OK] 런처 준비 완료! 실행합니다...
npm run launcher

if %errorlevel% neq 0 (
    echo [ERROR] 런처 실행 중 오류가 발생했습니다.
    pause
)

exit
