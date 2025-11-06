# PowerShell script to check Railway configuration and status
$ErrorActionPreference = "Stop"

$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Push-Location $scriptPath

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  RAILWAY CONFIGURATION CHECK" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$allChecksOk = $true

# Check 1: Railway configuration files
Write-Host "[1/6] Checking Railway configuration files..." -ForegroundColor Yellow

if (Test-Path "railway.json") {
    Write-Host "  OK: railway.json found" -ForegroundColor Green
    $railwayJson = Get-Content "railway.json" -Raw | ConvertFrom-Json
    Write-Host "    Start Command: $($railwayJson.deploy.startCommand)" -ForegroundColor Gray
    if ($railwayJson.deploy.startCommand -ne "node server.js") {
        Write-Host "    WARNING: Start command should be 'node server.js'" -ForegroundColor Yellow
        $allChecksOk = $false
    }
} else {
    Write-Host "  ERROR: railway.json not found" -ForegroundColor Red
    $allChecksOk = $false
}

if (Test-Path "railway.toml") {
    Write-Host "  OK: railway.toml found" -ForegroundColor Green
    $railwayToml = Get-Content "railway.toml" -Raw
    if ($railwayToml -match 'startCommand\s*=\s*"([^"]+)"') {
        $startCmd = $Matches[1]
        Write-Host "    Start Command: $startCmd" -ForegroundColor Gray
        if ($startCmd -ne "node server.js") {
            Write-Host "    WARNING: Start command should be 'node server.js'" -ForegroundColor Yellow
            $allChecksOk = $false
        }
    }
} else {
    Write-Host "  WARNING: railway.toml not found" -ForegroundColor Yellow
}

if (Test-Path "nixpacks.toml") {
    Write-Host "  OK: nixpacks.toml found" -ForegroundColor Green
    $nixpacks = Get-Content "nixpacks.toml" -Raw
    if ($nixpacks -match 'nodejs_18') {
        Write-Host "    OK: Node.js 18 specified" -ForegroundColor Green
    } else {
        Write-Host "    WARNING: Node.js version may be incorrect" -ForegroundColor Yellow
    }
}

Write-Host ""

# Check 2: package.json
Write-Host "[2/6] Checking package.json..." -ForegroundColor Yellow

if (Test-Path "package.json") {
    $packageJson = Get-Content "package.json" -Raw | ConvertFrom-Json
    Write-Host "  OK: package.json found" -ForegroundColor Green
    
    # Check Node version
    if ($packageJson.engines -and $packageJson.engines.node) {
        Write-Host "    Node.js version: $($packageJson.engines.node)" -ForegroundColor Gray
        if ($packageJson.engines.node -match '18|20|22') {
            Write-Host "    OK: Node.js version supports fetch()" -ForegroundColor Green
        } else {
            Write-Host "    WARNING: Node.js version may not support fetch() (needs 18+)" -ForegroundColor Yellow
            $allChecksOk = $false
        }
    } else {
        Write-Host "    WARNING: Node.js version not specified" -ForegroundColor Yellow
    }
    
    # Check dependencies
    $requiredDeps = @{
        '@supabase/supabase-js' = 'Required for Supabase'
        'dotenv' = 'Required for environment variables'
        'node-cron' = 'Required for scheduling'
    }
    
    Write-Host "    Dependencies:" -ForegroundColor Gray
    foreach ($dep in $requiredDeps.Keys) {
        if ($packageJson.dependencies.$dep) {
            Write-Host "      OK: $dep = $($packageJson.dependencies.$dep)" -ForegroundColor Green
        } else {
            Write-Host "      ERROR: $dep missing - $($requiredDeps[$dep])" -ForegroundColor Red
            $allChecksOk = $false
        }
    }
    
    # Check start script
    if ($packageJson.scripts.start -eq "node server.js") {
        Write-Host "    OK: Start script is correct" -ForegroundColor Green
    } else {
        Write-Host "    WARNING: Start script may be incorrect: $($packageJson.scripts.start)" -ForegroundColor Yellow
    }
} else {
    Write-Host "  ERROR: package.json not found" -ForegroundColor Red
    $allChecksOk = $false
}

Write-Host ""

# Check 3: server.js
Write-Host "[3/6] Checking server.js..." -ForegroundColor Yellow

if (Test-Path "server.js") {
    Write-Host "  OK: server.js found" -ForegroundColor Green
    
    $serverJs = Get-Content "server.js" -Raw
    
    # Check for fetch usage
    if ($serverJs -match 'fetch\(') {
        Write-Host "    INFO: Uses fetch() - requires Node.js 18+" -ForegroundColor Cyan
    }
    
    # Check imports
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
        Write-Host "    OK: All required imports found" -ForegroundColor Green
    } else {
        Write-Host "    ERROR: Missing imports: $($missingImports -join ', ')" -ForegroundColor Red
        $allChecksOk = $false
    }
    
    # Check for HTTP server
    if ($serverJs -match 'http\.createServer|server\.listen') {
        Write-Host "    OK: HTTP server configured" -ForegroundColor Green
    } else {
        Write-Host "    WARNING: HTTP server may not be configured" -ForegroundColor Yellow
    }
    
    # Check for health endpoint
    if ($serverJs -match '/health') {
        Write-Host "    OK: Health endpoint found" -ForegroundColor Green
    } else {
        Write-Host "    WARNING: Health endpoint may be missing" -ForegroundColor Yellow
    }
} else {
    Write-Host "  ERROR: server.js not found" -ForegroundColor Red
    $allChecksOk = $false
}

