# Скрипт для проверки новой функции сводной таблицы по недостачам

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  CHECK SHORTAGE FEATURE" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Проверка файлов
Write-Host "[1/4] Checking files..." -ForegroundColor Yellow

$filesToCheck = @(
    "index.html",
    "src\js\config.js",
    "src\js\app.js",
    "src\js\tables.js"
)

$allExist = $true
foreach ($file in $filesToCheck) {
    if (Test-Path $file) {
        Write-Host "  OK: $file" -ForegroundColor Green
    } else {
        Write-Host "  ERROR: $file not found!" -ForegroundColor Red
        $allExist = $false
    }
}

if (-not $allExist) {
    Write-Host ""
    Write-Host "ERROR: Some files are missing!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "[2/4] Checking SHORTAGE_CATEGORIES export..." -ForegroundColor Yellow
$configContent = Get-Content "src\js\config.js" -Raw
if ($configContent -match "export const SHORTAGE_CATEGORIES") {
    Write-Host "  OK: SHORTAGE_CATEGORIES exported" -ForegroundColor Green
} else {
    Write-Host "  ERROR: SHORTAGE_CATEGORIES not found!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "[3/4] Checking HTML sections..." -ForegroundColor Yellow
$htmlContent = Get-Content "index.html" -Raw
if ($htmlContent -match "shortageSummarySection") {
    Write-Host "  OK: shortageSummarySection found in HTML" -ForegroundColor Green
} else {
    Write-Host "  ERROR: shortageSummarySection not found!" -ForegroundColor Red
    exit 1
}

if ($htmlContent -match "showShortageSummarySection") {
    Write-Host "  OK: showShortageSummarySection button found" -ForegroundColor Green
} else {
    Write-Host "  ERROR: showShortageSummarySection button not found!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "[4/4] Checking functions..." -ForegroundColor Yellow
$appContent = Get-Content "src\js\app.js" -Raw
$functions = @(
    "showShortageSummarySection",
    "showShortageSummaryData",
    "updateShortageSummaryTable",
    "prevShortageSummaryWeek",
    "nextShortageSummaryWeek"
)

$allFound = $true
foreach ($func in $functions) {
    if ($appContent -match "function $func" -or $appContent -match "export function $func") {
        Write-Host "  OK: $func" -ForegroundColor Green
    } else {
        Write-Host "  ERROR: $func not found!" -ForegroundColor Red
        $allFound = $false
    }
}

if (-not $allFound) {
    Write-Host ""
    Write-Host "ERROR: Some functions are missing!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Checking tables.js for generateShortageSummaryTable..." -ForegroundColor Yellow
$tablesContent = Get-Content "src\js\tables.js" -Raw
if ($tablesContent -match "function generateShortageSummaryTable") {
    Write-Host "  OK: generateShortageSummaryTable" -ForegroundColor Green
} else {
    Write-Host "  ERROR: generateShortageSummaryTable not found!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  CHECK COMPLETE!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Start local server:" -ForegroundColor White
Write-Host "   python -m http.server 8080" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Open browser:" -ForegroundColor White
Write-Host "   http://localhost:8080" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Test steps:" -ForegroundColor White
Write-Host "   a) Click 'Еженедельный разбор недостач'" -ForegroundColor Gray
Write-Host "   b) Click 'Сводная таблица'" -ForegroundColor Gray
Write-Host "   c) Убедитесь, что неделя и год заполнены прошлой неделей/текущим годом и нажмите 'Показать сводные данные'" -ForegroundColor Gray
Write-Host "   d) На экране свода проверьте, что сверху отображается выбранная неделя и стрелки ←/→ переключают недели" -ForegroundColor Gray
Write-Host "   e) Внизу таблицы убедитесь, что кнопка '← Назад к выбору отчёта' возвращает на главную" -ForegroundColor Gray
Write-Host ""
Write-Host "4. Check browser console (F12):" -ForegroundColor White
Write-Host "   - No errors about SHORTAGE_CATEGORIES" -ForegroundColor Gray
Write-Host "   - No errors about selectReport" -ForegroundColor Gray
Write-Host ""
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

