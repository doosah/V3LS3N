# PowerShell script to check Railway logs via CLI
$ErrorActionPreference = "Stop"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  RAILWAY LOGS CHECKER" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Railway CLI is installed
if (Get-Command railway -ErrorAction SilentlyContinue) {
    Write-Host "[1/2] Railway CLI found!" -ForegroundColor Green
    Write-Host ""
    
    Write-Host "Checking current project..." -ForegroundColor Yellow
    $status = railway status 2>&1 | Out-String
    Write-Host $status -ForegroundColor Gray
    Write-Host ""
    
    if ($status -match "stunning-manifestation") {
        Write-Host "OK: Project 'stunning-manifestation' is active" -ForegroundColor Green
        Write-Host ""
        
        Write-Host "Attempting to get logs..." -ForegroundColor Yellow
        Write-Host "(This may take a moment...)" -ForegroundColor Gray
        Write-Host ""
        
        try {
            # Try to get logs
            $logs = railway logs --tail 50 2>&1 | Out-String
            Write-Host "=== RAILWAY LOGS (last 50 lines) ===" -ForegroundColor Cyan
            Write-Host $logs -ForegroundColor White
            Write-Host "====================================" -ForegroundColor Cyan
            Write-Host ""
            
            # Check for common errors
            if ($logs -match "Cannot find module|Error:|ENOENT|EACCES") {
                Write-Host "ERRORS DETECTED IN LOGS:" -ForegroundColor Red
                $errorLines = $logs -split "`n" | Where-Object { $_ -match "Error|Cannot find|ENOENT|EACCES|failed" }
                foreach ($line in $errorLines) {
                    Write-Host "  $line" -ForegroundColor Red
                }
            } else {
                Write-Host "No obvious errors found in logs" -ForegroundColor Yellow
                Write-Host "But service is still 404 - check Railway Dashboard logs" -ForegroundColor Yellow
            }
        } catch {
            Write-Host "Could not get logs via CLI" -ForegroundColor Yellow
            Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
            Write-Host ""
            Write-Host "You need to check logs manually in Railway Dashboard" -ForegroundColor Cyan
        }
    } else {
        Write-Host "WARNING: Current project is not 'stunning-manifestation'" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "To switch to stunning-manifestation:" -ForegroundColor Cyan
        Write-Host "  railway link" -ForegroundColor White
        Write-Host "  (select 'stunning-manifestation' when prompted)" -ForegroundColor Gray
        Write-Host ""
        Write-Host "Then run this script again" -ForegroundColor Yellow
    }
} else {
    Write-Host "[1/2] Railway CLI not installed" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "To install Railway CLI:" -ForegroundColor Cyan
    Write-Host "  npm install -g @railway/cli" -ForegroundColor White
    Write-Host "  railway login" -ForegroundColor White
    Write-Host ""
}

Write-Host "[2/2] Manual Log Check Instructions:" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Since CLI may not work, check logs manually:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Open Railway Dashboard:" -ForegroundColor White
Write-Host "   https://railway.app" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Find project 'stunning-manifestation'" -ForegroundColor White
Write-Host ""
Write-Host "3. Go to Deployments tab" -ForegroundColor White
Write-Host ""
Write-Host "4. Click on the LATEST deployment (should show failed/error)" -ForegroundColor White
Write-Host ""
Write-Host "5. Click 'View logs' or 'Build logs'" -ForegroundColor White
Write-Host ""
Write-Host "6. Look for these common errors:" -ForegroundColor Yellow
Write-Host "   - 'Cannot find module server.js'" -ForegroundColor Red
Write-Host "   - 'Cannot find module ./index.js'" -ForegroundColor Red
Write-Host "   - 'Error: Cannot find module'" -ForegroundColor Red
Write-Host "   - 'Command failed'" -ForegroundColor Red
Write-Host "   - 'EACCES: permission denied'" -ForegroundColor Red
Write-Host ""
Write-Host "7. Copy the FULL error message" -ForegroundColor White
Write-Host ""
Write-Host "8. Also check Runtime logs (if available):" -ForegroundColor Yellow
Write-Host "   - Same deployment page" -ForegroundColor Gray
Write-Host "   - Look for 'Runtime logs' tab" -ForegroundColor Gray
Write-Host "   - Check if server is starting" -ForegroundColor Gray
Write-Host ""
Write-Host "9. Share the error message here!" -ForegroundColor Cyan
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  SETTINGS CHECKLIST" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "While checking logs, also verify settings:" -ForegroundColor Yellow
Write-Host ""
Write-Host "Settings → Service Settings:" -ForegroundColor White
Write-Host "  [ ] Root Directory: EMPTY (not 'server')" -ForegroundColor Yellow
Write-Host "  [ ] Start Command: 'node server.js'" -ForegroundColor Yellow
Write-Host "  [ ] Build Command: 'npm install'" -ForegroundColor Yellow
Write-Host ""
Write-Host "If any setting is wrong, change it and save!" -ForegroundColor Red
Write-Host ""

Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
