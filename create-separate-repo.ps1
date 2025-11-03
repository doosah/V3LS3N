# Create separate repository for Telegram bot server
$OutputEncoding = [System.Text.Encoding]::UTF8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Create Separate Repository for Server" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "This will:" -ForegroundColor Yellow
Write-Host "1. Create new folder: V3LS3N-telegram-bot" -ForegroundColor White
Write-Host "2. Copy server/ files to new folder" -ForegroundColor White
Write-Host "3. Initialize git repository" -ForegroundColor White
Write-Host "4. Prepare for GitHub push" -ForegroundColor White
Write-Host ""
Write-Host "STEP 1: Create GitHub repository first!" -ForegroundColor Red
Write-Host "  Go to: https://github.com/new" -ForegroundColor Yellow
Write-Host "  Name: V3LS3N-telegram-bot" -ForegroundColor Yellow
Write-Host "  Click Create repository" -ForegroundColor Yellow
Write-Host ""

$githubUrl = Read-Host "Enter GitHub repository URL (e.g., https://github.com/doosah/V3LS3N-telegram-bot.git)"

if ([string]::IsNullOrWhiteSpace($githubUrl)) {
    Write-Host "ERROR: GitHub URL required!" -ForegroundColor Red
    exit
}

Write-Host ""
Write-Host "Creating new folder..." -ForegroundColor Yellow
$newRepoPath = "C:\Users\Ноут\V3LS3N-telegram-bot"

if (Test-Path $newRepoPath) {
    Write-Host "WARNING: Folder already exists!" -ForegroundColor Yellow
    $overwrite = Read-Host "Delete and recreate? (Y/N)"
    if ($overwrite -eq "Y" -or $overwrite -eq "y") {
        Remove-Item -Path $newRepoPath -Recurse -Force
    } else {
        Write-Host "Cancelled." -ForegroundColor Yellow
        exit
    }
}

New-Item -ItemType Directory -Path $newRepoPath -Force | Out-Null

Write-Host "Copying server files..." -ForegroundColor Yellow
Copy-Item -Path "C:\Users\Ноут\V3LS3N\server\*" -Destination $newRepoPath -Recurse -Force

Write-Host "Initializing git..." -ForegroundColor Yellow
Set-Location $newRepoPath
git init
git add .
git commit -m "Initial commit - Telegram bot server"

Write-Host "Adding remote..." -ForegroundColor Yellow
git remote add origin $githubUrl
git branch -M main

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "Repository created!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Push to GitHub:" -ForegroundColor Yellow
Write-Host "  git push -u origin main" -ForegroundColor Cyan
Write-Host ""
Write-Host "Then deploy on Railway:" -ForegroundColor Yellow
Write-Host "  1. Go to: https://railway.app" -ForegroundColor White
Write-Host "  2. New Project → Deploy from GitHub" -ForegroundColor White
Write-Host "  3. Select: V3LS3N-telegram-bot" -ForegroundColor White
Write-Host "  4. Add environment variables" -ForegroundColor White
Write-Host "  5. Deploy!" -ForegroundColor White
Write-Host ""

$push = Read-Host "Push to GitHub now? (Y/N)"
if ($push -eq "Y" -or $push -eq "y") {
    Write-Host ""
    Write-Host "Pushing..." -ForegroundColor Yellow
    git push -u origin main
    Write-Host ""
    Write-Host "✅ Pushed to GitHub!" -ForegroundColor Green
}

Write-Host ""
Read-Host "Press Enter to exit"

