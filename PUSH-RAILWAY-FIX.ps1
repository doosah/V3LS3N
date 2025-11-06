# PowerShell script to push Railway fixes
$ErrorActionPreference = "Stop"

$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Push-Location $scriptPath

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  PUSH RAILWAY FIXES" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

try {
    # Step 1: Pull latest changes
    Write-Host "[1/3] Getting latest changes from GitHub..." -ForegroundColor Yellow
    
    $oldErrorAction = $ErrorActionPreference
    $ErrorActionPreference = 'Continue'
    
    git fetch origin 2>&1 | Out-Null
    $pullOutput = git pull origin main --no-rebase 2>&1 | Out-String
    $pullExitCode = $LASTEXITCODE
    
    $ErrorActionPreference = $oldErrorAction
    
    if ($pullExitCode -ne 0) {
        Write-Host "  WARNING: Pull had issues" -ForegroundColor Yellow
        Write-Host "  Output: $pullOutput" -ForegroundColor Gray
    } else {
        Write-Host "  OK: Changes received" -ForegroundColor Green
    }
    Write-Host ""

    # Step 2: Add and commit
    Write-Host "[2/3] Adding Railway configuration files..." -ForegroundColor Yellow
    git add railway.toml railway.json package.json FIX-RAILWAY-BUILD.ps1 2>&1 | Out-Null
    Write-Host "  OK: Files added" -ForegroundColor Green
    Write-Host ""

    Write-Host "Creating commit..." -ForegroundColor Yellow
    git commit -m "Fix: Railway configuration consistency" 2>&1 | Out-Null
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "  INFO: No changes to commit" -ForegroundColor Cyan
    } else {
        Write-Host "  OK: Commit created" -ForegroundColor Green
    }
    Write-Host ""

    # Step 3: Push
    Write-Host "[3/3] Pushing to GitHub..." -ForegroundColor Yellow
    
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

} catch {
    Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
    Pop-Location
    exit 1
} finally {
    Pop-Location
}

Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