Write-Host ""

# Check 4: Try to check Railway CLI
Write-Host "[4/6] Checking Railway CLI..." -ForegroundColor Yellow

if (Get-Command railway -ErrorAction SilentlyContinue) {
    Write-Host "  OK: Railway CLI found" -ForegroundColor Green
    Write-Host "    Checking status..." -ForegroundColor Gray
    
    try {
        $railwayStatus = railway status 2>&1 | Out-String
        Write-Host "    Railway Status:" -ForegroundColor Gray
        Write-Host $railwayStatus -ForegroundColor Gray
    } catch {
        Write-Host "    INFO: Could not get Railway status (may need login)" -ForegroundColor Cyan
        Write-Host "    Run: railway login" -ForegroundColor Yellow
    }
} else {
    Write-Host "  INFO: Railway CLI not installed" -ForegroundColor Cyan
    Write-Host "    Install: npm install -g @railway/cli" -ForegroundColor Yellow
    Write-Host "    Then: railway login" -ForegroundColor Yellow
}

Write-Host ""

# Check 5: Try to check Railway service via HTTP
Write-Host "[5/6] Checking Railway service status..." -ForegroundColor Yellow

$railwayUrls = @(
    "https://telegram-scheduler-production.up.railway.app",
    "https://stunning-manifestation-production.up.railway.app"
)

$serviceFound = $false
foreach ($url in $railwayUrls) {
    Write-Host "    Trying: $url/health" -ForegroundColor Gray
    try {
        $response = Invoke-WebRequest -Uri "$url/health" -Method GET -TimeoutSec 5 -ErrorAction Stop
        if ($response.StatusCode -eq 200) {
            Write-Host "    OK: Service is running at $url" -ForegroundColor Green
            Write-Host "      Status: $($response.Content)" -ForegroundColor Gray
            $serviceFound = $true
            break
        }
    } catch {
        Write-Host "    INFO: Service not responding at $url" -ForegroundColor Cyan
    }
}

if (-not $serviceFound) {
    Write-Host "  WARNING: Could not reach Railway service" -ForegroundColor Yellow
    Write-Host "    Possible reasons:" -ForegroundColor Gray
    Write-Host "      - Service is not deployed yet" -ForegroundColor Gray
    Write-Host "      - Service URL is different" -ForegroundColor Gray
    Write-Host "      - Service is down" -ForegroundColor Gray
}

Write-Host ""

# Check 6: Environment variables file check
Write-Host "[6/6] Checking environment variables..." -ForegroundColor Yellow

$envFiles = @(".env", ".env.example", "server\.env")
$envFound = $false

foreach ($envFile in $envFiles) {
    if (Test-Path $envFile) {
        Write-Host "  Found: $envFile" -ForegroundColor Green
        $envContent = Get-Content $envFile -Raw
        
        $requiredVars = @('TELEGRAM_BOT_TOKEN', 'TELEGRAM_CHAT_ID', 'SUPABASE_URL', 'SUPABASE_KEY')
        foreach ($var in $requiredVars) {
            if ($envContent -match "$var\s*=") {
                Write-Host "    OK: $var is set" -ForegroundColor Green
            } else {
                Write-Host "    WARNING: $var not found in $envFile" -ForegroundColor Yellow
            }
        }
        $envFound = $true
        break
    }
}

if (-not $envFound) {
    Write-Host "  INFO: No .env file found (variables should be set in Railway Dashboard)" -ForegroundColor Cyan
    Write-Host "    Required variables:" -ForegroundColor Gray
    Write-Host "      - TELEGRAM_BOT_TOKEN" -ForegroundColor Gray
    Write-Host "      - TELEGRAM_CHAT_ID" -ForegroundColor Gray
    Write-Host "      - SUPABASE_URL" -ForegroundColor Gray
    Write-Host "      - SUPABASE_KEY" -ForegroundColor Gray
}

Write-Host ""

# Final report
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  CHECK RESULTS" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

if ($allChecksOk) {
    Write-Host "SUCCESS: All local checks passed!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "1. Push changes: .\PUSH-RAILWAY-FIX.ps1" -ForegroundColor White
    Write-Host "2. Check Railway Dashboard: https://railway.app" -ForegroundColor White
    Write-Host "3. Verify environment variables are set in Railway" -ForegroundColor White
    Write-Host "4. Check deployment logs for build errors" -ForegroundColor White
} else {
    Write-Host "WARNING: Some checks failed!" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Please fix the errors above before deploying." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "For detailed Railway Dashboard guide, see:" -ForegroundColor Cyan
Write-Host "  RAILWAY-DASHBOARD-GUIDE.md" -ForegroundColor White
Write-Host ""

Pop-Location
