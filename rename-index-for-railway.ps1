# Rename index.html to app.html for Railway
# GitHub Pages will still work if we update settings
$OutputEncoding = [System.Text.Encoding]::UTF8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Renaming index.html for Railway" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "This will:" -ForegroundColor Yellow
Write-Host "1. Rename index.html to app.html" -ForegroundColor White
Write-Host "2. Create redirect index.html for GitHub Pages" -ForegroundColor White
Write-Host ""
Write-Host "NOTE: You may need to update GitHub Pages settings" -ForegroundColor Yellow
Write-Host "      to use app.html as the entry point" -ForegroundColor Yellow
Write-Host ""

$confirm = Read-Host "Continue? (Y/N)"
if ($confirm -ne "Y" -and $confirm -ne "y") {
    Write-Host "Cancelled." -ForegroundColor Yellow
    exit
}

Write-Host ""
Write-Host "Backing up index.html..." -ForegroundColor Yellow
Copy-Item "index.html" "index.html.backup"

Write-Host "Renaming index.html to app.html..." -ForegroundColor Yellow
Rename-Item "index.html" "app.html"

Write-Host "Creating redirect index.html..." -ForegroundColor Yellow
@"
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta http-equiv="refresh" content="0; url=app.html">
    <title>Redirecting...</title>
</head>
<body>
    <script>window.location.href = 'app.html';</script>
    <p>Redirecting to <a href="app.html">app.html</a>...</p>
</body>
</html>
"@ | Out-File -FilePath "index.html" -Encoding UTF8

Write-Host ""
Write-Host "Adding to git..." -ForegroundColor Yellow
git add index.html app.html

Write-Host ""
Write-Host "Committing..." -ForegroundColor Yellow
git commit -m "Rename index.html to app.html - Railway will use server.js now"

Write-Host ""
Write-Host "Pushing..." -ForegroundColor Yellow
git push

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "Done!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Railway will now use server.js instead of index.html" -ForegroundColor Cyan
Write-Host ""
Write-Host "Wait 2-3 minutes, then check logs:" -ForegroundColor Yellow
Write-Host "  .\check-railway-logs.ps1" -ForegroundColor Cyan
Write-Host ""

Read-Host "Press Enter to exit"

