# PowerShell script to fix Railway settings via CLI or provide manual instructions
$ErrorActionPreference = "Stop"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  RAILWAY SETTINGS FIX" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Railway CLI is installed
if (Get-Command railway -ErrorAction SilentlyContinue) {
    Write-Host "[1/3] Railway CLI found!" -ForegroundColor Green
    Write-Host ""
    
    Write-Host "Checking current Railway project..." -ForegroundColor Yellow
    $currentStatus = railway status 2>&1 | Out-String
    Write-Host $currentStatus -ForegroundColor Gray
    
    if ($currentStatus -match "stunning-manifestation") {
        Write-Host ""
        Write-Host "OK: Project 'stunning-manifestation' is active" -ForegroundColor Green
        Write-Host ""
        Write-Host "Attempting to check service settings..." -ForegroundColor Yellow
        Write-Host ""
        Write-Host "Note: Railway CLI may not support direct settings modification" -ForegroundColor Cyan
        Write-Host "You may need to use Railway Dashboard instead" -ForegroundColor Yellow
        Write-Host ""
    } else {
        Write-Host ""
        Write-Host "WARNING: Current project is not 'stunning-manifestation'" -ForegroundColor Yellow
        Write-Host "To switch to stunning-manifestation:" -ForegroundColor Cyan
        Write-Host "  railway link" -ForegroundColor White
        Write-Host "  (select 'stunning-manifestation' when prompted)" -ForegroundColor Gray
        Write-Host ""
    }
} else {
    Write-Host "[1/3] Railway CLI not installed" -ForegroundColor Yellow
    Write-Host "  Install: npm install -g @railway/cli" -ForegroundColor White
    Write-Host ""
}

Write-Host "[2/3] Manual Fix Instructions (REQUIRED):" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "STEP 1: Open Railway Dashboard" -ForegroundColor Cyan
Write-Host "  URL: https://railway.app" -ForegroundColor White
Write-Host "  Login with your account" -ForegroundColor Gray
Write-Host ""
Write-Host "STEP 2: Find Project" -ForegroundColor Cyan
Write-Host "  Look for project: 'stunning-manifestation'" -ForegroundColor White
Write-Host "  Click on it to open" -ForegroundColor Gray
Write-Host ""
Write-Host "STEP 3: Open Service Settings" -ForegroundColor Cyan
Write-Host "  Click on the service (usually shows 'telegram-scheduler' or similar)" -ForegroundColor White
Write-Host "  Go to: Settings tab" -ForegroundColor White
Write-Host "  Scroll to: 'Service Settings' section" -ForegroundColor White
Write-Host ""
Write-Host "STEP 4: Fix Root Directory" -ForegroundColor Cyan
Write-Host "  Find field: 'Root Directory'" -ForegroundColor White
Write-Host "  CURRENT VALUE: (probably says 'server' or './server')" -ForegroundColor Yellow
Write-Host "  CHANGE TO: (leave EMPTY - delete everything)" -ForegroundColor Red
Write-Host "  Action: Click the field, delete all text, leave blank" -ForegroundColor Gray
Write-Host ""
Write-Host "STEP 5: Fix Start Command" -ForegroundColor Cyan
Write-Host "  Find field: 'Start Command'" -ForegroundColor White
Write-Host "  CURRENT VALUE: (might say 'npm start' or 'node index.js')" -ForegroundColor Yellow
Write-Host "  CHANGE TO: node server.js" -ForegroundColor Red
Write-Host "  Action: Replace with: node server.js" -ForegroundColor Gray
Write-Host ""
Write-Host "STEP 6: Check Build Command" -ForegroundColor Cyan
Write-Host "  Find field: 'Build Command'" -ForegroundColor White
Write-Host "  SHOULD BE: npm install" -ForegroundColor Green
Write-Host "  If different, change to: npm install" -ForegroundColor Yellow
Write-Host ""
Write-Host "STEP 7: Save Changes" -ForegroundColor Cyan
Write-Host "  Click 'Save' or 'Update' button" -ForegroundColor White
Write-Host "  Railway will automatically redeploy" -ForegroundColor Green
Write-Host ""

Write-Host "[3/3] Verify Settings After Fix:" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Correct Settings Should Be:" -ForegroundColor Green
Write-Host "  Root Directory: (empty)" -ForegroundColor Gray
Write-Host "  Build Command: npm install" -ForegroundColor Gray
Write-Host "  Start Command: node server.js" -ForegroundColor Gray
Write-Host ""
Write-Host "After saving, wait 1-2 minutes and check:" -ForegroundColor Yellow
Write-Host "  .\CHECK-RAILWAY-STATUS.ps1" -ForegroundColor White
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  IMPORTANT NOTES" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Root Directory MUST be empty" -ForegroundColor Red
Write-Host "   Railway looks for server.js in the root folder" -ForegroundColor Gray
Write-Host "   If Root Directory = 'server', Railway looks in server/server.js (WRONG)" -ForegroundColor Gray
Write-Host ""
Write-Host "2. The 'server/' folder in your project is OLD code" -ForegroundColor Yellow
Write-Host "   It's not used anymore - we use server.js in root" -ForegroundColor Gray
Write-Host "   You can safely ignore it or delete it" -ForegroundColor Gray
Write-Host ""
Write-Host "3. All configuration files are correct locally" -ForegroundColor Green
Write-Host "   railway.json, railway.toml, Procfile, nixpacks.toml all say 'node server.js'" -ForegroundColor Gray
Write-Host "   But Railway Dashboard settings OVERRIDE these files" -ForegroundColor Yellow
Write-Host ""

Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

