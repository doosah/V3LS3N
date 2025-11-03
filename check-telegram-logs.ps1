# Check Railway logs for Telegram errors
$OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host "Checking Railway logs for errors..." -ForegroundColor Yellow
Write-Host ""

# Check if linked to Railway project
railway logs --tail 50 2>&1 | Select-String -Pattern "изображение|image|puppeteer|error|Error|ERROR" -Context 2,2

Write-Host ""
Write-Host "If you see errors about puppeteer or image generation," -ForegroundColor Yellow
Write-Host "Railway may need additional setup for Puppeteer." -ForegroundColor Yellow
Write-Host ""

Read-Host "Press Enter to exit"

