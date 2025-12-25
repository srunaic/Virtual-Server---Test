@echo off
echo ========================================
echo    Virtual Server Auto-Start Setup
echo ========================================
echo.
echo This script will set up automatic startup for Virtual Server.
echo Choose your preferred method:
echo.
echo 1. Task Scheduler (Recommended - More reliable)
echo 2. Startup Folder (Simple - May require admin rights)
echo 3. Test current batch file
echo 4. Exit
echo.
set /p choice="Enter your choice (1-4): "

if "%choice%"=="1" goto :task_scheduler
if "%choice%"=="2" goto :startup_folder
if "%choice%"=="3" goto :test_batch
if "%choice%"=="4" goto :exit

echo Invalid choice. Please run again.
pause
exit /b 1

:task_scheduler
echo.
echo Setting up Task Scheduler...
echo.
echo [Step 1/3] Opening Task Scheduler...
schtasks /create /tn "Virtual Server Auto-Start" /tr "\"D:\AntiGravity AI File\AI-Agent-SoftWare\auto_start_complete.bat\"" /sc onlogon /rl highest /f

if %errorlevel% equ 0 (
    echo [SUCCESS] Task Scheduler setup completed!
    echo The Virtual Server will now start automatically when you log in to Windows.
) else (
    echo [ERROR] Failed to create scheduled task.
    echo You may need to run this as Administrator.
    echo.
    echo Manual setup instructions:
    echo 1. Press Win+R, type 'taskschd.msc', press Enter
    echo 2. Click 'Create Task' in the right panel
    echo 3. Name: Virtual Server Auto-Start
    echo 4. Triggers tab: New -> At log on -> Any user
    echo 5. Actions tab: New -> Start a program
    echo 6. Program: D:\AntiGravity AI File\AI-Agent-SoftWare\auto_start_complete.bat
    echo 7. Click OK
)

goto :end

:startup_folder
echo.
echo Setting up Startup Folder...
echo.

REM Get the current user's startup folder path
for /f "tokens=*" %%i in ('powershell -Command "[Environment]::GetFolderPath('Startup')"') do set STARTUP_FOLDER=%%i

echo Startup folder: %STARTUP_FOLDER%
echo.

REM Create shortcut using PowerShell
powershell -Command "$WshShell = New-Object -comObject WScript.Shell; $Shortcut = $WshShell.CreateShortcut('%STARTUP_FOLDER%\Virtual Server Auto-Start.lnk'); $Shortcut.TargetPath = 'D:\AntiGravity AI File\AI-Agent-SoftWare\auto_start_complete.bat'; $Shortcut.WorkingDirectory = 'D:\AntiGravity AI File\AI-Agent-SoftWare'; $Shortcut.Save()"

if %errorlevel% equ 0 (
    echo [SUCCESS] Startup shortcut created!
    echo The Virtual Server will now start automatically when Windows starts.
) else (
    echo [ERROR] Failed to create startup shortcut.
    echo You may need to create it manually:
    echo 1. Press Win+R, type 'shell:startup', press Enter
    echo 2. Right-click in the folder and select New -> Shortcut
    echo 3. Location: D:\AntiGravity AI File\AI-Agent-SoftWare\auto_start_complete.bat
    echo 4. Name: Virtual Server Auto-Start
    echo 5. Click Finish
)

goto :end

:test_batch
echo.
echo Testing the auto-start batch file...
call "D:\AntiGravity AI File\AI-Agent-SoftWare\auto_start_complete.bat"
goto :end

:exit
echo.
echo Setup cancelled.
goto :end

:end
echo.
echo Setup process completed.
echo Press any key to exit...
pause >nul




