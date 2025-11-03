# Автоматическая настройка Railway через файлы конфигурации
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptPath

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Настройка Railway через конфигурацию" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Создаю файлы конфигурации..." -ForegroundColor Yellow

# Проверяем наличие файлов
$files = @("railway.json", "railway.toml", "nixpacks.toml", "Procfile", "package.json")
foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "✓ $file существует" -ForegroundColor Green
    } else {
        Write-Host "✗ $file не найден" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Добавляю файлы в git..." -ForegroundColor Yellow
git add railway.json railway.toml nixpacks.toml Procfile package.json .railwayignore

Write-Host ""
Write-Host "Создаю коммит..." -ForegroundColor Yellow
git commit -m "Add Railway configuration files for automatic deployment"

Write-Host ""
Write-Host "Отправляю в GitHub..." -ForegroundColor Yellow
git push

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "Готово!" -ForegroundColor Green
Write-Host ""
Write-Host "Railway автоматически использует:" -ForegroundColor Cyan
Write-Host "  • railway.json" -ForegroundColor White
Write-Host "  • railway.toml" -ForegroundColor White
Write-Host "  • nixpacks.toml" -ForegroundColor White
Write-Host "  • Procfile" -ForegroundColor White
Write-Host ""
Write-Host "Подожди 2-3 минуты и проверь:" -ForegroundColor Yellow
Write-Host "  • Логи Railway" -ForegroundColor White
Write-Host "  • https://your-service.railway.app/health" -ForegroundColor White
Write-Host "========================================" -ForegroundColor Green

Read-Host "Press Enter to exit"

