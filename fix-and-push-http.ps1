# Fix and push http import
$OutputEncoding = [System.Text.Encoding]::UTF8

$repoPath = "C:\Users\Ноут\V3LS3N-telegram-bot"

if (-not (Test-Path $repoPath)) {
    Write-Host "ERROR: Repository folder not found!" -ForegroundColor Red
    exit
}

Set-Location $repoPath

Write-Host "Adding fixed file..." -ForegroundColor Yellow
git add index.js

Write-Host "Committing..." -ForegroundColor Yellow
git commit -m "Fix: Add http import for server"

Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
git push

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "Done! Fix pushed to GitHub" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Railway will auto-deploy in 1-2 minutes" -ForegroundColor Cyan
Write-Host "Then check logs again:" -ForegroundColor Yellow
Write-Host "  .\check-railway-status.ps1" -ForegroundColor Cyan
Write-Host ""

Read-Host "Press Enter to exit"

