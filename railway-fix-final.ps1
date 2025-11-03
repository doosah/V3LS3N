# Финальная настройка Railway
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Настройка Railway - Финальный вариант" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Проверяю текущие переменные..." -ForegroundColor Yellow
railway variables

Write-Host ""
Write-Host "Пробую установить команду запуска..." -ForegroundColor Yellow
Write-Host "(Railway может не поддерживать эту переменную)" -ForegroundColor Gray
railway variables --set "RAILWAY_START_COMMAND=cd server && node index.js"

Write-Host ""
Write-Host "Проверяю переменные снова..." -ForegroundColor Yellow
railway variables

Write-Host ""
Write-Host "========================================" -ForegroundColor Yellow
Write-Host "ВАЖНО:" -ForegroundColor Yellow
Write-Host "Railway может не использовать переменную RAILWAY_START_COMMAND" -ForegroundColor Yellow
Write-Host ""
Write-Host "Попробуй:" -ForegroundColor Cyan
Write-Host "1. Проверь файлы конфигурации (railway.json, nixpacks.toml)" -ForegroundColor White
Write-Host "2. Или установи команду вручную в веб-интерфейсе Railway" -ForegroundColor White
Write-Host "========================================" -ForegroundColor Yellow

Read-Host "Press Enter to exit"

