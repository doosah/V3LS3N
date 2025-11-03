# Отправка всех конфигурационных файлов в GitHub
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Отправка конфигурации Railway" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Добавляю файлы конфигурации..." -ForegroundColor Yellow
git add railway.json railway.toml nixpacks.toml Procfile package.json .railwayignore

Write-Host ""
Write-Host "Создаю коммит..." -ForegroundColor Yellow
git commit -m "Add all Railway configuration files"

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
Write-Host "Подожди 2-3 минуты и проверь логи Railway" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Green

Read-Host "Press Enter to exit"

