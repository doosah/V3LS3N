# Check if changes are pushed and restart Railway
$OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Checking Git Status and Railway" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$repoPath = "C:\Users\Ноут\V3LS3N-telegram-bot"

if (-not (Test-Path $repoPath)) {
    Write-Host "ERROR: Repository folder not found!" -ForegroundColor Red
    exit
}

Set-Location $repoPath

Write-Host "1. Checking git status..." -ForegroundColor Yellow
git status

Write-Host ""
Write-Host "2. Checking last commit..." -ForegroundColor Yellow
git log --oneline -3

Write-Host ""
Write-Host "3. Checking if changes need to be pushed..." -ForegroundColor Yellow
$status = git status --porcelain
if ($status) {
    Write-Host "⚠️ There are uncommitted changes!" -ForegroundColor Yellow
    Write-Host "Adding and committing..." -ForegroundColor Cyan
    git add .
    git commit -m "Add detailed logging for image generation"
    git push
    Write-Host "✅ Changes pushed!" -ForegroundColor Green
} else {
    $localCommit = git rev-parse HEAD
    $remoteCommit = git rev-parse origin/main 2>$null
    if ($LASTEXITCODE -ne 0 -or $localCommit -ne $remoteCommit) {
        Write-Host "⚠️ Local and remote are different!" -ForegroundColor Yellow
        Write-Host "Pushing..." -ForegroundColor Cyan
        git push
        Write-Host "✅ Pushed!" -ForegroundColor Green
    } else {
        Write-Host "✅ Everything is up to date" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "4. To restart Railway service:" -ForegroundColor Yellow
Write-Host "   - Go to Railway Dashboard" -ForegroundColor White
Write-Host "   - Click on your service" -ForegroundColor White
Write-Host "   - Click 'Redeploy' or 'Deploy' button" -ForegroundColor White
Write-Host ""
Write-Host "   Or wait 5-10 minutes for auto-deploy" -ForegroundColor Cyan
Write-Host ""

Read-Host "Press Enter to exit"

