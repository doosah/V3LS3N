# Railway status checker
$OutputEncoding = [System.Text.Encoding]::UTF8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Railway Status Checker" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$url = Read-Host "Enter your Railway service URL (e.g., https://your-service.railway.app)"

if ([string]::IsNullOrWhiteSpace($url)) {
    Write-Host "ERROR: URL not entered!" -ForegroundColor Red
    exit
}

Write-Host ""
Write-Host "1. Checking Health Check..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$url/health" -Method Get -ErrorAction Stop
    Write-Host "SUCCESS: Health Check works!" -ForegroundColor Green
    Write-Host "Response:" -ForegroundColor Cyan
    $response | ConvertTo-Json -Depth 10
    Write-Host ""
    Write-Host "SUCCESS: Server is running correctly!" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Health Check failed" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "This means the server did not start." -ForegroundColor Yellow
    Write-Host "Check logs with: .\check-railway-logs.ps1" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "2. Checking via Railway CLI..." -ForegroundColor Yellow
Write-Host "Press Enter to view logs..." -ForegroundColor Gray
Read-Host

railway logs --tail 30

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "Check completed!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green

Read-Host "Press Enter to exit"
