@echo off
echo ========================================
echo   ЗАПУСК ЛОКАЛЬНОГО СЕРВЕРА
echo ========================================
echo.

REM Проверяем наличие Python
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ОШИБКА: Python не найден!
    echo.
    echo Решения:
    echo 1. Установите Python с https://www.python.org/
    echo 2. Или используйте встроенный сервер Node.js:
    echo    npx http-server -p 8080
    echo 3. Или используйте Live Server в VS Code
    echo.
    pause
    exit /b 1
)

echo Найден Python
echo.
echo Запуск сервера на http://localhost:8080
echo.
echo Для остановки нажмите Ctrl+C
echo.
echo Откройте в браузере:
echo   http://localhost:8080/index.html
echo.

python -m http.server 8080

pause

