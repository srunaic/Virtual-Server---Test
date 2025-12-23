@echo off
echo ========================================
echo     NexusVerse Server Starting...
echo ========================================

cd /d "D:\AntiGravity AI File\AI-Agent-SoftWare"

echo Setting environment variables...
set DB_HOST=localhost
set DB_USER=root
set DB_PASSWORD=
set DB_NAME=virtual_server

echo Starting Node.js server...
node server.js

pause
