# Check Railway after server.js deployment
$OutputEncoding = [System.Text.Encoding]::UTF8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Checking Railway Deployment" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Waiting 10 seconds for Railway to restart..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

Write-Host ""
Write-Host "Checking Railway logs..." -ForegroundColor Yellow
Write-Host ""

railway logs --tail 30

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Look for these messages:" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "✅ SUCCESS if you see:" -ForegroundColor Green
Write-Host "   🚀 Telegram Bot Scheduler запущен" -ForegroundColor White
Write-Host "   ✅ Сервер запущен на порту 3000" -ForegroundColor White
Write-Host ""
Write-Host "❌ FAIL if you still see:" -ForegroundColor Red
Write-Host "   /app/index.html:1" -ForegroundColor White
Write-Host "   SyntaxError: Unexpected token '<'" -ForegroundColor White
Write-Host ""

Read-Host "Press Enter to exit"

