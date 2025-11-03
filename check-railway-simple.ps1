# Простая проверка Railway сервера
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Проверка Railway сервера" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$url = Read-Host "Введите URL вашего Railway сервиса (например: https://your-service.railway.app)"

if ([string]::IsNullOrWhiteSpace($url)) {
    Write-Host "❌ URL не введен!" -ForegroundColor Red
    exit
}

Write-Host ""
Write-Host "1. Проверка Health Check..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$url/health" -Method Get -ErrorAction Stop
    Write-Host "✅ Health Check работает!" -ForegroundColor Green
    Write-Host "Ответ:" -ForegroundColor Cyan
    $response | ConvertTo-Json -Depth 10
} catch {
    Write-Host "❌ Health Check не работает" -ForegroundColor Red
    Write-Host "Ошибка: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "Проверь логи Railway - возможно сервер не запустился" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "2. Тестовая отправка в Telegram..." -ForegroundColor Yellow
Write-Host "Нажми Enter для продолжения..." -ForegroundColor Gray
Read-Host

try {
    $response = Invoke-RestMethod -Uri "$url/test" -Method Get -ErrorAction Stop
    Write-Host "✅ Тестовая отправка:" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 10
    
    if ($response.status -eq 'success') {
        Write-Host ""
        Write-Host "✅ Тестовое сообщение отправлено!" -ForegroundColor Green
        Write-Host "Проверь Telegram чат" -ForegroundColor Cyan
    }
} catch {
    Write-Host "❌ Тестовая отправка не работает" -ForegroundColor Red
    Write-Host "Ошибка: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "Проверка завершена!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green

Read-Host "Press Enter to exit"

