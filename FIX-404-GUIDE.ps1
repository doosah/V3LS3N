# Quick guide for fixing Railway 404 error
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  HOW TO FIX RAILWAY 404 ERROR" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "HTTP 404 = Service exists but NOT running" -ForegroundColor Red
Write-Host ""
Write-Host "This usually means one of these:" -ForegroundColor Yellow
Write-Host "  1. Wrong Root Directory setting" -ForegroundColor Gray
Write-Host "  2. Wrong Start Command" -ForegroundColor Gray
Write-Host "  3. Build/deployment errors" -ForegroundColor Gray
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  STEP 1: CHECK SETTINGS" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Open: https://railway.app" -ForegroundColor White
Write-Host "  → Find 'stunning-manifestation'" -ForegroundColor Gray
Write-Host "  → Settings → Service Settings" -ForegroundColor Gray
Write-Host ""
Write-Host "MUST BE EXACTLY:" -ForegroundColor Red
Write-Host "  Root Directory: (EMPTY - nothing there!)" -ForegroundColor Green
Write-Host "  Start Command: node server.js" -ForegroundColor Green
Write-Host "  Build Command: npm install" -ForegroundColor Green
Write-Host ""
Write-Host "IF WRONG:" -ForegroundColor Yellow
Write-Host "  → Fix it" -ForegroundColor White
Write-Host "  → Click SAVE" -ForegroundColor White
Write-Host "  → Wait 2-3 minutes" -ForegroundColor White
Write-Host "  → Check again: .\CHECK-RAILWAY-STATUS.ps1" -ForegroundColor White
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  STEP 2: CHECK LOGS" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "If settings are correct, check logs:" -ForegroundColor Yellow
Write-Host ""
Write-Host "Run: .\CHECK-RAILWAY-LOGS.ps1" -ForegroundColor White
Write-Host ""
Write-Host "OR manually:" -ForegroundColor Yellow
Write-Host "  → Deployments tab" -ForegroundColor Gray
Write-Host "  → Latest deployment" -ForegroundColor Gray
Write-Host "  → View logs" -ForegroundColor Gray
Write-Host "  → Copy error message" -ForegroundColor Gray
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  COMMON ERRORS & FIXES" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Error: 'Cannot find module server.js'" -ForegroundColor Red
Write-Host "Fix: Root Directory MUST be empty" -ForegroundColor Green
Write-Host ""
Write-Host "Error: 'Cannot find module ./index.js'" -ForegroundColor Red
Write-Host "Fix: Root Directory is set to 'server' - DELETE IT" -ForegroundColor Green
Write-Host ""
Write-Host "Error: 'Command failed' or 'EACCES'" -ForegroundColor Red
Write-Host "Fix: Check Start Command is 'node server.js'" -ForegroundColor Green
Write-Host ""
Write-Host "Error: 'MODULE_NOT_FOUND'" -ForegroundColor Red
Write-Host "Fix: Build Command should be 'npm install'" -ForegroundColor Green
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "After fixing, wait 2-3 minutes and check:" -ForegroundColor Yellow
Write-Host "  .\MONITOR-RAILWAY-STATUS.ps1" -ForegroundColor White
Write-Host ""

