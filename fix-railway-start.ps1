# Fix Railway start command
$OutputEncoding = [System.Text.Encoding]::UTF8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Fixing Railway Start Command" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check Railway CLI
$railwayCheck = railway --version 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Railway CLI not found!" -ForegroundColor Red
    exit
}

Write-Host "Checking current variables..." -ForegroundColor Yellow
railway variables

Write-Host ""
Write-Host "Setting start command..." -ForegroundColor Yellow

# Try different approaches
Write-Host ""
Write-Host "1. Setting RAILWAY_START_COMMAND..." -ForegroundColor Cyan
railway variables --set "RAILWAY_START_COMMAND=cd server && node index.js"

Write-Host ""
Write-Host "2. Setting NIXPACKS_START_CMD..." -ForegroundColor Cyan
railway variables --set "NIXPACKS_START_CMD=cd server && node index.js"

Write-Host ""
Write-Host "3. Setting START_COMMAND..." -ForegroundColor Cyan
railway variables --set "START_COMMAND=cd server && node index.js"

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "Variables set!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Railway will restart automatically." -ForegroundColor Yellow
Write-Host "Wait 2-3 minutes, then check logs:" -ForegroundColor Yellow
Write-Host "  .\check-railway-logs.ps1" -ForegroundColor Cyan
Write-Host ""

Read-Host "Press Enter to exit"

