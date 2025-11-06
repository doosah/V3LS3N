# PowerShell script to start local HTTP server
$ErrorActionPreference = "Stop"

$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Push-Location $scriptPath

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  STARTING LOCAL SERVER" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check for Python
$pythonCmd = $null
$pythonVersions = @('python3', 'python', 'py')
foreach ($cmd in $pythonVersions) {
    try {
        $version = & $cmd --version 2>&1
        if ($LASTEXITCODE -eq 0) {
            $pythonCmd = $cmd
            Write-Host "Found Python: $version" -ForegroundColor Green
            break
        }
    } catch {
        continue
    }
}

if ($null -eq $pythonCmd) {
    Write-Host "ERROR: Python not found!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Solutions:" -ForegroundColor Yellow
    Write-Host "1. Install Python from https://www.python.org/" -ForegroundColor White
    Write-Host "2. Or use Node.js built-in server:" -ForegroundColor White
    Write-Host "   npx http-server -p 8080" -ForegroundColor Cyan
    Write-Host "3. Or use Live Server in VS Code" -ForegroundColor White
    Write-Host ""
    Pop-Location
    exit 1
}

Write-Host ""
Write-Host "Starting server on http://localhost:8080" -ForegroundColor Yellow
Write-Host ""
Write-Host "Press Ctrl+C to stop" -ForegroundColor Gray
Write-Host ""
Write-Host "Open in browser:" -ForegroundColor Cyan
Write-Host "  http://localhost:8080/index.html" -ForegroundColor White
Write-Host ""

try {
    # Python 3 uses http.server, Python 2 uses SimpleHTTPServer
    $pythonVersion = & $pythonCmd --version 2>&1
    if ($pythonVersion -match "Python 3") {
        & $pythonCmd -m http.server 8080
    } else {
        & $pythonCmd -m SimpleHTTPServer 8080
    }
} catch {
    Write-Host "ERROR starting server: $($_.Exception.Message)" -ForegroundColor Red
    Pop-Location
    exit 1
} finally {
    Pop-Location
}
