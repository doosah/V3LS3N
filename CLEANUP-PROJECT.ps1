# PowerShell script to clean up unnecessary files
$ErrorActionPreference = "Stop"

$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Push-Location $scriptPath

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  PROJECT CLEANUP ANALYSIS" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Analyze and list files to keep/remove
Write-Host "Analyzing project structure..." -ForegroundColor Yellow
Write-Host ""

# Files that MUST be kept for V3LS3N
$keepFiles = @(
    "index.html",
    "package.json",
    "package-lock.json",
    "README.md",
    "DEPLOY.ps1",
    "CREATE-BACKUP-TAG.ps1",
    "RESTORE-FROM-BACKUP.ps1",
    "START-SERVER.ps1",
    "START-SERVER.bat",
    "CHECK.ps1",
    ".github/workflows/deploy.yml"
)

# Directories that MUST be kept
$keepDirs = @(
    "src",
    "img",
    ".github"
)

Write-Host "ESSENTIAL FILES AND DIRECTORIES:" -ForegroundColor Green
$keepFiles | ForEach-Object { Write-Host "  OK: $_" -ForegroundColor White }
$keepDirs | ForEach-Object { Write-Host "  OK: $_/" -ForegroundColor White }
Write-Host ""

# Files that can be removed (Railway-related, temporary, test files)
$filesToRemove = @()

# Get Railway-related files
$railwayFiles = Get-ChildItem -Path . -File -Recurse -ErrorAction SilentlyContinue | Where-Object {
    $name = $_.Name.ToLower()
    $name -match "railway" -or 
    $name -match "server.js" -or
    $name -eq "nixpacks.toml" -or
    $name -eq "railway.json" -or
    $name -eq "railway.toml" -or
    $name -eq "Procfile" -or
    $name -match "fill-reports" -or
    $name -match "migrate-" -or
    $name -match "test-.*\.html" -or
    $name -eq "diagnostic.html" -or
    $name -eq "app.html" -or
    $name -eq "index-original.html" -or
    $name -eq "start-server.js" -or
    ($_.Extension -eq ".txt")
}

$filesToRemove += $railwayFiles

# Get Railway-related PowerShell scripts
$railwayScripts = Get-ChildItem -Path . -Filter "*.ps1" -File | Where-Object {
    $name = $_.Name
    ($name -match "railway" -or 
     $name -match "Railway" -or 
     $name -match "RAILWAY" -or
     ($name -match "FIX" -and $name -ne "CREATE-BACKUP-TAG.ps1") -or
     ($name -match "check" -and $name -ne "CHECK.ps1") -or
     ($name -match "push" -and $name -ne "DEPLOY.ps1") -or
     ($name -match "deploy" -and $name -ne "DEPLOY.ps1") -or
     ($name -match "DELETE" -or $name -match "DIAGNOSE")) -and
    $name -notin $keepFiles
}

$filesToRemove += $railwayScripts

# Get all .bat files except START-SERVER.bat
$batFiles = Get-ChildItem -Path . -Filter "*.bat" -File | Where-Object { $_.Name -ne "START-SERVER.bat" }
$filesToRemove += $batFiles

# List markdown files except README.md
$mdFiles = Get-ChildItem -Path . -Filter "*.md" -File | Where-Object { $_.Name -ne "README.md" }

# Remove duplicates and filter out keep files
$filesToRemove = $filesToRemove | Where-Object {
    $name = $_.Name
    $name -notin $keepFiles
} | Select-Object -Unique

if ($filesToRemove.Count -gt 0 -or $mdFiles.Count -gt 0) {
    Write-Host ""
    Write-Host "Files to remove:" -ForegroundColor Yellow
    $filesToRemove | ForEach-Object { Write-Host "  - $($_.Name)" -ForegroundColor Gray }
    $mdFiles | ForEach-Object { Write-Host "  - $($_.Name)" -ForegroundColor Gray }
    
    Write-Host ""
    Write-Host "Total files to remove: $($filesToRemove.Count + $mdFiles.Count)" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Continue with cleanup? (yes/no):" -ForegroundColor Yellow
    $confirm = Read-Host
    
    if ($confirm -eq "yes") {
        Write-Host ""
        Write-Host "Removing files..." -ForegroundColor Yellow
        
        $removed = 0
        $filesToRemove | ForEach-Object {
            try {
                Remove-Item $_.FullName -Force -ErrorAction Stop
                Write-Host "  OK Removed: $($_.Name)" -ForegroundColor Green
                $removed++
            } catch {
                Write-Host "  FAILED: $($_.Name) - $($_.Exception.Message)" -ForegroundColor Red
            }
        }
        
        $mdFiles | ForEach-Object {
            try {
                Remove-Item $_.FullName -Force -ErrorAction Stop
                Write-Host "  OK Removed: $($_.Name)" -ForegroundColor Green
                $removed++
            } catch {
                Write-Host "  FAILED: $($_.Name) - $($_.Exception.Message)" -ForegroundColor Red
            }
        }
        
        # Remove server directory if exists
        if (Test-Path "server") {
            try {
                Remove-Item "server" -Recurse -Force -ErrorAction Stop
                Write-Host "  OK Removed: server/" -ForegroundColor Green
                $removed++
            } catch {
                Write-Host "  FAILED: server/ - $($_.Exception.Message)" -ForegroundColor Red
            }
        }
        
        Write-Host ""
        Write-Host "========================================" -ForegroundColor Cyan
        Write-Host "  CLEANUP COMPLETE" -ForegroundColor Green
        Write-Host "========================================" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "Removed $removed files/directories" -ForegroundColor Green
        Write-Host ""
        Write-Host "Essential files preserved:" -ForegroundColor Cyan
        $keepFiles | ForEach-Object { Write-Host "  OK: $_" -ForegroundColor White }
    } else {
        Write-Host "Cleanup cancelled." -ForegroundColor Gray
    }
} else {
    Write-Host "No unnecessary files found to remove." -ForegroundColor Green
}

Pop-Location

Write-Host ""
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
