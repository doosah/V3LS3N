# Test Telegram message
$OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Testing Telegram Message" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$url = "https://telegram-scheduler-production.up.railway.app/test"

Write-Host "Sending test message to Telegram..." -ForegroundColor Yellow
Write-Host "URL: $url" -ForegroundColor Cyan
Write-Host ""

try {
    $response = Invoke-RestMethod -Uri $url -Method Get -ErrorAction Stop
    Write-Host "SUCCESS!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Response:" -ForegroundColor Cyan
    $response | ConvertTo-Json -Depth 10
    Write-Host ""
    Write-Host "Check your Telegram chat for test message!" -ForegroundColor Green
} catch {
    Write-Host "ERROR:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
}

Write-Host ""
Read-Host "Press Enter to exit"

