# Push send-report endpoint
$OutputEncoding = [System.Text.Encoding]::UTF8

$repoPath = "C:\Users\Ноут\V3LS3N-telegram-bot"

if (-not (Test-Path $repoPath)) {
    Write-Host "ERROR: Repository folder not found!" -ForegroundColor Red
    exit
}

Set-Location $repoPath

Write-Host "Adding changes..." -ForegroundColor Yellow
git add index.js

Write-Host "Committing..." -ForegroundColor Yellow
git commit -m "Add /send-report endpoint for manual report sending"

Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
git push

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "Done! Changes pushed" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Wait 1-2 minutes for Railway to deploy" -ForegroundColor Cyan
Write-Host "Then open:" -ForegroundColor Yellow
Write-Host "  https://telegram-scheduler-production.up.railway.app/send-report" -ForegroundColor Cyan
Write-Host ""

Read-Host "Press Enter to exit"

