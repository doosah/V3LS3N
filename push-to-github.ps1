# Simple push script
$OutputEncoding = [System.Text.Encoding]::UTF8

$repoPath = "C:\Users\Ноут\V3LS3N-telegram-bot"

if (-not (Test-Path $repoPath)) {
    Write-Host "ERROR: Folder not found: $repoPath" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit
}

Set-Location $repoPath

Write-Host "Checking git status..." -ForegroundColor Yellow
git status

Write-Host ""
Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
git push -u origin main

Write-Host ""
Write-Host "Done!" -ForegroundColor Green
Read-Host "Press Enter to exit"

