# Set Railway root directory to server
$OutputEncoding = [System.Text.Encoding]::UTF8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Setting Railway Root Directory" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check Railway CLI
$railwayCheck = railway --version 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Railway CLI not found!" -ForegroundColor Red
    exit
}

Write-Host "Current variables:" -ForegroundColor Yellow
railway variables

Write-Host ""
Write-Host "Setting root directory to 'server'..." -ForegroundColor Yellow
Write-Host "NOTE: Railway CLI may not support root directory setting." -ForegroundColor Gray
Write-Host "You may need to set it manually in Railway web UI:" -ForegroundColor Yellow
Write-Host "  1. Go to Railway dashboard" -ForegroundColor White
Write-Host "  2. Select your service" -ForegroundColor White
Write-Host "  3. Go to Settings" -ForegroundColor White
Write-Host "  4. Set 'Root Directory' to: server" -ForegroundColor White
Write-Host "  5. Set 'Start Command' to: node index.js" -ForegroundColor White
Write-Host ""

Write-Host "Setting start command variables..." -ForegroundColor Cyan
railway variables --set "RAILWAY_START_COMMAND=cd server && node index.js"
railway variables --set "START_COMMAND=cd server && node index.js"

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "Done!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "IMPORTANT: If Railway still runs index.html," -ForegroundColor Yellow
Write-Host "you MUST set 'Root Directory' manually in Railway web UI!" -ForegroundColor Red
Write-Host ""
Write-Host "Steps:" -ForegroundColor Cyan
Write-Host "1. Open: https://railway.app" -ForegroundColor White
Write-Host "2. Select your project" -ForegroundColor White
Write-Host "3. Select your service" -ForegroundColor White
Write-Host "4. Click 'Settings' tab" -ForegroundColor White
Write-Host "5. Scroll to 'Root Directory'" -ForegroundColor White
Write-Host "6. Enter: server" -ForegroundColor Green
Write-Host "7. Scroll to 'Start Command' (if visible)" -ForegroundColor White
Write-Host "8. Enter: node index.js" -ForegroundColor Green
Write-Host "9. Save" -ForegroundColor White
Write-Host ""

Read-Host "Press Enter to exit"

