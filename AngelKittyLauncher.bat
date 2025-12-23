@echo off
chcp 65001 >nul
title Angel Kitty Premium Launcher - Bootstrapping...

echo [INFO] 프리미엄 런처 환경을 로드하는 중...
timeout /t 1 /nobreak >nul

if exist "launcher.html" (
    echo [OK] UI 엔진 발견. 런처를 앱으로 실행합니다.
    npm run launcher
) else (
    echo [ERROR] launcher.html 파일을 찾을 수 없습니다.
    echo GitHub에서 파일을 다시 다운로드해 주세요.
    pause
)

exit
