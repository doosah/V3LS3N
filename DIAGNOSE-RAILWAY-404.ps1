# PowerShell script for detailed Railway error diagnosis
$ErrorActionPreference = "Stop"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  RAILWAY ERROR DIAGNOSIS" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$serviceUrl = "https://stunning-manifestation-production.up.railway.app"

Write-Host "Testing service: stunning-manifestation" -ForegroundColor Yellow
Write-Host "URL: $serviceUrl" -ForegroundColor Gray
Write-Host ""

# Test 1: Health endpoint
Write-Host "[1/3] Testing /health endpoint..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$serviceUrl/health" -Method GET -TimeoutSec 10 -ErrorAction Stop
    Write-Host "  Status: HTTP $($response.StatusCode)" -ForegroundColor Green
    Write-Host "  Response: $($response.Content)" -ForegroundColor Gray
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    if ($statusCode) {
        Write-Host "  Status: HTTP $statusCode" -ForegroundColor Red
        Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Red
        
        if ($statusCode -eq 404) {
            Write-Host ""
            Write-Host "  HTTP 404 means:" -ForegroundColor Yellow
            Write-Host "    - Service exists but endpoint not found" -ForegroundColor Gray
            Write-Host "    - Server may not be running" -ForegroundColor Gray
            Write-Host "    - Health endpoint may not exist" -ForegroundColor Gray
            Write-Host "    - Or service is still deploying" -ForegroundColor Gray
        }
    } else {
        Write-Host "  Status: NOT RESPONDING" -ForegroundColor Red
        Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host ""
        Write-Host "  This means:" -ForegroundColor Yellow
        Write-Host "    - Service may be down" -ForegroundColor Gray
        Write-Host "    - Service may be deploying" -ForegroundColor Gray
        Write-Host "    - URL may be incorrect" -ForegroundColor Gray
    }
}

Write-Host ""

# Test 2: Root endpoint
Write-Host "[2/3] Testing root endpoint..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri $serviceUrl -Method GET -TimeoutSec 10 -ErrorAction Stop
    Write-Host "  Status: HTTP $($response.StatusCode)" -ForegroundColor Green
    Write-Host "  Content length: $($response.Content.Length) bytes" -ForegroundColor Gray
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    if ($statusCode) {
        Write-Host "  Status: HTTP $statusCode" -ForegroundColor Red
    } else {
        Write-Host "  Status: NOT RESPONDING" -ForegroundColor Red
    }
}

Write-Host ""

# Test 3: Check if service is accessible at all
Write-Host "[3/3] Checking service accessibility..." -ForegroundColor Yellow

try {
    # Try to get headers
    $headers = Invoke-WebRequest -Uri "$serviceUrl/health" -Method HEAD -TimeoutSec 10 -ErrorAction Stop
    Write-Host "  Service is accessible" -ForegroundColor Green
    Write-Host "  Server: $($headers.Headers.Server)" -ForegroundColor Gray
} catch {
    Write-Host "  Service is not accessible" -ForegroundColor Red
    Write-Host "  This usually means:" -ForegroundColor Yellow
    Write-Host "    - Service is not deployed" -ForegroundColor Gray
    Write-Host "    - Service failed to start" -ForegroundColor Gray
    Write-Host "    - Build errors in Railway" -ForegroundColor Gray
}

Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  ACTION REQUIRED" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "HTTP 404 means the service exists but is not working correctly." -ForegroundColor Yellow
Write-Host ""
Write-Host "CHECK THESE IN RAILWAY DASHBOARD:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Did you fix the settings?" -ForegroundColor Yellow
Write-Host "   - Root Directory: MUST be EMPTY" -ForegroundColor Red
Write-Host "   - Start Command: MUST be 'node server.js'" -ForegroundColor Red
Write-Host "   - Build Command: SHOULD be 'npm install'" -ForegroundColor Yellow
Write-Host ""
Write-Host "2. Check Deployment Logs:" -ForegroundColor Yellow
Write-Host "   - Go to: https://railway.app" -ForegroundColor White
Write-Host "   - Find project 'stunning-manifestation'" -ForegroundColor White
Write-Host "   - Click: Deployments tab" -ForegroundColor White
Write-Host "   - Click: Latest deployment" -ForegroundColor White
Write-Host "   - Click: 'View logs' or 'Build logs'" -ForegroundColor White
Write-Host "   - Look for errors like:" -ForegroundColor Yellow
Write-Host "     * 'Cannot find module server.js'" -ForegroundColor Gray
Write-Host "     * 'Error: Cannot find module'" -ForegroundColor Gray
Write-Host "     * 'Command failed'" -ForegroundColor Gray
Write-Host "     * 'EACCES: permission denied'" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Check Runtime Logs:" -ForegroundColor Yellow
Write-Host "   - Same place, but look for 'Runtime logs'" -ForegroundColor White
Write-Host "   - Look for:" -ForegroundColor Yellow
Write-Host "     * 'Error: Cannot find module'" -ForegroundColor Gray
Write-Host "     * 'Server listening on port...'" -ForegroundColor Green
Write-Host "     * Any startup errors" -ForegroundColor Gray
Write-Host ""
Write-Host "After checking logs, share the error message!" -ForegroundColor Cyan
Write-Host ""

