@echo off
chcp 65001 >nul
echo ========================================
echo  Angel Kitty Startup Automation Setup
echo ========================================
echo.

set "SCRIPT_PATH=D:\AntiGravity AI File\AI-Agent-SoftWare\startup_headless.vbs"
set "STARTUP_FOLDER=%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup"
set "SHORTCUT_NAME=AngelKittyServer.lnk"

echo [1/2] Creating startup shortcut...
powershell -Command "$WshShell = New-Object -ComObject WScript.Shell; $Shortcut = $WshShell.CreateShortcut('%STARTUP_FOLDER%\%SHORTCUT_NAME%'); $Shortcut.TargetPath = '%SCRIPT_PATH%'; $Shortcut.WorkingDirectory = 'D:\AntiGravity AI File\AI-Agent-SoftWare'; $Shortcut.Save()"

if %errorlevel% equ 0 (
    echo [OK] Shortcut created in Startup folder:
    echo %STARTUP_FOLDER%\%SHORTCUT_NAME%
) else (
    echo [ERROR] Failed to create shortcut.
    pause
    exit /b 1
)

echo.
echo [2/2] Verifying setup...
if exist "%STARTUP_FOLDER%\%SHORTCUT_NAME%" (
    echo [SUCCESS] Automation setup complete!
    echo The server will now start automatically when you log in.
) else (
    echo [ERROR] Shortcut file not found.
)

echo.
echo ========================================
echo Setup finished. Press any key to exit.
echo ========================================
pause >nul
