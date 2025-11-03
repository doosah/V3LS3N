# Check Railway status
$OutputEncoding = [System.Text.Encoding]::UTF8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Checking Railway Status" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$url = "https://telegram-scheduler-production.up.railway.app"

Write-Host "1. Checking Health Endpoint..." -ForegroundColor Yellow
Write-Host "   URL: $url/health" -ForegroundColor Cyan
Write-Host ""

try {
    $response = Invoke-RestMethod -Uri "$url/health" -Method Get -ErrorAction Stop
    Write-Host "SUCCESS! Server is running!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Response:" -ForegroundColor Cyan
    $response | ConvertTo-Json -Depth 10
    Write-Host ""
} catch {
    Write-Host "ERROR: Health check failed" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "Server may still be starting. Wait 1-2 minutes and try again." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "2. Checking Railway Logs..." -ForegroundColor Yellow
Write-Host ""
railway logs --tail 20

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "What to look for:" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "SUCCESS if you see:" -ForegroundColor Green
Write-Host "  Telegram Bot Scheduler запущен" -ForegroundColor White
Write-Host "  Сервер запущен на порту 3000" -ForegroundColor White
Write-Host ""
Write-Host "ERROR if you see:" -ForegroundColor Red
Write-Host "  SyntaxError: Unexpected token" -ForegroundColor White
Write-Host "  /app/index.html" -ForegroundColor White
Write-Host ""

Read-Host "Press Enter to exit"
