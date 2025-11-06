# Interactive script to help delete stunning-manifestation project
$ErrorActionPreference = "Stop"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  DELETE STUNNING-MANIFESTATION" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Railway CLI is installed
if (-not (Get-Command railway -ErrorAction SilentlyContinue)) {
    Write-Host "ERROR: Railway CLI not installed" -ForegroundColor Red
    Write-Host ""
    Write-Host "Install: npm install -g @railway/cli" -ForegroundColor Yellow
    Write-Host "Login: railway login" -ForegroundColor Yellow
    Write-Host ""
    exit 1
}

Write-Host "[1/3] Railway CLI found" -ForegroundColor Green
Write-Host ""

# Check current project
Write-Host "[2/3] Current Railway project:" -ForegroundColor Yellow
$currentStatus = railway status 2>&1 | Out-String
Write-Host $currentStatus -ForegroundColor Gray

if ($currentStatus -match "stunning-manifestation") {
    Write-Host ""
    Write-Host "OK: Already linked to stunning-manifestation" -ForegroundColor Green
    $isLinked = $true
} else {
    Write-Host ""
    Write-Host "INFO: Need to switch to stunning-manifestation" -ForegroundColor Yellow
    $isLinked = $false
}

Write-Host ""

# Instructions
Write-Host "[3/3] DELETION PROCESS" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

if (-not $isLinked) {
    Write-Host "Step 1: Switch to stunning-manifestation project" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "You need to run this command manually:" -ForegroundColor White
    Write-Host ""
    Write-Host "  railway link" -ForegroundColor Green
    Write-Host ""
    Write-Host "When prompted, select: stunning-manifestation" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Press any key after you run 'railway link' and select the project..." -ForegroundColor Cyan
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    Write-Host ""
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  IMPORTANT: Railway CLI Limitation" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Railway CLI does NOT support deleting projects directly." -ForegroundColor Red
Write-Host ""
Write-Host "You MUST delete through Railway Dashboard:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Open: https://railway.app" -ForegroundColor White
Write-Host ""
Write-Host "2. Find project: stunning-manifestation" -ForegroundColor White
Write-Host ""
Write-Host "3. Go to: Settings (scroll down)" -ForegroundColor White
Write-Host ""
Write-Host "4. Click: Delete Project" -ForegroundColor Red
Write-Host ""
Write-Host "5. Confirm deletion" -ForegroundColor White
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  VERIFICATION AFTER DELETION" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "After deleting, verify everything still works:" -ForegroundColor Yellow
Write-Host ""
Write-Host "Run: .\CHECK-RAILWAY-STATUS.ps1" -ForegroundColor White
Write-Host ""
Write-Host "Expected:" -ForegroundColor Yellow
Write-Host "  - Only telegram-scheduler should appear" -ForegroundColor Green
Write-Host "  - Status: RUNNING" -ForegroundColor Green
Write-Host "  - No stunning-manifestation in the list" -ForegroundColor Green
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Summary:" -ForegroundColor Yellow
Write-Host "  - Railway CLI: Can only link/unlink projects" -ForegroundColor Gray
Write-Host "  - Railway Dashboard: Only way to delete projects" -ForegroundColor Gray
Write-Host "  - Safe to delete: Yes (project is not working)" -ForegroundColor Green
Write-Host ""

Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

