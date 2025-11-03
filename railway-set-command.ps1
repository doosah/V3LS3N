# Установка команды запуска через Railway CLI
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Установка команды запуска Railway" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Пробую разные способы установки..." -ForegroundColor Yellow
Write-Host ""

# Способ 1: Через переменную окружения
Write-Host "Способ 1: Через переменную..." -ForegroundColor Yellow
railway variables --add RAILWAY_START_COMMAND "cd server && node index.js"
if ($?) {
    Write-Host "✅ Успешно установлено!" -ForegroundColor Green
} else {
    Write-Host "❌ Не сработало, пробую другой способ..." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Проверяю переменные..." -ForegroundColor Yellow
railway variables

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "Готово!" -ForegroundColor Green
Write-Host "Проверь логи Railway через 2-3 минуты" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Green

Read-Host "Press Enter to exit"

