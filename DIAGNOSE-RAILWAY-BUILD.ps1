# PowerShell script to diagnose Railway build errors
$ErrorActionPreference = "Stop"

$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Push-Location $scriptPath

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  RAILWAY BUILD ERROR DIAGNOSTICS" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Analyzing project structure..." -ForegroundColor Yellow
Write-Host ""

# Check 1: Root directory structure
Write-Host "[1/5] Checking root directory structure..." -ForegroundColor Yellow

$rootFiles = @("server.js", "package.json", "railway.json", "railway.toml", "Procfile", "nixpacks.toml")
foreach ($file in $rootFiles) {
    if (Test-Path $file) {
        Write-Host "  OK: $file exists" -ForegroundColor Green
    } else {
        Write-Host "  ERROR: $file NOT FOUND" -ForegroundColor Red
    }
}

Write-Host ""

# Check 2: Check for server directory
Write-Host "[2/5] Checking for server directory..." -ForegroundColor Yellow

if (Test-Path "server") {
    Write-Host "  WARNING: 'server' directory exists!" -ForegroundColor Yellow
    Write-Host "  This might cause confusion in Railway" -ForegroundColor Yellow
    
    $serverFiles = Get-ChildItem -Path "server" -File -Recurse | Select-Object -First 5
    Write-Host "  Files in server directory:" -ForegroundColor Gray
    foreach ($file in $serverFiles) {
        Write-Host "    - $($file.FullName.Replace($scriptPath, '.'))" -ForegroundColor Gray
    }
} else {
    Write-Host "  OK: No 'server' directory (correct)" -ForegroundColor Green
}

Write-Host ""

# Check 3: package.json start script
Write-Host "[3/5] Checking package.json..." -ForegroundColor Yellow

if (Test-Path "package.json") {
    $packageJson = Get-Content "package.json" -Raw | ConvertFrom-Json
    
    Write-Host "  Main: $($packageJson.main)" -ForegroundColor Gray
    Write-Host "  Start script: $($packageJson.scripts.start)" -ForegroundColor Gray
    
    if ($packageJson.scripts.start -eq "node server.js") {
        Write-Host "  OK: Start script is correct" -ForegroundColor Green
    } else {
        Write-Host "  ERROR: Start script should be 'node server.js'" -ForegroundColor Red
    }
} else {
    Write-Host "  ERROR: package.json not found" -ForegroundColor Red
}

Write-Host ""

# Check 4: server.js exists and is valid
Write-Host "[4/5] Checking server.js..." -ForegroundColor Yellow

