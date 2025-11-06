# PowerShell script to create a stable version tag
$ErrorActionPreference = "Stop"

$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Push-Location $scriptPath

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  CREATE STABLE VERSION TAG" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verify we're in the right directory
if (-not (Test-Path "index.html")) {
    Write-Host "ERROR: index.html not found. Are you in the correct directory?" -ForegroundColor Red
    Pop-Location
    exit 1
}

try {
    # Get current commit hash
    $currentCommit = git rev-parse --short HEAD
    Write-Host "Current commit: $currentCommit" -ForegroundColor Gray
    Write-Host ""
    
    # Create tag name with date and time
    $date = Get-Date -Format "yyyy-MM-dd"
    $time = Get-Date -Format "HHmm"
    
    # Check if tag already exists
    $existingTags = git tag -l "stable-$date*"
    if ($existingTags.Count -gt 0) {
        Write-Host "Found existing tags for today:" -ForegroundColor Yellow
        $existingTags | ForEach-Object { Write-Host "  - $_" -ForegroundColor Gray }
        Write-Host ""
        $tagName = "stable-$date-$time"
        Write-Host "Creating new tag: $tagName" -ForegroundColor Yellow
    } else {
        $tagName = "stable-$date"
        Write-Host "Creating tag: $tagName" -ForegroundColor Yellow
    }
    
    Write-Host "This will mark current version as stable backup" -ForegroundColor Gray
    Write-Host ""
    
    # Create annotated tag
    $tagMessage = "Stable version backup - $date`n`nThis version is known to work correctly:`n- All features working`n- No delta calculation on load`n- Proper Supabase sync`n- GitHub Pages deployment working`n- Clean codebase without temporary files`n- All Railway-related files removed`n- Only essential files remaining"
    
    # Check if tag already exists before creating
    $tagExists = git tag -l $tagName
    if ($tagExists) {
        Write-Host "WARNING: Tag $tagName already exists!" -ForegroundColor Yellow
        Write-Host "Options:" -ForegroundColor Yellow
        Write-Host "  1. Delete existing tag and create new one" -ForegroundColor White
        Write-Host "  2. Create tag with different name: stable-$date-$time" -ForegroundColor White
        Write-Host ""
        Write-Host "Enter choice (1 or 2):" -ForegroundColor Yellow
        $choice = Read-Host
        
        if ($choice -eq "1") {
            Write-Host "Deleting existing tag..." -ForegroundColor Yellow
            git tag -d $tagName
            git push origin :refs/tags/$tagName 2>&1 | Out-Null
        } else {
            $tagName = "stable-$date-$time"
            Write-Host "Using new tag name: $tagName" -ForegroundColor Yellow
        }
    }
    
    git tag -a $tagName -m $tagMessage
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: Failed to create tag" -ForegroundColor Red
        Pop-Location
        exit 1
    }
    
    Write-Host "OK: Tag created locally" -ForegroundColor Green
    Write-Host ""
    
    # Push tag to GitHub
    Write-Host "Pushing tag to GitHub..." -ForegroundColor Yellow
    git push origin $tagName
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "WARNING: Failed to push tag. Try manually:" -ForegroundColor Yellow
        Write-Host "  git push origin $tagName" -ForegroundColor White
    } else {
        Write-Host "OK: Tag pushed to GitHub" -ForegroundColor Green
    }
    Write-Host ""
    
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "  DONE!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Stable version tag created: $tagName" -ForegroundColor Green
    Write-Host ""
    Write-Host "To restore this version later:" -ForegroundColor Yellow
    Write-Host "  git checkout $tagName" -ForegroundColor White
    Write-Host ""
    Write-Host "Or view tag on GitHub:" -ForegroundColor Yellow
    Write-Host "  https://github.com/doosah/V3LS3N/releases/tag/$tagName" -ForegroundColor White
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

