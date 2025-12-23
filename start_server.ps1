# NexusVerse Server Auto-Start Script
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "    NexusVerse Server Starting..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# 프로젝트 디렉토리로 이동
$projectPath = "D:\AntiGravity AI File\AI-Agent-SoftWare"
Set-Location $projectPath
Write-Host "Changed to project directory: $projectPath" -ForegroundColor Green

# 환경변수 설정
Write-Host "Setting environment variables..." -ForegroundColor Yellow
$env:DB_HOST = "localhost"
$env:DB_USER = "root"
$env:DB_PASSWORD = ""
$env:DB_NAME = "virtual_server"

# XAMPP MySQL 확인
Write-Host "Checking MySQL service..." -ForegroundColor Yellow
$mysqlStatus = Get-Service -Name "mysql" -ErrorAction SilentlyContinue
if ($mysqlStatus.Status -eq "Running") {
    Write-Host "✓ MySQL service is running" -ForegroundColor Green
} else {
    Write-Host "⚠ MySQL service is not running. Please start XAMPP MySQL first." -ForegroundColor Red
    Read-Host "Press Enter to continue anyway"
}

# 서버 시작
Write-Host "Starting Node.js server..." -ForegroundColor Yellow
Write-Host "Server will be available at: http://localhost:3000" -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Gray
Write-Host ""

node server.js
