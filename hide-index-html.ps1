# Hide index.html from Railway by renaming it
$OutputEncoding = [System.Text.Encoding]::UTF8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Hiding index.html from Railway" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "This will rename index.html to index.html.bak" -ForegroundColor Yellow
Write-Host "Railway will then use server.js instead" -ForegroundColor Yellow
Write-Host ""
Write-Host "NOTE: GitHub Pages will break temporarily" -ForegroundColor Red
Write-Host "      You can restore it later if needed" -ForegroundColor Yellow
Write-Host ""

$confirm = Read-Host "Continue? (Y/N)"
if ($confirm -ne "Y" -and $confirm -ne "y") {
    Write-Host "Cancelled." -ForegroundColor Yellow
    exit
}

Write-Host ""
Write-Host "Renaming index.html..." -ForegroundColor Yellow
Rename-Item "index.html" "index.html.bak" -ErrorAction SilentlyContinue

if (Test-Path "index.html.bak") {
    Write-Host "✅ Renamed successfully" -ForegroundColor Green
} else {
    Write-Host "⚠️ index.html not found or already renamed" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Adding to git..." -ForegroundColor Yellow
git add -A

Write-Host ""
Write-Host "Committing..." -ForegroundColor Yellow
git commit -m "Rename index.html to index.html.bak - Railway will use server.js"

Write-Host ""
Write-Host "Pushing..." -ForegroundColor Yellow
git push

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "Done!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Railway will now use server.js" -ForegroundColor Cyan
Write-Host "Wait 3-5 minutes for Railway to restart" -ForegroundColor Yellow
Write-Host ""
Write-Host "Check logs:" -ForegroundColor Yellow
Write-Host "  .\check-railway-logs.ps1" -ForegroundColor Cyan
Write-Host ""

Read-Host "Press Enter to exit"

