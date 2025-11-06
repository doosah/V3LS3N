# PowerShell script for project verification
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
Write-Host "  PROJECT CHECK" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$errors = @()
$warnings = @()

# Check 1: Main files
Write-Host "[1/6] Checking main files..." -ForegroundColor Yellow
$filesToCheck = @(
    "index.html",
    "src\js\app.js",
    "src\js\telegram-config.js",
    "src\js\components.js"
)

foreach ($file in $filesToCheck) {
    if (Test-Path $file) {
        Write-Host "  OK: $file" -ForegroundColor Green
    } else {
        Write-Host "  ERROR: $file not found" -ForegroundColor Red
        $errors += "File not found: $file"
    }
}
Write-Host ""

# Check 2: telegram-config.js - no process.env
Write-Host "[2/6] Checking telegram-config.js..." -ForegroundColor Yellow
$telegramConfigPath = "src\js\telegram-config.js"
if (Test-Path $telegramConfigPath) {
    $content = Get-Content $telegramConfigPath -Raw
    if ($content -match "process\.env\.TELEGRAM_CHAT_ID") {
        Write-Host "  ERROR: Found process.env in telegram-config.js" -ForegroundColor Red
        $errors += "process.env is used in telegram-config.js"
    } else {
        Write-Host "  OK: process.env not found (correct)" -ForegroundColor Green
    }
    
    if ($content -match "CHAT_ID:\s*['\`"]-1003107822060['\`"]") {
        Write-Host "  OK: CHAT_ID is set directly" -ForegroundColor Green
    } else {
        Write-Host "  WARNING: CHAT_ID may not be set" -ForegroundColor Yellow
        $warnings += "CHAT_ID in telegram-config.js may not be set"
    }
} else {
    Write-Host "  ERROR: telegram-config.js not found" -ForegroundColor Red
    $errors += "telegram-config.js not found"
}
Write-Host ""

# Check 3: app.js - uses document.addEventListener
Write-Host "[3/6] Checking app.js..." -ForegroundColor Yellow
$appJsPath = "src\js\app.js"
if (Test-Path $appJsPath) {
    $content = Get-Content $appJsPath -Raw
    
    if ($content -match "window\.addEventListener\s*\(\s*['\`"]DOMContentLoaded['\`"]") {
        Write-Host "  WARNING: Found window.addEventListener for DOMContentLoaded" -ForegroundColor Yellow
        $warnings += "Using window.addEventListener instead of document.addEventListener"
    } elseif ($content -match "document\.addEventListener\s*\(\s*['\`"]DOMContentLoaded['\`"]") {
        Write-Host "  OK: Using document.addEventListener" -ForegroundColor Green
    } else {
        Write-Host "  WARNING: DOMContentLoaded not found in app.js" -ForegroundColor Yellow
        $warnings += "DOMContentLoaded not found in app.js"
    }
    
    if ($content -match "window\.selectReport\s*=\s*selectReport") {
        Write-Host "  OK: selectReport is exported to window" -ForegroundColor Green
    } else {
        Write-Host "  ERROR: selectReport is not exported to window" -ForegroundColor Red
        $errors += "selectReport is not exported to window"
    }
    
    if ($content -match "window\.backToMain\s*=\s*backToMain") {
        Write-Host "  OK: backToMain is exported to window" -ForegroundColor Green
    } else {
        Write-Host "  ERROR: backToMain is not exported to window" -ForegroundColor Red
        $errors += "backToMain is not exported to window"
    }
} else {
    Write-Host "  ERROR: app.js not found" -ForegroundColor Red
    $errors += "app.js not found"
}
Write-Host ""

# Check 4: components.js - template strings
Write-Host "[4/6] Checking components.js..." -ForegroundColor Yellow
$componentsPath = "src\js\components.js"
if (Test-Path $componentsPath) {
    $content = Get-Content $componentsPath -Raw
    if ($content -match '\\`') {
        Write-Host "  WARNING: Found escaped backticks" -ForegroundColor Yellow
        $warnings += "components.js may have escaped quotes"
    } else {
        Write-Host "  OK: Template strings look correct" -ForegroundColor Green
    }
} else {
    Write-Host "  WARNING: components.js not found" -ForegroundColor Yellow
    $warnings += "components.js not found"
}
Write-Host ""

# Check 5: Git status
Write-Host "[5/6] Checking Git status..." -ForegroundColor Yellow
try {
    $gitStatus = git status --short 2>&1
    if ([string]::IsNullOrWhiteSpace($gitStatus)) {
        Write-Host "  OK: Working directory is clean" -ForegroundColor Green
    } else {
        Write-Host "  INFO: Uncommitted changes found:" -ForegroundColor Cyan
        Write-Host $gitStatus -ForegroundColor Gray
    }
} catch {
    Write-Host "  WARNING: Could not check Git status" -ForegroundColor Yellow
    $warnings += "Could not check Git status"
}
Write-Host ""

# Check 6: GitHub workflow
Write-Host "[6/6] Checking GitHub workflow..." -ForegroundColor Yellow
$workflowPath = ".github\workflows\deploy.yml"
if (Test-Path $workflowPath) {
    Write-Host "  OK: GitHub Actions workflow found" -ForegroundColor Green
} else {
    Write-Host "  WARNING: GitHub Actions workflow not found" -ForegroundColor Yellow
    $warnings += "GitHub Actions workflow not found"
}
Write-Host ""

# Final report
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  CHECK RESULTS" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

if ($errors.Count -eq 0 -and $warnings.Count -eq 0) {
    Write-Host "SUCCESS: All checks passed!" -ForegroundColor Green
    Write-Host "Project is ready for deployment." -ForegroundColor Green
    Write-Host ""
    Write-Host "Run DEPLOY.ps1 to deploy to GitHub:" -ForegroundColor Cyan
    Write-Host '  .\DEPLOY.ps1' -ForegroundColor White
    Pop-Location
    exit 0
} else {
    if ($errors.Count -gt 0) {
        Write-Host "ERRORS found ($($errors.Count)):" -ForegroundColor Red
        foreach ($error in $errors) {
            Write-Host "  - $error" -ForegroundColor Red
        }
        Write-Host ""
    }
    
    if ($warnings.Count -gt 0) {
        Write-Host "WARNINGS found ($($warnings.Count)):" -ForegroundColor Yellow
        foreach ($warning in $warnings) {
            Write-Host "  - $warning" -ForegroundColor Yellow
        }
        Write-Host ""
    }
    
    if ($errors.Count -gt 0) {
        Write-Host "ERROR: Project is not ready for deployment. Fix errors first." -ForegroundColor Red
        Pop-Location
        exit 1
    } else {
        Write-Host "WARNING: Project is ready for deployment, but there are warnings." -ForegroundColor Yellow
        Write-Host ""
        Write-Host "Run DEPLOY.ps1 to deploy to GitHub:" -ForegroundColor Cyan
        Write-Host '  .\DEPLOY.ps1' -ForegroundColor White
        Pop-Location
        exit 0
    }
}
