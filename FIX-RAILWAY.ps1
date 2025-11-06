# Fix Railway Configuration
# This script fixes Railway configuration conflicts

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  RAILWAY CONFIGURATION FIX" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Push-Location $scriptPath

# Fix 1: Ensure railway.toml matches railway.json
if (Test-Path "railway.toml") {
    Write-Host "[1/3] Fixing railway.toml..." -ForegroundColor Yellow
    $tomlContent = @"
[build]
builder = "nixpacks"

[deploy]
startCommand = "node server.js"
healthcheckPath = "/health"
healthcheckTimeout = 100
"@
    Set-Content "railway.toml" -Value $tomlContent -Encoding UTF8
    Write-Host "  OK: railway.toml updated" -ForegroundColor Green
} else {
    Write-Host "[1/3] Creating railway.toml..." -ForegroundColor Yellow
    $tomlContent = @"
[build]
builder = "nixpacks"

[deploy]
startCommand = "node server.js"
healthcheckPath = "/health"
healthcheckTimeout = 100
"@
    Set-Content "railway.toml" -Value $tomlContent -Encoding UTF8
    Write-Host "  OK: railway.toml created" -ForegroundColor Green
}
Write-Host ""

# Fix 2: Ensure package.json has correct Node version
Write-Host "[2/3] Checking package.json..." -ForegroundColor Yellow
if (Test-Path "package.json") {
    $packageJson = Get-Content "package.json" -Raw | ConvertFrom-Json
    
    # Ensure Node.js 18+ is specified
    if (-not $packageJson.engines -or -not $packageJson.engines.node -or $packageJson.engines.node -notmatch '18') {
        Write-Host "  WARNING: Node.js version may be incorrect" -ForegroundColor Yellow
        Write-Host "  Current: $($packageJson.engines.node)" -ForegroundColor Gray
        Write-Host "  Required: >=18.0.0 (for fetch support)" -ForegroundColor Gray
    } else {
        Write-Host "  OK: Node.js version correct" -ForegroundColor Green
    }
    
    # Check if fetch is polyfill needed
    if ($packageJson.dependencies -and $packageJson.dependencies.'node-fetch') {
        Write-Host "  INFO: node-fetch found (may not be needed with Node 18+)" -ForegroundColor Cyan
    }
} else {
    Write-Host "  ERROR: package.json not found" -ForegroundColor Red
}
Write-Host ""

# Fix 3: Verify server.js can run
Write-Host "[3/3] Checking server.js..." -ForegroundColor Yellow
if (Test-Path "server.js") {
    $serverJs = Get-Content "server.js" -Raw
    
    # Check for fetch usage
    if ($serverJs -match 'fetch\(') {
        Write-Host "  INFO: Uses fetch() - requires Node.js 18+" -ForegroundColor Cyan
        Write-Host "  Recommendation: Ensure Railway uses Node.js 18+" -ForegroundColor Yellow
    }
    
    # Check for required imports
    $requiredImports = @('node-cron', 'dotenv', '@supabase/supabase-js', 'http')
    $missingImports = @()
    
    foreach ($imp in $requiredImports) {
        if ($imp -eq 'http') {
            if ($serverJs -notmatch "import.*http|require.*http") {
                $missingImports += $imp
            }
        } else {
            if ($serverJs -notmatch "import.*$imp|require.*$imp") {
                $missingImports += $imp
            }
        }
    }
    
    if ($missingImports.Count -eq 0) {
        Write-Host "  OK: All required imports found" -ForegroundColor Green
    } else {
        Write-Host "  WARNING: Missing imports: $($missingImports -join ', ')" -ForegroundColor Yellow
    }
} else {
    Write-Host "  ERROR: server.js not found" -ForegroundColor Red
}
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  RECOMMENDATIONS" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Commit and push these changes:" -ForegroundColor Yellow
Write-Host "   git add railway.toml railway.json package.json server.js" -ForegroundColor White
Write-Host "   git commit -m 'Fix: Railway configuration consistency'" -ForegroundColor White
Write-Host "   git push origin main" -ForegroundColor White
Write-Host ""
Write-Host "2. In Railway Dashboard:" -ForegroundColor Yellow
Write-Host "   - Check Settings > Service Settings" -ForegroundColor White
Write-Host "   - Verify Root Directory is set correctly" -ForegroundColor White
Write-Host "   - Verify Node.js version is 18+" -ForegroundColor White
Write-Host "   - Check Variables > ensure all env vars are set" -ForegroundColor White
Write-Host ""
Write-Host "3. Check Railway logs for build errors:" -ForegroundColor Yellow
Write-Host "   - Look for 'fetch is not defined' errors" -ForegroundColor White
Write-Host "   - Look for 'Cannot find module' errors" -ForegroundColor White
Write-Host "   - Look for Node.js version mismatches" -ForegroundColor White
Write-Host ""

Pop-Location

