# Quick reference card for Railway Dashboard fix
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  RAILWAY DASHBOARD QUICK FIX" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Project: stunning-manifestation" -ForegroundColor Yellow
Write-Host ""
Write-Host "URL: https://railway.app" -ForegroundColor White
Write-Host "  → Login" -ForegroundColor Gray
Write-Host "  → Find 'stunning-manifestation'" -ForegroundColor Gray
Write-Host "  → Click on service" -ForegroundColor Gray
Write-Host "  → Settings → Service Settings" -ForegroundColor Gray
Write-Host ""
Write-Host "FIX THESE 3 SETTINGS:" -ForegroundColor Red
Write-Host ""
Write-Host "1. Root Directory:" -ForegroundColor Cyan
Write-Host "   DELETE everything → Leave EMPTY" -ForegroundColor Red
Write-Host ""
Write-Host "2. Start Command:" -ForegroundColor Cyan
Write-Host "   Type: node server.js" -ForegroundColor Red
Write-Host ""
Write-Host "3. Build Command:" -ForegroundColor Cyan
Write-Host "   Type: npm install" -ForegroundColor Red
Write-Host ""
Write-Host "→ Click SAVE" -ForegroundColor Green
Write-Host "→ Wait 1-2 minutes for redeploy" -ForegroundColor Yellow
Write-Host "→ Run: .\CHECK-RAILWAY-STATUS.ps1" -ForegroundColor White
Write-Host ""
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

