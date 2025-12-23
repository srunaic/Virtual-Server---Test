@echo off
chcp 65001 >nul
title 우리 집 천사냥이 일상물 - Game Launcher

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                                                              ║
echo ║          🐱 우리 집 천사냥이 일상물 🐱                       ║
echo ║              Game Launcher v1.0                              ║
echo ║                                                              ║
echo ║          작가: 나노도로시                                    ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.
echo [INFO] 천사냥이 런처를 시작합니다...
echo.

REM Check for game executable
if exist "AngelKitty.exe" (
    echo [OK] 게임 파일 발견!
    echo [INFO] 게임을 실행합니다...
    start "" "AngelKitty.exe"
    exit /b
)

if exist "Game\AngelKitty.exe" (
    echo [OK] 게임 파일 발견!
    echo [INFO] 게임을 실행합니다...
    start "" "Game\AngelKitty.exe"
    exit /b
)

echo ╔══════════════════════════════════════════════════════════════╗
echo ║                                                              ║
echo ║   ⚠️  게임 파일을 찾을 수 없습니다!                          ║
echo ║                                                              ║
echo ║   게임이 아직 개발 중입니다.                                 ║
echo ║   완성되면 이 런처를 통해 바로 실행할 수 있습니다.           ║
echo ║                                                              ║
echo ║   📢 개발 진행 상황은 공식 사이트에서 확인하세요:            ║
echo ║   https://srunaic.github.io/Virtual-Server---Test/           ║
echo ║                                                              ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.
echo [TIP] 게임 출시 소식을 기다려주세요!
echo.

REM Open the official website
echo 공식 사이트를 여시겠습니까? (Y/N)
set /p choice=선택: 
if /i "%choice%"=="Y" (
    start "" "https://srunaic.github.io/Virtual-Server---Test/"
)

echo.
echo 런처를 종료합니다. 아무 키나 누르세요...
pause >nul
