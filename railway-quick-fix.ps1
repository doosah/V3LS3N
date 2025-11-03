# Быстрая настройка Railway
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Быстрая настройка Railway" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Проверяю Railway CLI..." -ForegroundColor Yellow
railway --version
if ($?) {
    Write-Host "✓ Railway CLI найден" -ForegroundColor Green
} else {
    Write-Host "❌ Railway CLI не найден!" -ForegroundColor Red
    Write-Host "Установите: npm install -g @railway/cli" -ForegroundColor Yellow
    exit
}

Write-Host ""
Write-Host "Проверяю авторизацию..." -ForegroundColor Yellow
railway whoami
if (-not $?) {
    Write-Host "⚠️ Не авторизован. Войдите:" -ForegroundColor Yellow
    Write-Host "Нажми Enter для входа..." -ForegroundColor Gray
    Read-Host
    railway login
}

Write-Host ""
Write-Host "Устанавливаю команду запуска..." -ForegroundColor Yellow
railway variables set RAILWAY_START_COMMAND="cd server && node index.js"

Write-Host ""
Write-Host "✅ Команда запуска установлена!" -ForegroundColor Green
Write-Host ""
Write-Host "Railway перезапустит сервис автоматически" -ForegroundColor Cyan
Write-Host "Проверь логи через 2-3 минуты" -ForegroundColor Yellow

Read-Host "Press Enter to exit"
