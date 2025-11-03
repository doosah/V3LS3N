# Railway logs viewer
$OutputEncoding = [System.Text.Encoding]::UTF8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Railway Logs Viewer" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check Railway CLI
$railwayCheck = railway --version 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Railway CLI not found!" -ForegroundColor Red
    Write-Host "Install: npm install -g @railway/cli" -ForegroundColor Yellow
    exit
}

Write-Host "Checking authorization..." -ForegroundColor Yellow
railway whoami 2>&1 | Out-Null
if ($LASTEXITCODE -ne 0) {
    Write-Host "WARNING: Not authorized. Login:" -ForegroundColor Yellow
    railway login
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "Latest Railway Logs:" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

# Show latest logs
railway logs --tail 50

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "For real-time logs:" -ForegroundColor Cyan
Write-Host "  railway logs --follow" -ForegroundColor White
Write-Host "========================================" -ForegroundColor Cyan

Read-Host "Press Enter to exit"

