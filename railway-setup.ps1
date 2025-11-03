# Автоматическая настройка Railway через CLI
$ErrorActionPreference = "Continue"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Настройка Railway через CLI" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Проверяем Railway CLI
Write-Host "Проверяю Railway CLI..." -ForegroundColor Yellow
$railwayCheck = railway --version 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Railway CLI установлен" -ForegroundColor Green
} else {
    Write-Host "❌ Railway CLI не найден!" -ForegroundColor Red
    Write-Host "Установите: npm install -g @railway/cli" -ForegroundColor Yellow
    exit
}

Write-Host ""
Write-Host "Шаг 1: Вход в Railway..." -ForegroundColor Yellow
Write-Host "Откроется браузер для авторизации" -ForegroundColor Gray
Write-Host "Нажми Enter для продолжения..." -ForegroundColor Gray
Read-Host

railway login

Write-Host ""
Write-Host "Шаг 2: Привязка проекта..." -ForegroundColor Yellow
Write-Host "Выбери проект 'stunning-manifestation' из списка" -ForegroundColor Gray
Write-Host "Нажми Enter для продолжения..." -ForegroundColor Gray
Read-Host

railway link

Write-Host ""
Write-Host "Шаг 3: Установка команды запуска..." -ForegroundColor Yellow

# Устанавливаем переменную окружения для команды запуска
railway variables set RAILWAY_START_COMMAND="cd server && node index.js"

Write-Host ""
Write-Host "Шаг 4: Проверка переменных..." -ForegroundColor Yellow
railway variables

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "Готово!" -ForegroundColor Green
Write-Host ""
Write-Host "Теперь можно задеплоить:" -ForegroundColor Cyan
Write-Host "  railway up" -ForegroundColor White
Write-Host ""
Write-Host "Или Railway автоматически перезапустит после push" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Green

Read-Host "Press Enter to exit"

