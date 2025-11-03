@echo off
chcp 65001 >nul
echo ========================================
echo Проверка статуса Railway
echo ========================================
echo.
echo 1. Проверка через браузер:
echo    Открой: https://your-service.railway.app/health
echo.
echo 2. Проверка через Railway CLI:
railway logs --tail 20
echo.
echo ========================================
pause

