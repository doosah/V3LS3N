# PowerShell script for deploying V3LS3N to GitHub Pages
$ErrorActionPreference = "Stop"

# Change to project directory (use script location)
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Push-Location $scriptPath

# Verify we're in the right directory
if (-not (Test-Path "index.html")) {
    Write-Host "ERROR: index.html not found. Are you in the correct directory?" -ForegroundColor Red
    Pop-Location
    exit 1
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  DEPLOY TO GITHUB PAGES" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

try {
    # Step 1: Check status and commit local changes first
    Write-Host "[1/6] Checking repository status..." -ForegroundColor Yellow
    $status = git status --short
    if ([string]::IsNullOrWhiteSpace($status)) {
        Write-Host "INFO: No local changes to commit" -ForegroundColor Cyan
        Write-Host ""
    } else {
        Write-Host "Found local changes:" -ForegroundColor Gray
        Write-Host $status -ForegroundColor Gray
        Write-Host ""
        
        Write-Host "[2/6] Adding local changes..." -ForegroundColor Yellow
        git add .
        if ($LASTEXITCODE -ne 0) {
            Write-Host "ERROR: Failed to add files" -ForegroundColor Red
            Pop-Location
            exit 1
        }
        Write-Host "OK: Files added" -ForegroundColor Green
        Write-Host ""
        
        Write-Host "[3/6] Creating commit for local changes..." -ForegroundColor Yellow
        $commitMessage = "Fix: Critical fixes for GitHub Pages`n`n- Removed process.env from telegram-config.js`n- Fixed addEventListener in app.js`n- Fixed template strings in components.js`n- Added check scripts"
        
        git commit -m $commitMessage
        if ($LASTEXITCODE -ne 0) {
            Write-Host "WARNING: Commit not created (maybe no changes)" -ForegroundColor Yellow
        } else {
            Write-Host "OK: Commit created" -ForegroundColor Green
        }
        Write-Host ""
    }

    # Step 2: Get latest changes from GitHub
    Write-Host "[4/6] Getting latest changes from GitHub..." -ForegroundColor Yellow
    git fetch origin
    if ($LASTEXITCODE -ne 0) {
        Write-Host "WARNING: git fetch completed with error" -ForegroundColor Yellow
    }
    
    Write-Host "Trying pull with rebase..." -ForegroundColor Gray
    git pull origin main --rebase 2>&1 | Out-Null
    if ($LASTEXITCODE -ne 0) {
        Write-Host "WARNING: Conflicts during rebase. Trying merge..." -ForegroundColor Yellow
        git rebase --abort 2>&1 | Out-Null
        git pull origin main --no-rebase 2>&1 | Out-Null
        if ($LASTEXITCODE -ne 0) {
            Write-Host "ERROR: Could not get changes" -ForegroundColor Red
            Write-Host "Try manually: git pull origin main" -ForegroundColor Yellow
            Pop-Location
            exit 1
        }
    }
    Write-Host "OK: Changes received" -ForegroundColor Green
    Write-Host ""

    # Step 3: Push to GitHub
    Write-Host "[5/6] Pushing to GitHub..." -ForegroundColor Yellow
    git push origin main
    if ($LASTEXITCODE -ne 0) {
        Write-Host "WARNING: Push rejected. Trying again with pull..." -ForegroundColor Yellow
        git pull origin main --rebase
        git push origin main
        if ($LASTEXITCODE -ne 0) {
            Write-Host "ERROR: Failed to push to GitHub" -ForegroundColor Red
            Write-Host "Try manually:" -ForegroundColor Yellow
            Write-Host "  git pull origin main" -ForegroundColor Yellow
            Write-Host "  git push origin main" -ForegroundColor Yellow
            Pop-Location
            exit 1
        }
    }
    Write-Host "OK: Changes pushed to GitHub" -ForegroundColor Green
    Write-Host ""

    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "  DONE!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "1. Open: https://github.com/doosah/V3LS3N" -ForegroundColor White
    Write-Host "2. GitHub Pages deploys automatically via Actions" -ForegroundColor White
    Write-Host "3. Check in 1-2 minutes: https://doosah.github.io/V3LS3N/" -ForegroundColor White
    Write-Host ""
    Write-Host "Check browser console (F12):" -ForegroundColor Yellow
    Write-Host "  - No 'process is not defined' errors" -ForegroundColor White
    Write-Host "  - No 'selectReport is not defined' errors" -ForegroundColor White
    Write-Host "  - Should see 'All functions loaded successfully' message" -ForegroundColor White
    Write-Host ""

} catch {
    Write-Host "CRITICAL ERROR: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host $_.ScriptStackTrace -ForegroundColor Red
    Pop-Location
    exit 1
} finally {
    Pop-Location
}

Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
