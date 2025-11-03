# Скрипт для обновления Railway конфигурации
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptPath

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Обновление Railway конфигурации" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Добавляю файлы..." -ForegroundColor Yellow
git add railway.json nixpacks.toml package.json

Write-Host ""
Write-Host "Создаю коммит..." -ForegroundColor Yellow
git commit -m "Fix Railway start command - use cd server && node index.js"

Write-Host ""
Write-Host "Отправляю в GitHub..." -ForegroundColor Yellow
git push

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "Готово! Railway перезапустится через 2-3 минуты" -ForegroundColor Green
Write-Host "Проверь логи Railway" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green

Read-Host "Press Enter to exit"

