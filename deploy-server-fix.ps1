# Deploy server.js fix to Railway
$OutputEncoding = [System.Text.Encoding]::UTF8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Deploying Server Fix to Railway" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "This will:" -ForegroundColor Yellow
Write-Host "1. Add server.js to git" -ForegroundColor White
Write-Host "2. Update package.json" -ForegroundColor White
Write-Host "3. Commit and push to GitHub" -ForegroundColor White
Write-Host "4. Railway will auto-deploy" -ForegroundColor White
Write-Host ""

$confirm = Read-Host "Continue? (Y/N)"
if ($confirm -ne "Y" -and $confirm -ne "y") {
    Write-Host "Cancelled." -ForegroundColor Yellow
    exit
}

Write-Host ""
Write-Host "Adding files..." -ForegroundColor Yellow
git add server.js package.json

Write-Host ""
Write-Host "Committing..." -ForegroundColor Yellow
git commit -m "Add server.js in root - Railway will use it instead of index.html"

Write-Host ""
Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
git push

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "Done! Railway will auto-deploy." -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Wait 2-3 minutes, then check logs:" -ForegroundColor Yellow
Write-Host "  .\check-railway-logs.ps1" -ForegroundColor Cyan
Write-Host ""

Read-Host "Press Enter to exit"

