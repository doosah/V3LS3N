@echo off
chcp 65001 >nul
echo ========================================
echo Быстрая настройка Railway
echo ========================================
echo.
echo Шаг 1: Проверка Railway CLI
railway --version
if errorlevel 1 (
    echo ❌ Railway CLI не найден!
    echo Установите: npm install -g @railway/cli
    pause
    exit
)
echo ✓ Railway CLI найден
echo.
echo Шаг 2: Проверка авторизации
railway whoami
if errorlevel 1 (
    echo ⚠️ Не авторизован. Войдите:
    railway login
)
echo.
echo Шаг 3: Установка команды запуска
railway variables set RAILWAY_START_COMMAND="cd server && node index.js"
echo.
echo ✅ Готово!
echo Railway перезапустит сервис автоматически
echo.
pause

