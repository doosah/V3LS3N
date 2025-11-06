@echo off
chcp 65001 >nul
echo ========================================
echo   ПРОВЕРКА РАБОТОСПОСОБНОСТИ ПРОЕКТА
echo ========================================
echo.
cd /d "%~dp0"
echo Текущая директория: %CD%
echo.
echo Шаг 1: Проверяю наличие основных файлов...
if exist "index.html" (
    echo [OK] index.html найден
) else (
    echo [ОШИБКА] index.html не найден!
    pause
    exit /b 1
)

if exist "src\js\app.js" (
    echo [OK] app.js найден
) else (
    echo [ОШИБКА] app.js не найден!
    pause
    exit /b 1
)

if exist "src\js\telegram-config.js" (
    echo [OK] telegram-config.js найден
) else (
    echo [ОШИБКА] telegram-config.js не найден!
    pause
    exit /b 1
)

echo.
echo Шаг 2: Проверяю критические исправления...
findstr /C:"process.env.TELEGRAM_CHAT_ID" "src\js\telegram-config.js" >nul 2>&1
if errorlevel 1 (
    echo [OK] process.env исправлен в telegram-config.js
) else (
    echo [ОШИБКА] process.env все еще используется в telegram-config.js!
    pause
    exit /b 1
)

findstr /C:"window.addEventListener.*DOMContentLoaded" "src\js\app.js" >nul 2>&1
if errorlevel 1 (
    echo [OK] Используется document.addEventListener для DOMContentLoaded
) else (
    echo [ПРЕДУПРЕЖДЕНИЕ] Проверьте использование addEventListener в app.js
)

findstr /C:"window.selectReport" "src\js\app.js" >nul 2>&1
if errorlevel 1 (
    echo [ОШИБКА] selectReport не экспортируется в window!
    pause
    exit /b 1
) else (
    echo [OK] Функции экспортируются в window
)

echo.
echo ========================================
echo   ИТОГИ ПРОВЕРКИ
echo ========================================
echo.
echo [OK] Все основные файлы на месте
echo [OK] Критические исправления применены
echo.
echo ========================================
echo   КАК ПРОВЕРИТЬ В БРАУЗЕРЕ:
echo ========================================
echo.
echo 1. Откройте index.html в браузере:
echo    - Дважды щелкните на файл index.html
echo    - ИЛИ перетащите файл в окно браузера
echo.
echo 2. Откройте консоль разработчика (F12)
echo.
echo 3. Проверьте консоль на наличие ошибок:
echo    - Не должно быть ошибок "process is not defined"
echo    - Не должно быть ошибок "selectReport is not defined"
echo    - Должно быть сообщение "✅ Все функции загружены успешно"
echo.
echo 4. Проверьте функциональность:
echo    - Нажмите кнопку "Операционные показатели"
echo    - Нажмите кнопку "Персонал"
echo    - Нажмите кнопку "Экспорт Excel"
echo    - Все кнопки должны работать без ошибок
echo.
echo 5. Для деплоя на GitHub Pages запустите DEPLOY.bat
echo.
pause

