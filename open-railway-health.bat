@echo off
chcp 65001 >nul
echo ========================================
echo Открытие Health Check в браузере
echo ========================================
echo.
echo Введи URL твоего Railway сервиса:
echo (Например: https://stunning-manifestation.railway.app)
echo.
set /p RAILWAY_URL="URL: "
echo.
echo Открываю %RAILWAY_URL%/health ...
start "" "%RAILWAY_URL%/health"
echo.
echo Открываю %RAILWAY_URL%/test ...
start "" "%RAILWAY_URL%/test"
echo.
echo ========================================
pause

