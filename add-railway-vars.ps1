# Add Railway environment variables via CLI
$OutputEncoding = [System.Text.Encoding]::UTF8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Adding Railway Environment Variables" -ForegroundColor Cyan
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
    Write-Host "WARNING: Not authorized. Please login:" -ForegroundColor Yellow
    railway login
}

Write-Host ""
Write-Host "Make sure you're linked to the correct project:" -ForegroundColor Yellow
Write-Host "  railway link" -ForegroundColor Cyan
Write-Host ""
$confirm = Read-Host "Have you linked to V3LS3N-telegram-bot project? (Y/N)"
if ($confirm -ne "Y" -and $confirm -ne "y") {
    Write-Host "Please run: railway link" -ForegroundColor Yellow
    Write-Host "Then select: V3LS3N-telegram-bot" -ForegroundColor White
    Read-Host "Press Enter to exit"
    exit
}

Write-Host ""
Write-Host "Adding variables..." -ForegroundColor Yellow
Write-Host ""

# Add variables
Write-Host "1. TELEGRAM_BOT_TOKEN..." -ForegroundColor Cyan
railway variables --set "TELEGRAM_BOT_TOKEN=8241855422:AAG7yW4NT5yoOagAo7My6bXDCdOo-pAhUa8"

Write-Host "2. TELEGRAM_CHAT_ID..." -ForegroundColor Cyan
railway variables --set "TELEGRAM_CHAT_ID=-1003107822060"

Write-Host "3. SUPABASE_URL..." -ForegroundColor Cyan
railway variables --set "SUPABASE_URL=https://hpjrjpxctmlttdwqrpvc.supabase.co"

Write-Host "4. SUPABASE_KEY..." -ForegroundColor Cyan
railway variables --set "SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhwanJqcHhjdG1sdHRkd3FycHZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwNzAxMzIsImV4cCI6MjA3NzY0NjEzMn0.jgJD4uKiLoW6MPw5yMrsoYlguowcnn5tl9pKeib7tcs"

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "Done! Variables added!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Verifying variables..." -ForegroundColor Yellow
railway variables

Write-Host ""
Write-Host "Railway will restart automatically with new variables." -ForegroundColor Cyan
Read-Host "Press Enter to exit"

