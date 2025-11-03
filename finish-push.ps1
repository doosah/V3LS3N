# Finish push to GitHub
$repoPath = Join-Path $env:USERPROFILE "V3LS3N-telegram-bot"

if (-not (Test-Path $repoPath)) {
    Write-Host "ERROR: Folder not found!" -ForegroundColor Red
    Write-Host "Run simple-deploy.ps1 first!" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit
}

Write-Host "Changing to repository folder..." -ForegroundColor Yellow
Set-Location $repoPath

Write-Host "Checking remote..." -ForegroundColor Yellow
git remote -v

Write-Host ""
Write-Host "Setting remote URL..." -ForegroundColor Yellow
git remote set-url origin https://github.com/doosah/V3LS3N-telegram-bot.git

Write-Host ""
Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "SUCCESS! Repository pushed to GitHub!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Now go to Railway and deploy:" -ForegroundColor Yellow
    Write-Host "1. https://railway.app" -ForegroundColor Cyan
    Write-Host "2. New Project -> Deploy from GitHub" -ForegroundColor White
    Write-Host "3. Select V3LS3N-telegram-bot" -ForegroundColor White
} else {
    Write-Host ""
    Write-Host "ERROR: Push failed!" -ForegroundColor Red
    Write-Host "Check the error above." -ForegroundColor Yellow
}

Read-Host "Press Enter to exit"

