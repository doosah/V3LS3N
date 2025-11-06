# Скрипт для автоматического обновления даты в плашке перед деплоем
# Использование: .\update-deploy-date.ps1

$date = Get-Date -Format "dd.MM.yyyy HH:mm:ss"
Write-Host "Обновление даты деплоя: $date" -ForegroundColor Green

# Обновляем в index.html
$indexHtml = Get-Content "index.html" -Raw
$indexHtml = $indexHtml -replace 'Последнее обновление функционала \d{2}\.\d{2}\.\d{4} \d{2}:\d{2}:\d{2}', "Последнее обновление функционала $date"
Set-Content "index.html" -Value $indexHtml -NoNewline

# Обновляем в src/js/app.js
$appJs = Get-Content "src/js/app.js" -Raw -Encoding UTF8
$appJs = $appJs -replace "const lastUpdateDate = '\d{2}\.\d{2}\.\d{4} \d{2}:\d{2}:\d{2}';", "const lastUpdateDate = '$date';"
Set-Content "src/js/app.js" -Value $appJs -NoNewline -Encoding UTF8

Write-Host "✅ Дата обновлена в обоих файлах!" -ForegroundColor Green
Write-Host "Теперь можно делать коммит и пуш:" -ForegroundColor Yellow
Write-Host "  git add index.html src/js/app.js" -ForegroundColor Cyan
Write-Host "  git commit -m 'Обновление даты деплоя'" -ForegroundColor Cyan
Write-Host "  git push origin main" -ForegroundColor Cyan

