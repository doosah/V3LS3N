# Final decision script for stunning-manifestation deletion
$ErrorActionPreference = "Stop"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  FINAL SAFETY CHECK AND DECISION" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Checking telegram-scheduler status..." -ForegroundColor Yellow
Write-Host ""

$telegramSchedulerUrl = "https://telegram-scheduler-production.up.railway.app"
$stunningManifestationUrl = "https://stunning-manifestation-production.up.railway.app"

$telegramSchedulerWorking = $false
$stunningManifestationWorking = $false

# Check telegram-scheduler
Write-Host "[1/3] Checking telegram-scheduler..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$telegramSchedulerUrl/health" -Method GET -TimeoutSec 10 -ErrorAction Stop
    if ($response.StatusCode -eq 200) {
        $telegramSchedulerWorking = $true
        Write-Host "  Status: RUNNING" -ForegroundColor Green
        
        try {
            $healthData = $response.Content | ConvertFrom-Json
            Write-Host "  Date: $($healthData.date)" -ForegroundColor Gray
            Write-Host "  Time: $($healthData.time)" -ForegroundColor Gray
            Write-Host "  Chat ID: $($healthData.chat_id)" -ForegroundColor Gray
        } catch {
            Write-Host "  Response: OK" -ForegroundColor Gray
        }
    } else {
        Write-Host "  Status: HTTP $($response.StatusCode)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "  Status: NOT RESPONDING" -ForegroundColor Red
    Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Check stunning-manifestation
Write-Host "[2/3] Checking stunning-manifestation..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$stunningManifestationUrl/health" -Method GET -TimeoutSec 10 -ErrorAction Stop
    if ($response.StatusCode -eq 200) {
        $stunningManifestationWorking = $true
        Write-Host "  Status: RUNNING" -ForegroundColor Green
    } else {
        Write-Host "  Status: HTTP $($response.StatusCode)" -ForegroundColor Yellow
    }
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    if ($statusCode) {
        Write-Host "  Status: HTTP $statusCode" -ForegroundColor Red
    } else {
        Write-Host "  Status: NOT RESPONDING" -ForegroundColor Red
    }
}

Write-Host ""

# Decision
Write-Host "[3/3] DECISION ANALYSIS" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

if ($telegramSchedulerWorking -and -not $stunningManifestationWorking) {
    Write-Host "RESULT: Safe to delete stunning-manifestation" -ForegroundColor Green
    Write-Host ""
    Write-Host "Reason:" -ForegroundColor Yellow
    Write-Host "  - telegram-scheduler is WORKING" -ForegroundColor Green
    Write-Host "  - stunning-manifestation is NOT WORKING" -ForegroundColor Red
    Write-Host "  - No functionality will be lost" -ForegroundColor Green
    Write-Host ""
    Write-Host "RECOMMENDED ACTION:" -ForegroundColor Cyan
    Write-Host "  1. Railway Dashboard -> stunning-manifestation" -ForegroundColor White
    Write-Host "  2. Settings -> Source -> Disconnect" -ForegroundColor White
    Write-Host "  3. Wait 24 hours to ensure nothing breaks" -ForegroundColor Yellow
    Write-Host "  4. If everything still works -> Delete Project" -ForegroundColor White
    Write-Host ""
    Write-Host "OR:" -ForegroundColor Cyan
    Write-Host "  Just delete it now (it is not working anyway)" -ForegroundColor Yellow
    Write-Host ""
} elseif ($telegramSchedulerWorking -and $stunningManifestationWorking) {
    Write-Host "RESULT: Both services are running" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "CAUTION:" -ForegroundColor Red
    Write-Host "  Both services are active. Check if they serve different purposes." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "RECOMMENDED ACTION:" -ForegroundColor Cyan
    Write-Host "  1. Check Railway Dashboard -> Settings -> Source" -ForegroundColor White
    Write-Host "  2. See which repositories they use" -ForegroundColor White
    Write-Host "  3. Check if they do different things" -ForegroundColor White
    Write-Host "  4. Only delete if you are sure they are duplicates" -ForegroundColor Yellow
    Write-Host ""
} else {
    Write-Host "RESULT: telegram-scheduler is not working" -ForegroundColor Red
    Write-Host ""
    Write-Host "CAUTION:" -ForegroundColor Red
    Write-Host "  telegram-scheduler seems to have issues too!" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "RECOMMENDED ACTION:" -ForegroundColor Cyan
    Write-Host "  1. Fix telegram-scheduler first" -ForegroundColor White
    Write-Host "  2. Do NOT delete stunning-manifestation yet" -ForegroundColor Yellow
    Write-Host "  3. Check why telegram-scheduler is not responding" -ForegroundColor White
    Write-Host ""
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  FINAL CHECKS" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Before deleting, verify manually:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Are you receiving Telegram messages?" -ForegroundColor White
Write-Host "   - Check your Telegram chat" -ForegroundColor Gray
Write-Host "   - Reminders at 07:45 and 21:45?" -ForegroundColor Gray
Write-Host "   - Reports at 08:00 and 22:00?" -ForegroundColor Gray
Write-Host ""
Write-Host "2. What repository is stunning-manifestation using?" -ForegroundColor White
Write-Host "   - Railway Dashboard -> stunning-manifestation" -ForegroundColor Gray
Write-Host "   - Settings -> Source" -ForegroundColor Gray
Write-Host "   - Same as telegram-scheduler?" -ForegroundColor Yellow
Write-Host ""
Write-Host "3. When was stunning-manifestation last deployed?" -ForegroundColor White
Write-Host "   - Railway Dashboard -> Deployments" -ForegroundColor Gray
Write-Host "   - Old date = inactive = safe to delete" -ForegroundColor Green
Write-Host ""

