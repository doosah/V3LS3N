# PowerShell script to disconnect stunning-manifestation via Railway CLI
$ErrorActionPreference = "Stop"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  DISCONNECT STUNNING-MANIFESTATION" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Railway CLI is installed
if (-not (Get-Command railway -ErrorAction SilentlyContinue)) {
    Write-Host "ERROR: Railway CLI not installed" -ForegroundColor Red
    Write-Host ""
    Write-Host "Install Railway CLI:" -ForegroundColor Yellow
    Write-Host "  npm install -g @railway/cli" -ForegroundColor White
    Write-Host ""
    Write-Host "Then login:" -ForegroundColor Yellow
    Write-Host "  railway login" -ForegroundColor White
    Write-Host ""
    exit 1
}

Write-Host "[1/4] Railway CLI found" -ForegroundColor Green
Write-Host ""

# Check current project
Write-Host "[2/4] Checking current Railway project..." -ForegroundColor Yellow
$currentStatus = railway status 2>&1 | Out-String
Write-Host $currentStatus -ForegroundColor Gray

if ($currentStatus -match "stunning-manifestation") {
    Write-Host "  OK: Linked to stunning-manifestation" -ForegroundColor Green
    $isLinked = $true
} else {
    Write-Host "  INFO: Not linked to stunning-manifestation" -ForegroundColor Yellow
    $isLinked = $false
}

Write-Host ""

# Instructions
Write-Host "[3/4] DISCONNECTION PROCESS" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

if (-not $isLinked) {
    Write-Host "Step 1: Link to stunning-manifestation project" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Run this command:" -ForegroundColor White
    Write-Host "  railway link" -ForegroundColor Green
    Write-Host ""
    Write-Host "When prompted, select: stunning-manifestation" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Then run this script again." -ForegroundColor Yellow
    Write-Host ""
    exit 0
}

Write-Host "Step 1: OK - Already linked to stunning-manifestation" -ForegroundColor Green
Write-Host ""

Write-Host "Step 2: Disconnect source repository" -ForegroundColor Yellow
Write-Host ""
Write-Host "Railway CLI does not support disconnecting directly." -ForegroundColor Yellow
Write-Host "You need to do this in Railway Dashboard:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Open: https://railway.app" -ForegroundColor White
Write-Host "2. Find project: stunning-manifestation" -ForegroundColor White
Write-Host "3. Go to: Settings -> Source" -ForegroundColor White
Write-Host "4. Click: Disconnect" -ForegroundColor Red
Write-Host ""
Write-Host "This will stop deployments but keep the project." -ForegroundColor Gray
Write-Host ""

Write-Host "[4/4] AFTER DISCONNECTING" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "After disconnecting, verify:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. telegram-scheduler still works:" -ForegroundColor White
Write-Host "   .\CHECK-RAILWAY-STATUS.ps1" -ForegroundColor Gray
Write-Host ""
Write-Host "2. No more error emails from Railway" -ForegroundColor White
Write-Host ""
Write-Host "3. Wait 24 hours, then delete project in Dashboard:" -ForegroundColor White
Write-Host "   Settings -> Delete Project" -ForegroundColor Gray
Write-Host ""
Write-Host "OR delete immediately if you are sure:" -ForegroundColor Yellow
Write-Host "   Settings -> Delete Project" -ForegroundColor Gray
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  ALTERNATIVE: DIRECT DELETION" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "If you want to skip disconnecting and delete directly:" -ForegroundColor Yellow
Write-Host ""
Write-Host "Railway Dashboard -> stunning-manifestation -> Settings -> Delete Project" -ForegroundColor White
Write-Host ""
Write-Host "This is safe because:" -ForegroundColor Green
Write-Host "  - telegram-scheduler is working" -ForegroundColor Gray
Write-Host "  - stunning-manifestation is not working" -ForegroundColor Gray
Write-Host "  - It is the old unused project" -ForegroundColor Gray
Write-Host ""

