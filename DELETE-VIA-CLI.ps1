# Simplified script - shows Railway CLI commands for deletion
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  RAILWAY CLI DELETE GUIDE" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Railway CLI does not have a direct delete command for projects." -ForegroundColor Yellow
Write-Host ""
Write-Host "OPTION 1: Disconnect via CLI (recommended)" -ForegroundColor Green
Write-Host ""
Write-Host "1. Link to project:" -ForegroundColor White
Write-Host "   railway link" -ForegroundColor Gray
Write-Host "   (select stunning-manifestation)" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Disconnect source:" -ForegroundColor White
Write-Host "   railway unlink" -ForegroundColor Gray
Write-Host "   OR in Dashboard: Settings -> Source -> Disconnect" -ForegroundColor Gray
Write-Host ""
Write-Host "OPTION 2: Delete via Dashboard (permanent)" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Open: https://railway.app" -ForegroundColor White
Write-Host "2. Find: stunning-manifestation" -ForegroundColor White
Write-Host "3. Settings -> Delete Project" -ForegroundColor White
Write-Host ""
Write-Host "OPTION 3: Railway API (advanced)" -ForegroundColor Cyan
Write-Host ""
Write-Host "Railway CLI does not support project deletion." -ForegroundColor Yellow
Write-Host "You need to use Railway Dashboard or API." -ForegroundColor Yellow
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  QUICK DISCONNECT VIA CLI" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Run these commands:" -ForegroundColor Yellow
Write-Host ""
Write-Host "railway link" -ForegroundColor White
Write-Host "# Select: stunning-manifestation" -ForegroundColor Gray
Write-Host ""
Write-Host "# Then in Dashboard: Settings -> Source -> Disconnect" -ForegroundColor Yellow
Write-Host "# This stops deployments but keeps project" -ForegroundColor Gray
Write-Host ""

