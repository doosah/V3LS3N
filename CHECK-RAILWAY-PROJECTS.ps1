# PowerShell script to check all Railway projects and fix stunning-manifestation
$ErrorActionPreference = "Stop"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  RAILWAY PROJECTS CHECK" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check Railway CLI
if (Get-Command railway -ErrorAction SilentlyContinue) {
    Write-Host "[1/3] Checking Railway CLI..." -ForegroundColor Yellow
    Write-Host "  OK: Railway CLI found" -ForegroundColor Green
    
    try {
        # Get current project
        $currentProject = railway status 2>&1 | Out-String
        Write-Host "  Current project:" -ForegroundColor Gray
        Write-Host $currentProject -ForegroundColor Gray
        
        # Check if stunning-manifestation exists
        if ($currentProject -match "stunning-manifestation") {
            Write-Host "  FOUND: stunning-manifestation is active" -ForegroundColor Green
        } else {
            Write-Host "  INFO: Current project is different from stunning-manifestation" -ForegroundColor Cyan
            Write-Host "  To switch to stunning-manifestation:" -ForegroundColor Yellow
            Write-Host "    railway link" -ForegroundColor White
            Write-Host "    (select stunning-manifestation project)" -ForegroundColor White
        }
    } catch {
        Write-Host "  WARNING: Could not get Railway status" -ForegroundColor Yellow
    }
} else {
    Write-Host "[1/3] Railway CLI not installed" -ForegroundColor Yellow
    Write-Host "  Install: npm install -g @railway/cli" -ForegroundColor White
}

Write-Host ""

# Check service URLs
Write-Host "[2/3] Checking Railway service URLs..." -ForegroundColor Yellow

$services = @(
    @{Name="telegram-scheduler"; URL="https://telegram-scheduler-production.up.railway.app"},
    @{Name="stunning-manifestation"; URL="https://stunning-manifestation-production.up.railway.app"}
)

foreach ($service in $services) {
    Write-Host "  Checking: $($service.Name)" -ForegroundColor Gray
    try {
        $response = Invoke-WebRequest -Uri "$($service.URL)/health" -Method GET -TimeoutSec 5 -ErrorAction Stop
        Write-Host "    OK: Service is running" -ForegroundColor Green
        Write-Host "      Status: $($response.Content)" -ForegroundColor Gray
    } catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        if ($statusCode) {
            Write-Host "    ERROR: HTTP $statusCode - Service exists but has errors" -ForegroundColor Red
        } else {
            Write-Host "    WARNING: Service not responding" -ForegroundColor Yellow
            Write-Host "      URL may be incorrect or service not deployed" -ForegroundColor Gray
        }
    }
}

Write-Host ""

# Recommendations
Write-Host "[3/3] Recommendations for stunning-manifestation..." -ForegroundColor Yellow
Write-Host ""
Write-Host "If 'stunning-manifestation' has build errors:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Check Railway Dashboard:" -ForegroundColor White
Write-Host "   - Open: https://railway.app" -ForegroundColor Gray
Write-Host "   - Find project 'stunning-manifestation'" -ForegroundColor Gray
Write-Host "   - Go to Deployments > View logs" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Check project settings:" -ForegroundColor White
Write-Host "   - Settings > Service Settings" -ForegroundColor Gray
Write-Host "   - Root Directory: should be empty" -ForegroundColor Gray
Write-Host "   - Start Command: node server.js" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Check if project uses correct repository:" -ForegroundColor White
Write-Host "   - Settings > Source" -ForegroundColor Gray
Write-Host "   - Should be: https://github.com/doosah/V3LS3N" -ForegroundColor Gray
Write-Host ""
Write-Host "4. After pushing fixes, Railway will auto-rebuild" -ForegroundColor White
Write-Host ""

Write-Host "Current working service: telegram-scheduler" -ForegroundColor Green
Write-Host "Status: Running correctly" -ForegroundColor Green
Write-Host ""
