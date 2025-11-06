# PowerShell script to monitor Railway deployment status after fix
$ErrorActionPreference = "Stop"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  RAILWAY STATUS MONITOR" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Checking Railway services..." -ForegroundColor Yellow
Write-Host ""

$services = @(
    @{Name="telegram-scheduler"; URL="https://telegram-scheduler-production.up.railway.app"},
    @{Name="stunning-manifestation"; URL="https://stunning-manifestation-production.up.railway.app"}
)

$maxAttempts = 5
$delaySeconds = 30

Write-Host "Checking services (will check $maxAttempts times with $delaySeconds second delays)..." -ForegroundColor Cyan
Write-Host ""

for ($attempt = 1; $attempt -le $maxAttempts; $attempt++) {
    Write-Host "Attempt $attempt of $maxAttempts" -ForegroundColor Yellow
    Write-Host "================================" -ForegroundColor Gray
    Write-Host ""
    
    foreach ($service in $services) {
        Write-Host "  Checking: $($service.Name)..." -ForegroundColor Gray
        
        try {
            $response = Invoke-WebRequest -Uri "$($service.URL)/health" -Method GET -TimeoutSec 10 -ErrorAction Stop
            
            if ($response.StatusCode -eq 200) {
                Write-Host "    ✓ RUNNING" -ForegroundColor Green
                $statusJson = $response.Content | ConvertFrom-Json
                Write-Host "      Status: $($statusJson.status)" -ForegroundColor Gray
                Write-Host "      Date: $($statusJson.date)" -ForegroundColor Gray
                Write-Host "      Time: $($statusJson.time)" -ForegroundColor Gray
            } else {
                Write-Host "    ⚠ HTTP $($response.StatusCode)" -ForegroundColor Yellow
            }
        } catch {
            $statusCode = $_.Exception.Response.StatusCode.value__
            
            if ($statusCode) {
                Write-Host "    ✗ HTTP $statusCode" -ForegroundColor Red
                if ($statusCode -eq 404) {
                    Write-Host "      → Service exists but not responding correctly" -ForegroundColor Yellow
                    Write-Host "      → May still be deploying..." -ForegroundColor Cyan
                }
            } else {
                Write-Host "    ✗ NOT RESPONDING" -ForegroundColor Red
                Write-Host "      → Service may be deploying or down" -ForegroundColor Yellow
            }
        }
        
        Write-Host ""
    }
    
    # Check if stunning-manifestation is now working
    try {
        $stunningResponse = Invoke-WebRequest -Uri "$($services[1].URL)/health" -Method GET -TimeoutSec 10 -ErrorAction Stop
        if ($stunningResponse.StatusCode -eq 200) {
            Write-Host "========================================" -ForegroundColor Cyan
            Write-Host "  SUCCESS!" -ForegroundColor Green
            Write-Host "========================================" -ForegroundColor Cyan
            Write-Host ""
            Write-Host "stunning-manifestation is now RUNNING!" -ForegroundColor Green
            Write-Host ""
            Write-Host "Service URL: $($services[1].URL)" -ForegroundColor White
            Write-Host "Health check: $($services[1].URL)/health" -ForegroundColor White
            Write-Host ""
            break
        }
    } catch {
        # Continue checking
    }
    
    if ($attempt -lt $maxAttempts) {
        Write-Host "Waiting $delaySeconds seconds before next check..." -ForegroundColor Cyan
        Write-Host ""
        Start-Sleep -Seconds $delaySeconds
    }
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  FINAL STATUS" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

foreach ($service in $services) {
    Write-Host "Final check: $($service.Name)..." -ForegroundColor Yellow
    
    try {
        $response = Invoke-WebRequest -Uri "$($service.URL)/health" -Method GET -TimeoutSec 10 -ErrorAction Stop
        
        if ($response.StatusCode -eq 200) {
            Write-Host "  ✓ RUNNING" -ForegroundColor Green
        } else {
            Write-Host "  ⚠ HTTP $($response.StatusCode)" -ForegroundColor Yellow
        }
    } catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        if ($statusCode) {
            Write-Host "  ✗ HTTP $statusCode" -ForegroundColor Red
        } else {
            Write-Host "  ✗ NOT RESPONDING" -ForegroundColor Red
        }
    }
}

Write-Host ""
Write-Host "If stunning-manifestation is still not working:" -ForegroundColor Yellow
Write-Host "1. Double-check Railway Dashboard settings" -ForegroundColor White
Write-Host "2. Check Deployment logs for errors" -ForegroundColor White
Write-Host "3. Share the error message from logs" -ForegroundColor White
Write-Host ""

