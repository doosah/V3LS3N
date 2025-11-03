# Link Railway project and add variables
$OutputEncoding = [System.Text.Encoding]::UTF8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Railway Setup - Link Project + Variables" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check Railway CLI
$railwayCheck = railway --version 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Railway CLI not found!" -ForegroundColor Red
    Write-Host "Install: npm install -g @railway/cli" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit
}

Write-Host "Checking authorization..." -ForegroundColor Yellow
railway whoami 2>&1 | Out-Null
if ($LASTEXITCODE -ne 0) {
    Write-Host "Not authorized. Logging in..." -ForegroundColor Yellow
    railway login
}

Write-Host ""
Write-Host "Linking to Railway project..." -ForegroundColor Yellow
Write-Host "Select: V3LS3N-telegram-bot (or the project you created)" -ForegroundColor Cyan
railway link

Write-Host ""
Write-Host "Adding environment variables..." -ForegroundColor Yellow
Write-Host ""

railway variables --set "TELEGRAM_BOT_TOKEN=8241855422:AAG7yW4NT5yoOagAo7My6bXDCdOo-pAhUa8"
railway variables --set "TELEGRAM_CHAT_ID=-1003107822060"
railway variables --set "SUPABASE_URL=https://hpjrjpxctmlttdwqrpvc.supabase.co"
railway variables --set "SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhwanJqcHhjdG1sdHRkd3FycHZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwNzAxMzIsImV4cCI6MjA3NzY0NjEzMn0.jgJD4uKiLoW6MPw5yMrsoYlguowcnn5tl9pKeib7tcs"

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "Done! Variables added!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Checking variables..." -ForegroundColor Yellow
railway variables

Read-Host "Press Enter to exit"

