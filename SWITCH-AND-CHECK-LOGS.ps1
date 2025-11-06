# PowerShell script to switch to stunning-manifestation and check logs
$ErrorActionPreference = "Stop"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  SWITCH TO STUNNING-MANIFESTATION" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

if (-not (Get-Command railway -ErrorAction SilentlyContinue)) {
    Write-Host "ERROR: Railway CLI not installed" -ForegroundColor Red
    Write-Host "Install: npm install -g @railway/cli" -ForegroundColor Yellow
    Write-Host "Then: railway login" -ForegroundColor Yellow
    exit 1
}

Write-Host "Current project:" -ForegroundColor Yellow
$currentStatus = railway status 2>&1 | Out-String
Write-Host $currentStatus -ForegroundColor Gray

if ($currentStatus -match "stunning-manifestation") {
    Write-Host ""
    Write-Host "OK: Already linked to stunning-manifestation" -ForegroundColor Green
    Write-Host ""
    Write-Host "Getting logs..." -ForegroundColor Yellow
    Write-Host ""
    
    try {
        $logs = railway logs --tail 100 2>&1 | Out-String
        Write-Host "=== RAILWAY LOGS (last 100 lines) ===" -ForegroundColor Cyan
        Write-Host $logs -ForegroundColor White
        Write-Host "=====================================" -ForegroundColor Cyan
        
        # Check for errors
        if ($logs -match "Error|Cannot find|ENOENT|EACCES|failed|Failed") {
            Write-Host ""
            Write-Host "ERRORS DETECTED:" -ForegroundColor Red
            $errorLines = $logs -split "`n" | Where-Object { 
                $_ -match "Error|Cannot find|ENOENT|EACCES|failed|Failed|command not found" -and 
                $_ -notmatch "^\s*$"
            }
            foreach ($line in $errorLines | Select-Object -First 20) {
                if ($line.Trim().Length -gt 0) {
                    Write-Host "  $($line.Trim())" -ForegroundColor Red
                }
            }
        }
    } catch {
        Write-Host "Could not get logs via CLI" -ForegroundColor Yellow
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    }
} else {
    Write-Host ""
    Write-Host "Need to switch to stunning-manifestation project" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "To switch projects:" -ForegroundColor Cyan
    Write-Host "  1. Run: railway link" -ForegroundColor White
    Write-Host "  2. Select 'stunning-manifestation' from the list" -ForegroundColor White
    Write-Host "  3. Run this script again: .\SWITCH-AND-CHECK-LOGS.ps1" -ForegroundColor White
    Write-Host ""
    Write-Host "OR check logs manually in Railway Dashboard:" -ForegroundColor Cyan
    Write-Host "  1. Open: https://railway.app" -ForegroundColor White
    Write-Host "  2. Find project 'stunning-manifestation'" -ForegroundColor White
    Write-Host "  3. Go to Deployments → Latest → View logs" -ForegroundColor White
    Write-Host ""
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  CHECK SETTINGS IN DASHBOARD" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Even if you check logs, ALSO verify settings:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Open: https://railway.app" -ForegroundColor White
Write-Host "2. Find 'stunning-manifestation'" -ForegroundColor White
Write-Host "3. Settings → Service Settings" -ForegroundColor White
Write-Host ""
Write-Host "MUST BE:" -ForegroundColor Red
Write-Host "  Root Directory: (EMPTY - delete everything!)" -ForegroundColor Green
Write-Host "  Start Command: node server.js" -ForegroundColor Green
Write-Host "  Build Command: npm install" -ForegroundColor Green
Write-Host ""
Write-Host "If wrong, fix and save - Railway will auto-redeploy" -ForegroundColor Yellow
Write-Host ""

Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

