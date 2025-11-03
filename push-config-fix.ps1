# Push config files fix
$OutputEncoding = [System.Text.Encoding]::UTF8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Pushing Config Fix" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Adding config files..." -ForegroundColor Yellow
git add Procfile railway.json nixpacks.toml package.json

Write-Host ""
Write-Host "Committing..." -ForegroundColor Yellow
git commit -m "Fix Railway config - use server.js from root instead of server/index.js"

Write-Host ""
Write-Host "Pushing..." -ForegroundColor Yellow
git push

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "Done! Railway will restart." -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Wait 2-3 minutes, then check:" -ForegroundColor Yellow
Write-Host "  .\check-railway-logs.ps1" -ForegroundColor Cyan
Write-Host ""

Read-Host "Press Enter to exit"

