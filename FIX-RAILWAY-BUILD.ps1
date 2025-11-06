# PowerShell script to fix Railway build issues
$ErrorActionPreference = "Stop"

$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Push-Location $scriptPath

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  RAILWAY BUILD FIX" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Fix 1: Ensure all Railway configs are consistent
Write-Host "[1/4] Fixing Railway configurations..." -ForegroundColor Yellow

# Update railway.toml to match railway.json
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

# Verify railway.json
if (Test-Path "railway.json") {
    $railwayJson = Get-Content "railway.json" -Raw | ConvertFrom-Json
    if ($railwayJson.deploy.startCommand -ne "node server.js") {
        Write-Host "  WARNING: railway.json startCommand differs" -ForegroundColor Yellow
    } else {
        Write-Host "  OK: railway.json is correct" -ForegroundColor Green
    }
}

Write-Host ""

# Fix 2: Ensure package.json has correct Node version
Write-Host "[2/4] Checking package.json..." -ForegroundColor Yellow

if (Test-Path "package.json") {
    $packageJson = Get-Content "package.json" -Raw | ConvertFrom-Json
    
    # Ensure Node.js 18+ is specified
    if (-not $packageJson.engines) {
        $packageJson | Add-Member -MemberType NoteProperty -Name "engines" -Value @{} -Force
    }
    if (-not $packageJson.engines.node -or $packageJson.engines.node -notmatch '18') {
        Write-Host "  FIXING: Setting Node.js version to >=18.0.0" -ForegroundColor Yellow
        $packageJson.engines.node = ">=18.0.0"
        $packageJson | ConvertTo-Json -Depth 10 | Set-Content "package.json" -Encoding UTF8
        Write-Host "  OK: package.json updated" -ForegroundColor Green
    } else {
        Write-Host "  OK: Node.js version correct" -ForegroundColor Green
    }
    
    # Check dependencies
    $requiredDeps = @('@supabase/supabase-js', 'dotenv', 'node-cron')
    $missingDeps = @()
    foreach ($dep in $requiredDeps) {
        if (-not $packageJson.dependencies.$dep) {
            $missingDeps += $dep
        }
    }
    
    if ($missingDeps.Count -gt 0) {
        Write-Host "  WARNING: Missing dependencies: $($missingDeps -join ', ')" -ForegroundColor Yellow
    } else {
        Write-Host "  OK: All required dependencies present" -ForegroundColor Green
    }
} else {
    Write-Host "  ERROR: package.json not found" -ForegroundColor Red
}

Write-Host ""

# Fix 3: Verify server.js exists and is correct
Write-Host "[3/4] Checking server.js..." -ForegroundColor Yellow

if (Test-Path "server.js") {
    Write-Host "  OK: server.js exists" -ForegroundColor Green
    
    $serverJs = Get-Content "server.js" -Raw
    
    # Check for fetch usage
    if ($serverJs -match 'fetch\(') {
        Write-Host "  INFO: Uses fetch() - requires Node.js 18+" -ForegroundColor Cyan
    }
    
    # Check imports
    $requiredImports = @('node-cron', 'dotenv', '@supabase/supabase-js', 'http')
    $allImportsFound = $true
    foreach ($imp in $requiredImports) {
        if ($imp -eq 'http') {
            if ($serverJs -notmatch "import.*http|require.*http") {
                Write-Host "  WARNING: Missing import: http" -ForegroundColor Yellow
                $allImportsFound = $false
            }
        } else {
            if ($serverJs -notmatch "import.*$imp|require.*$imp") {
                Write-Host "  WARNING: Missing import: $imp" -ForegroundColor Yellow
                $allImportsFound = $false
            }
        }
    }
    
    if ($allImportsFound) {
        Write-Host "  OK: All required imports found" -ForegroundColor Green
    }
} else {
    Write-Host "  ERROR: server.js not found" -ForegroundColor Red
}

Write-Host ""

# Fix 4: Check nixpacks.toml
Write-Host "[4/4] Checking nixpacks.toml..." -ForegroundColor Yellow

if (Test-Path "nixpacks.toml") {
    $nixpacks = Get-Content "nixpacks.toml" -Raw
    
    if ($nixpacks -match 'nodejs_18') {
        Write-Host "  OK: Node.js 18 specified in nixpacks.toml" -ForegroundColor Green
    } else {
        Write-Host "  WARNING: Node.js version may be incorrect in nixpacks.toml" -ForegroundColor Yellow
    }
    
    if ($nixpacks -match 'node server\.js') {
        Write-Host "  OK: Start command correct in nixpacks.toml" -ForegroundColor Green
    } else {
        Write-Host "  WARNING: Start command may be incorrect" -ForegroundColor Yellow
    }
} else {
    Write-Host "  INFO: nixpacks.toml not found (will use defaults)" -ForegroundColor Cyan
}

Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  NEXT STEPS" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Commit and push changes:" -ForegroundColor Yellow
Write-Host "   git add railway.toml railway.json package.json" -ForegroundColor White
Write-Host "   git commit -m 'Fix: Railway configuration consistency'" -ForegroundColor White
Write-Host "   git push origin main" -ForegroundColor White
Write-Host ""
Write-Host "2. Check Railway Dashboard:" -ForegroundColor Yellow
Write-Host "   - Go to: https://railway.app" -ForegroundColor White
Write-Host "   - Open project 'stunning-manifestation'" -ForegroundColor White
Write-Host "   - Check Deployments > View logs" -ForegroundColor White
Write-Host "   - Look for build errors" -ForegroundColor White
Write-Host ""
Write-Host "3. Verify Railway settings:" -ForegroundColor Yellow
Write-Host "   - Settings > Service Settings" -ForegroundColor White
Write-Host "   - Root Directory: should be empty or '.'" -ForegroundColor White
Write-Host "   - Build Command: npm install" -ForegroundColor White
Write-Host "   - Start Command: node server.js" -ForegroundColor White
Write-Host ""
Write-Host "4. Check Environment Variables:" -ForegroundColor Yellow
Write-Host "   - Settings > Variables" -ForegroundColor White
Write-Host "   - Ensure all required vars are set:" -ForegroundColor White
Write-Host "     * TELEGRAM_BOT_TOKEN" -ForegroundColor Gray
Write-Host "     * TELEGRAM_CHAT_ID" -ForegroundColor Gray
Write-Host "     * SUPABASE_URL" -ForegroundColor Gray
Write-Host "     * SUPABASE_KEY" -ForegroundColor Gray
Write-Host ""

Pop-Location

