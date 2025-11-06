# Complete Railway fix and deployment script
$ErrorActionPreference = "Stop"

$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Push-Location $scriptPath

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  COMPLETE RAILWAY FIX & DEPLOY" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$allOk = $true

# Step 1: Check configuration files
Write-Host "[1/4] Checking configuration files..." -ForegroundColor Yellow

$configFiles = @("railway.json", "railway.toml", "Procfile", "nixpacks.toml", "package.json", "server.js")
foreach ($file in $configFiles) {
    if (Test-Path $file) {
        Write-Host "  OK: $file" -ForegroundColor Green
    } else {
        Write-Host "  ERROR: $file not found" -ForegroundColor Red
        $allOk = $false
    }
}

if (-not $allOk) {
    Write-Host "ERROR: Some configuration files are missing!" -ForegroundColor Red
    Pop-Location
    exit 1
}

Write-Host ""

# Step 2: Pull latest changes
Write-Host "[2/4] Getting latest changes from GitHub..." -ForegroundColor Yellow

$oldErrorAction = $ErrorActionPreference
$ErrorActionPreference = 'Continue'

git fetch origin 2>&1 | Out-Null
$pullOutput = git pull origin main --no-rebase 2>&1 | Out-String
$pullExitCode = $LASTEXITCODE

$ErrorActionPreference = $oldErrorAction

if ($pullExitCode -ne 0) {
    if ($pullOutput -match "already up to date" -or $pullOutput -match "Already up to date") {
        Write-Host "  OK: Already up to date" -ForegroundColor Green
    } else {
        Write-Host "  WARNING: Pull had issues" -ForegroundColor Yellow
        Write-Host "  Output: $pullOutput" -ForegroundColor Gray
    }
} else {
    Write-Host "  OK: Changes received" -ForegroundColor Green
}

Write-Host ""

# Step 3: Add and commit
Write-Host "[3/4] Adding Railway configuration files..." -ForegroundColor Yellow

$filesToAdd = @(
    "railway.json",
    "railway.toml", 
    "Procfile",
    "nixpacks.toml",
    "package.json",
    "server.js",
    "FIX-RAILWAY-BUILD.ps1",
    "CHECK-RAILWAY.ps1",
    "CHECK-RAILWAY-PROJECTS.ps1",
    "PUSH-RAILWAY-FIX.ps1"
)

git add $filesToAdd 2>&1 | Out-Null
Write-Host "  OK: Files added" -ForegroundColor Green
Write-Host ""

Write-Host "Creating commit..." -ForegroundColor Yellow
git commit -m "Fix: Railway configuration consistency for stunning-manifestation" 2>&1 | Out-Null

if ($LASTEXITCODE -ne 0) {
    Write-Host "  INFO: No changes to commit" -ForegroundColor Cyan
} else {
    Write-Host "  OK: Commit created" -ForegroundColor Green
}
Write-Host ""

# Step 4: Push
Write-Host "[4/4] Pushing to GitHub..." -ForegroundColor Yellow

$oldErrorAction = $ErrorActionPreference
$ErrorActionPreference = 'Continue'

git push origin main 2>&1 | Out-Null
$pushExitCode = $LASTEXITCODE

$ErrorActionPreference = $oldErrorAction

if ($pushExitCode -ne 0) {
    Write-Host "  WARNING: Push failed, trying pull again..." -ForegroundColor Yellow
    
    $ErrorActionPreference = 'Continue'
    git pull origin main --no-rebase 2>&1 | Out-Null
    git push origin main 2>&1 | Out-Null
    $retryExitCode = $LASTEXITCODE
    $ErrorActionPreference = $oldErrorAction
    
    if ($retryExitCode -ne 0) {
        Write-Host "  ERROR: Could not push" -ForegroundColor Red
        Write-Host "  Try manually: git pull origin main && git push origin main" -ForegroundColor Yellow
        Pop-Location
        exit 1
    }
}

Write-Host "  OK: Changes pushed to GitHub" -ForegroundColor Green
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  DONE!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Railway will automatically rebuild in 1-2 minutes" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Wait 1-2 minutes for Railway to rebuild" -ForegroundColor White
Write-Host "2. Check Railway Dashboard for stunning-manifestation:" -ForegroundColor White
Write-Host "   https://railway.app" -ForegroundColor Gray
Write-Host "3. Go to Deployments > View logs" -ForegroundColor White
Write-Host "4. Check if service is running:" -ForegroundColor White
Write-Host "   .\CHECK-RAILWAY-PROJECTS.ps1" -ForegroundColor Gray
Write-Host ""

Pop-Location

Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

