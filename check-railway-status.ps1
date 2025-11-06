# PowerShell script to monitor Railway deployment status
$ErrorActionPreference = "Stop"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  RAILWAY DEPLOYMENT STATUS CHECK" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Checking Railway services..." -ForegroundColor Yellow
Write-Host ""

$services = @(
    @{Name="telegram-scheduler"; URL="https://telegram-scheduler-production.up.railway.app"; Expected=200},
    @{Name="stunning-manifestation"; URL="https://stunning-manifestation-production.up.railway.app"; Expected=200}
)

$results = @()

foreach ($service in $services) {
    Write-Host "Checking: $($service.Name)..." -ForegroundColor Gray
    
    try {
        $response = Invoke-WebRequest -Uri "$($service.URL)/health" -Method GET -TimeoutSec 10 -ErrorAction Stop
        
        if ($response.StatusCode -eq 200) {
            $status = "RUNNING"
            $statusColor = "Green"
            $details = $response.Content
        } else {
            $status = "ERROR_HTTP_$($response.StatusCode)"
            $statusColor = "Yellow"
            $details = "HTTP $($response.StatusCode)"
        }
        
        Write-Host "  Status: $status" -ForegroundColor $statusColor
        Write-Host "  Details: $details" -ForegroundColor Gray
        
        $results += @{
            Name = $service.Name
            Status = $status
            URL = $service.URL
            Details = $details
        }
        
    } catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        
        if ($statusCode) {
            $status = "HTTP_$statusCode"
            $statusColor = "Red"
            $details = "HTTP $statusCode - Service exists but not responding correctly"
        } else {
            $status = "NOT_RESPONDING"
            $statusColor = "Yellow"
            $details = "Service not responding (may be deploying or down)"
        }
        
        Write-Host "  Status: $status" -ForegroundColor $statusColor
        Write-Host "  Details: $details" -ForegroundColor Gray
        
        $results += @{
            Name = $service.Name
            Status = $status
            URL = $service.URL
            Details = $details
        }
    }
    
    Write-Host ""
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  SUMMARY" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$allRunning = $true
foreach ($result in $results) {
    if ($result.Status -eq "RUNNING") {
        Write-Host "  OK: $($result.Name) is running" -ForegroundColor Green
    } else {
        Write-Host "  ISSUE: $($result.Name) - $($result.Status)" -ForegroundColor Yellow
        $allRunning = $false
    }
}

Write-Host ""

if ($allRunning) {
    Write-Host "SUCCESS: All services are running!" -ForegroundColor Green
} else {
    Write-Host "Some services need attention:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "For stunning-manifestation:" -ForegroundColor Cyan
    Write-Host "1. Check Railway Dashboard:" -ForegroundColor White
    Write-Host "   https://railway.app" -ForegroundColor Gray
    Write-Host "2. Find project 'stunning-manifestation'" -ForegroundColor White
    Write-Host "3. Go to Deployments > View logs" -ForegroundColor White
    Write-Host "4. Look for build or runtime errors" -ForegroundColor White
    Write-Host ""
    Write-Host "Common issues:" -ForegroundColor Cyan
    Write-Host "  - Missing environment variables" -ForegroundColor Gray
    Write-Host "  - Wrong Root Directory (should be empty)" -ForegroundColor Gray
    Write-Host "  - Wrong Start Command (should be 'node server.js')" -ForegroundColor Gray
    Write-Host "  - Build errors (check logs)" -ForegroundColor Gray
}

Write-Host ""
Write-Host "To check again, run:" -ForegroundColor Cyan
Write-Host "  .\CHECK-RAILWAY-PROJECTS.ps1" -ForegroundColor White
Write-Host ""
