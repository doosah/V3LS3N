# Fix and push
$repoPath = "$env:USERPROFILE\V3LS3N-telegram-bot"

Write-Host "Looking for repository..." -ForegroundColor Yellow

if (-not (Test-Path $repoPath)) {
    Write-Host "ERROR: Repository folder not found!" -ForegroundColor Red
    Write-Host "Expected: $repoPath" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Run simple-deploy.ps1 first!" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit
}

Write-Host "Found repository: $repoPath" -ForegroundColor Green
Set-Location $repoPath

Write-Host ""
Write-Host "Checking git status..." -ForegroundColor Yellow
git status

Write-Host ""
Write-Host "Fixing remote URL..." -ForegroundColor Yellow
git remote remove origin 2>$null
git remote add origin https://github.com/doosah/V3LS3N-telegram-bot.git

Write-Host ""
Write-Host "Checking branch..." -ForegroundColor Yellow
$currentBranch = git branch --show-current
Write-Host "Current branch: $currentBranch" -ForegroundColor Cyan

if ($currentBranch -ne "main") {
    Write-Host "Renaming branch to main..." -ForegroundColor Yellow
    git branch -M main
}

Write-Host ""
Write-Host "Checking if there are commits..." -ForegroundColor Yellow
$commitCount = (git rev-list --count HEAD 2>$null)
if ($commitCount -eq 0) {
    Write-Host "No commits found! Adding files..." -ForegroundColor Yellow
    git add .
    git commit -m "Initial commit - Telegram bot server"
}

Write-Host ""
Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "SUCCESS! Pushed to GitHub!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "ERROR: Push failed!" -ForegroundColor Red
    Write-Host "Check the error above." -ForegroundColor Yellow
}

Read-Host "Press Enter to exit"

