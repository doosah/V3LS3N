# PowerShell script to remove remaining temporary files (excluding BACKUP files)
$ErrorActionPreference = "Stop"

$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Push-Location $scriptPath

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  FINAL CLEANUP - TEMPORARY FILES ONLY" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Files that MUST be kept (including BACKUP files)
$keepFiles = @(
    "index.html",
    "package.json",
    "package-lock.json",
    "README.md",
    "DEPLOY.ps1",
    "CREATE-BACKUP-TAG.ps1",      # BACKUP - DO NOT TOUCH
    "RESTORE-FROM-BACKUP.ps1",    # BACKUP - DO NOT TOUCH
    "START-SERVER.ps1",
    "START-SERVER.bat",
    "CHECK.ps1",
    ".gitignore"
)

Write-Host "CRITICAL FILES (including BACKUP files):" -ForegroundColor Green
$keepFiles | ForEach-Object { Write-Host "  KEEP: $_" -ForegroundColor White }
Write-Host ""

# Remaining temporary files that can be removed
$tempFilesToRemove = @(
    "create-repo-now.ps1",
    "create-separate-repo.ps1",
    "DISCONNECT-VIA-CLI.ps1",
    "hide-index-html.ps1",
    "test-telegram.ps1",
    "final-test.html",
    "CLEANUP-PROJECT.ps1"  # Optional: can be removed after cleanup is done
)

# Check which files exist
$filesToRemove = @()
foreach ($file in $tempFilesToRemove) {
    if (Test-Path $file) {
        $filesToRemove += Get-Item $file
    }
}

if ($filesToRemove.Count -gt 0) {
    Write-Host "TEMPORARY FILES TO REMOVE:" -ForegroundColor Yellow
    $filesToRemove | ForEach-Object { Write-Host "  - $($_.Name)" -ForegroundColor Gray }
    Write-Host ""
    Write-Host "Total files to remove: $($filesToRemove.Count)" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "BACKUP files will NOT be touched:" -ForegroundColor Green
    Write-Host "  KEEP: CREATE-BACKUP-TAG.ps1" -ForegroundColor White
    Write-Host "  KEEP: RESTORE-FROM-BACKUP.ps1" -ForegroundColor White
    Write-Host ""
    Write-Host "Continue with cleanup? (yes/no):" -ForegroundColor Yellow
    $confirm = Read-Host
    
    if ($confirm -eq "yes") {
        Write-Host ""
        Write-Host "Removing temporary files..." -ForegroundColor Yellow
        
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
        
        Write-Host ""
        Write-Host "========================================" -ForegroundColor Cyan
        Write-Host "  FINAL CLEANUP COMPLETE" -ForegroundColor Green
        Write-Host "========================================" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "Removed $removed temporary files" -ForegroundColor Green
        Write-Host ""
        Write-Host "BACKUP files preserved:" -ForegroundColor Cyan
        Write-Host "  KEEP: CREATE-BACKUP-TAG.ps1" -ForegroundColor White
        Write-Host "  KEEP: RESTORE-FROM-BACKUP.ps1" -ForegroundColor White
    } else {
        Write-Host "Cleanup cancelled." -ForegroundColor Gray
    }
} else {
    Write-Host "No temporary files found to remove." -ForegroundColor Green
}

Pop-Location

Write-Host ""
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

