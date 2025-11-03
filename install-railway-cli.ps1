# Установка Railway CLI для управления через PowerShell
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Установка Railway CLI" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Проверяем наличие npm
Write-Host "Проверяю npm..." -ForegroundColor Yellow
try {
    $npmVersion = npm --version
    Write-Host "✓ npm найден: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ npm не найден! Установи Node.js сначала" -ForegroundColor Red
    exit
}

Write-Host ""
Write-Host "Устанавливаю Railway CLI..." -ForegroundColor Yellow
npm install -g @railway/cli

Write-Host ""
Write-Host "Проверяю установку..." -ForegroundColor Yellow
try {
    $railwayVersion = railway --version
    Write-Host "✓ Railway CLI установлен: $railwayVersion" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Railway CLI не найден в PATH" -ForegroundColor Yellow
    Write-Host "Попробуй перезапустить PowerShell" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "Установка завершена!" -ForegroundColor Green
Write-Host ""
Write-Host "Использование:" -ForegroundColor Cyan
Write-Host "  railway login    - войти в Railway" -ForegroundColor White
Write-Host "  railway link     - привязать проект" -ForegroundColor White
Write-Host "  railway up           - задеплоить" -ForegroundColor White
Write-Host "========================================" -ForegroundColor Green

Read-Host "Press Enter to exit"