if (Test-Path "server.js") {
    Write-Host "  OK: server.js exists" -ForegroundColor Green
    
    $serverJs = Get-Content "server.js" -Raw
    
    # Check for required imports
    $requiredImports = @("node-cron", "dotenv", "@supabase/supabase-js", "http")
    $missingImports = @()
    
    foreach ($imp in $requiredImports) {
        if ($imp -eq "http") {
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
        Write-Host "  ERROR: Missing imports: $($missingImports -join ', ')" -ForegroundColor Red
    }
    
    # Check for server.listen
    if ($serverJs -match "server\.listen|listen\(PORT") {
        Write-Host "  OK: Server listen found" -ForegroundColor Green
    } else {
        Write-Host "  ERROR: Server listen not found" -ForegroundColor Red
    }
} else {
    Write-Host "  ERROR: server.js not found" -ForegroundColor Red
}

Write-Host ""

# Check 5: Railway configuration
Write-Host "[5/5] Checking Railway configuration files..." -ForegroundColor Yellow

if (Test-Path "railway.json") {
    $railwayJson = Get-Content "railway.json" -Raw | ConvertFrom-Json
    Write-Host "  railway.json startCommand: $($railwayJson.deploy.startCommand)" -ForegroundColor Gray
    if ($railwayJson.deploy.startCommand -eq "node server.js") {
        Write-Host "  OK: railway.json is correct" -ForegroundColor Green
    } else {
        Write-Host "  ERROR: railway.json startCommand is wrong" -ForegroundColor Red
    }
}

if (Test-Path "railway.toml") {
    $railwayToml = Get-Content "railway.toml" -Raw
    if ($railwayToml -match 'startCommand\s*=\s*"node server.js"') {
        Write-Host "  OK: railway.toml is correct" -ForegroundColor Green
    } else {
        Write-Host "  ERROR: railway.toml startCommand is wrong" -ForegroundColor Red
    }
}

if (Test-Path "nixpacks.toml") {
    $nixpacks = Get-Content "nixpacks.toml" -Raw
    if ($nixpacks -match 'cmd\s*=\s*"node server.js"') {
        Write-Host "  OK: nixpacks.toml is correct" -ForegroundColor Green
    } else {
        Write-Host "  ERROR: nixpacks.toml cmd is wrong" -ForegroundColor Red
    }
}

if (Test-Path "Procfile") {
    $procfile = Get-Content "Procfile" -Raw
    if ($procfile -match "web:\s*node server.js") {
        Write-Host "  OK: Procfile is correct" -ForegroundColor Green
    } else {
        Write-Host "  ERROR: Procfile web command is wrong" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  RAILWAY DASHBOARD CHECKLIST" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Please check these settings in Railway Dashboard:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Project Settings:" -ForegroundColor Cyan
Write-Host "   - Open: https://railway.app" -ForegroundColor White
Write-Host "   - Find project 'stunning-manifestation'" -ForegroundColor White
Write-Host ""
Write-Host "2. Service Settings:" -ForegroundColor Cyan
Write-Host "   - Settings > Service Settings" -ForegroundColor White
Write-Host "   - Root Directory: (MUST BE EMPTY)" -ForegroundColor Yellow
Write-Host "     If it says 'server', change it to empty!" -ForegroundColor Red
Write-Host "   - Build Command: npm install" -ForegroundColor White
Write-Host "   - Start Command: node server.js" -ForegroundColor White
Write-Host ""
Write-Host "3. Source Repository:" -ForegroundColor Cyan
Write-Host "   - Settings > Source" -ForegroundColor White
Write-Host "   - Should be: https://github.com/doosah/V3LS3N" -ForegroundColor White
Write-Host "   - Branch: main" -ForegroundColor White
Write-Host ""
Write-Host "4. Environment Variables:" -ForegroundColor Cyan
Write-Host "   - Settings > Variables" -ForegroundColor White
Write-Host "   - Check these are set:" -ForegroundColor Yellow
Write-Host "     * TELEGRAM_BOT_TOKEN" -ForegroundColor Gray
Write-Host "     * TELEGRAM_CHAT_ID" -ForegroundColor Gray
Write-Host "     * SUPABASE_URL" -ForegroundColor Gray
Write-Host "     * SUPABASE_KEY" -ForegroundColor Gray
Write-Host ""
Write-Host "5. Deployment Logs:" -ForegroundColor Cyan
Write-Host "   - Deployments tab" -ForegroundColor White
Write-Host "   - Click latest deployment" -ForegroundColor White
Write-Host "   - View logs" -ForegroundColor White
Write-Host "   - Look for errors like:" -ForegroundColor Yellow
Write-Host "     * 'Cannot find module'" -ForegroundColor Gray
Write-Host "     * 'EACCES: permission denied'" -ForegroundColor Gray
Write-Host "     * 'Command not found'" -ForegroundColor Gray
Write-Host "     * 'Error: Cannot find module server.js'" -ForegroundColor Gray
Write-Host ""
Write-Host "MOST COMMON ISSUE:" -ForegroundColor Red
Write-Host "Root Directory is set to 'server' instead of empty!" -ForegroundColor Yellow
Write-Host "This causes Railway to look for server.js in the wrong place." -ForegroundColor Yellow
Write-Host ""

Pop-Location

Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

