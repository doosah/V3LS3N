# Create repo now - simple version
$OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host "Creating repository..." -ForegroundColor Yellow

# Use full path
$sourcePath = "C:\Users\Ноут\V3LS3N\server"
$destPath = "C:\Users\Ноут\V3LS3N-telegram-bot"

# Check if source exists
if (-not (Test-Path $sourcePath)) {
    Write-Host "ERROR: Source folder not found: $sourcePath" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit
}

# Remove old folder if exists
if (Test-Path $destPath) {
    Write-Host "Removing old folder..." -ForegroundColor Yellow
    Remove-Item -Path $destPath -Recurse -Force
}

# Create new folder
Write-Host "Creating folder: $destPath" -ForegroundColor Yellow
New-Item -ItemType Directory -Path $destPath -Force | Out-Null

# Copy files
Write-Host "Copying files..." -ForegroundColor Yellow
Copy-Item -Path "$sourcePath\*" -Destination $destPath -Recurse -Force

# Go to folder
Set-Location $destPath

# Init git
Write-Host "Initializing git..." -ForegroundColor Yellow
git init
git add .
git commit -m "Initial commit - Telegram bot server"

# Set remote
Write-Host "Setting remote..." -ForegroundColor Yellow
git remote add origin https://github.com/doosah/V3LS3N-telegram-bot.git
git branch -M main

# Push
Write-Host ""
Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "SUCCESS! Repository created and pushed!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Now deploy on Railway:" -ForegroundColor Yellow
    Write-Host "1. Go to: https://railway.app" -ForegroundColor White
    Write-Host "2. New Project -> Deploy from GitHub" -ForegroundColor White
    Write-Host "3. Select: V3LS3N-telegram-bot" -ForegroundColor White
    Write-Host "4. Railway will auto-deploy" -ForegroundColor White
} else {
    Write-Host ""
    Write-Host "ERROR: Push failed!" -ForegroundColor Red
    Write-Host "Folder created at: $destPath" -ForegroundColor Yellow
    Write-Host "You can push manually later" -ForegroundColor Yellow
}

Read-Host "Press Enter to exit"

