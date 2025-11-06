# PowerShell script to check Railway project settings and fix common issues
$ErrorActionPreference = "Stop"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  RAILWAY BUILD ERROR DIAGNOSTICS" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Problem detected: Railway is still reporting build errors" -ForegroundColor Yellow
Write-Host ""

Write-Host "[ISSUE] Conflicting project structure detected:" -ForegroundColor Red
Write-Host "  - Root: server.js (current setup)" -ForegroundColor Gray
Write-Host "  - Folder: server/index.js (old setup)" -ForegroundColor Gray
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  STEP 1: Check Railway Dashboard" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Most likely issue: Root Directory setting in Railway" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Open Railway Dashboard:" -ForegroundColor White
Write-Host "   https://railway.app" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Find project 'stunning-manifestation'" -ForegroundColor White
Write-Host ""
Write-Host "3. Go to: Settings > Service Settings" -ForegroundColor White
Write-Host ""
Write-Host "4. Check 'Root Directory' field:" -ForegroundColor Yellow
Write-Host "   - If it says 'server' → DELETE IT (make it empty)" -ForegroundColor Red
Write-Host "   - If it's empty → GOOD" -ForegroundColor Green
Write-Host ""
Write-Host "5. Check 'Start Command' field:" -ForegroundColor Yellow
Write-Host "   - Should be: node server.js" -ForegroundColor Green
Write-Host "   - If it says 'npm start' → Change to 'node server.js'" -ForegroundColor Red
Write-Host ""
Write-Host "6. Check 'Build Command' field:" -ForegroundColor Yellow
Write-Host "   - Should be: npm install" -ForegroundColor Green
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  STEP 2: Check Deployment Logs" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Go to: Deployments tab" -ForegroundColor White
Write-Host "2. Click on the latest failed deployment" -ForegroundColor White
Write-Host "3. Click 'View logs'" -ForegroundColor White
Write-Host "4. Copy the error message and share it" -ForegroundColor White
Write-Host ""
Write-Host "Common errors:" -ForegroundColor Yellow
Write-Host "  - 'Cannot find module server.js'" -ForegroundColor Gray
Write-Host "    → Root Directory is wrong" -ForegroundColor Red
Write-Host "  - 'Cannot find module ./index.js'" -ForegroundColor Gray
Write-Host "    → Root Directory is set to 'server' instead of empty" -ForegroundColor Red
Write-Host "  - 'MODULE_NOT_FOUND'" -ForegroundColor Gray
Write-Host "    → Dependencies not installed correctly" -ForegroundColor Red
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  STEP 3: Verify Local Configuration" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check local files
Write-Host "Checking local configuration files..." -ForegroundColor Yellow

$checks = @{
    "server.js (root)" = Test-Path "server.js"
    "package.json (root)" = Test-Path "package.json"
    "railway.json" = Test-Path "railway.json"
    "railway.toml" = Test-Path "railway.toml"
    "Procfile" = Test-Path "Procfile"
    "server/ folder exists" = Test-Path "server"
}

foreach ($check in $checks.GetEnumerator()) {
    if ($check.Value) {
        Write-Host "  OK: $($check.Key)" -ForegroundColor Green
    } else {
        if ($check.Key -eq "server/ folder exists") {
            Write-Host "  INFO: $($check.Key) - not found (this is OK)" -ForegroundColor Cyan
        } else {
            Write-Host "  ERROR: $($check.Key) - not found" -ForegroundColor Red
        }
    }
}

Write-Host ""

# Check package.json
if (Test-Path "package.json") {
    $packageJson = Get-Content "package.json" -Raw | ConvertFrom-Json
    Write-Host "  package.json start script: $($packageJson.scripts.start)" -ForegroundColor Gray
    
    if ($packageJson.scripts.start -eq "node server.js") {
        Write-Host "  OK: package.json is correct" -ForegroundColor Green
    } else {
        Write-Host "  ERROR: package.json start should be 'node server.js'" -ForegroundColor Red
    }
}

Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  SOLUTION SUMMARY" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "The most common fix:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Open Railway Dashboard → Settings → Service Settings" -ForegroundColor White
Write-Host "2. Set 'Root Directory' to EMPTY (not 'server')" -ForegroundColor Red
Write-Host "3. Set 'Start Command' to 'node server.js'" -ForegroundColor Red
Write-Host "4. Save changes" -ForegroundColor White
Write-Host "5. Railway will automatically redeploy" -ForegroundColor White
Write-Host ""
Write-Host "If that doesn't work, share the error from Deployment logs" -ForegroundColor Cyan
Write-Host ""

Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

