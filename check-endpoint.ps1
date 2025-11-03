# Check send-report endpoint
$OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host "Checking /send-report endpoint..." -ForegroundColor Yellow

$url = "https://telegram-scheduler-production.up.railway.app/send-report"

try {
    $response = Invoke-RestMethod -Uri $url -Method Get -ErrorAction Stop
    Write-Host ""
    Write-Host "SUCCESS! Endpoint works!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Response:" -ForegroundColor Cyan
    $response | ConvertTo-Json -Depth 10
    Write-Host ""
    Write-Host "Report should be sent to Telegram!" -ForegroundColor Green
} catch {
    Write-Host ""
    Write-Host "ERROR:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    Write-Host ""
    Write-Host "Status Code:" -ForegroundColor Yellow
    if ($_.Exception.Response) {
        Write-Host $_.Exception.Response.StatusCode.value__ -ForegroundColor White
    }
    Write-Host ""
    Write-Host "Wait 1-2 minutes for Railway to deploy changes" -ForegroundColor Yellow
}

Read-Host "Press Enter to exit"

