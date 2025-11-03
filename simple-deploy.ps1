# Simple deploy script - creates separate repo for server
$OutputEncoding = [System.Text.Encoding]::UTF8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Creating Separate Repository" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Create folder
$newRepoPath = "C:\Users\Ноут\V3LS3N-telegram-bot"
Write-Host "Creating folder..." -ForegroundColor Yellow

if (Test-Path $newRepoPath) {
    Remove-Item -Path $newRepoPath -Recurse -Force
}

New-Item -ItemType Directory -Path $newRepoPath -Force | Out-Null

# Copy files from server/
Write-Host "Copying files from server/..." -ForegroundColor Yellow
Copy-Item -Path "C:\Users\Ноут\V3LS3N\server\*" -Destination $newRepoPath -Recurse -Force

# Change to folder
Set-Location $newRepoPath

# Initialize git
Write-Host "Setting up git..." -ForegroundColor Yellow
git init
git add .
git commit -m "Initial commit - Telegram bot server"

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "Done!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Folder created: C:\Users\Ноут\V3LS3N-telegram-bot" -ForegroundColor Cyan
Write-Host ""
Write-Host "NOW DO THIS:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Create repository on GitHub:" -ForegroundColor White
Write-Host "   https://github.com/new" -ForegroundColor Cyan
Write-Host "   Name: V3LS3N-telegram-bot" -ForegroundColor White
Write-Host "   DO NOT add README, .gitignore, license" -ForegroundColor White
Write-Host "   Click Create repository" -ForegroundColor White
Write-Host ""
Write-Host "2. Copy repository URL (for example):" -ForegroundColor White
Write-Host "   https://github.com/doosah/V3LS3N-telegram-bot.git" -ForegroundColor Cyan
Write-Host ""
Write-Host "3. Press Enter and paste URL..." -ForegroundColor Yellow
Write-Host ""

Read-Host "Press Enter when you created repository on GitHub"

$githubUrl = Read-Host "Paste repository URL (e.g., https://github.com/doosah/V3LS3N-telegram-bot.git)"

if ([string]::IsNullOrWhiteSpace($githubUrl)) {
    Write-Host "Error: URL not entered!" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit
}

Write-Host ""
Write-Host "Adding remote..." -ForegroundColor Yellow
git remote add origin $githubUrl
git branch -M main

Write-Host ""
Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
git push -u origin main

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "DONE! Repository created!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Now deploy on Railway:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Open: https://railway.app" -ForegroundColor White
Write-Host "2. Click: New Project" -ForegroundColor White
Write-Host "3. Select: Deploy from GitHub repo" -ForegroundColor White
Write-Host "4. Select: V3LS3N-telegram-bot" -ForegroundColor White
Write-Host "5. Railway will auto-start server" -ForegroundColor White
Write-Host ""
Write-Host "6. Add environment variables in Railway:" -ForegroundColor Yellow
Write-Host "   Go to: Settings - Variables - Add Variable" -ForegroundColor White
Write-Host ""
Write-Host "   Add these 4 variables:" -ForegroundColor Cyan
Write-Host "   TELEGRAM_BOT_TOKEN = 8241855422:AAG7yW4NT5yoOagAo7My6bXDCdOo-pAhUa8" -ForegroundColor White
Write-Host "   TELEGRAM_CHAT_ID = -1003107822060" -ForegroundColor White
Write-Host "   SUPABASE_URL = https://hpjrjpxctmlttdwqrpvc.supabase.co" -ForegroundColor White
Write-Host "   SUPABASE_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhwanJqcHhjdG1sdHRkd3FycHZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwNzAxMzIsImV4cCI6MjA3NzY0NjEzMn0.jgJD4uKiLoW6MPw5yMrsoYlguowcnn5tl9pKeib7tcs" -ForegroundColor White
Write-Host ""

Read-Host "Press Enter to exit"
