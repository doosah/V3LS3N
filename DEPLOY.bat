@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo ========================================
echo   ДЕПЛОЙ НА GITHUB PAGES
echo ========================================
echo.
echo Шаг 1: Получаю последние изменения с GitHub...
git fetch origin
git pull origin main --rebase
if errorlevel 1 (
    echo ⚠️  Конфликты при pull. Пробую merge...
    git rebase --abort 2>nul
    git pull origin main --no-rebase
    if errorlevel 1 (
        echo ❌ Не удалось получить изменения. Попробуйте вручную:
        echo   git pull origin main
        pause
        exit /b 1
    )
)
echo.
echo Шаг 2: Добавляю все файлы...
git add .
echo.
echo Шаг 3: Создаю коммит...
git commit -m "Деплой на GitHub Pages с Supabase интеграцией"
if errorlevel 1 (
    echo ℹ️  Нет изменений для коммита или коммит уже создан.
)
echo.
echo Шаг 4: Отправляю на GitHub...
git push origin main
if errorlevel 1 (
    echo.
    echo ⚠️  Push отклонен. Пробую еще раз с pull...
    git pull origin main --rebase
    git push origin main
    if errorlevel 1 (
        echo.
        echo ❌ Ошибка отправки на GitHub
        echo Попробуйте выполнить вручную:
        echo   git pull origin main
        echo   git push origin main
        pause
        exit /b 1
    )
)
echo.
echo ========================================
echo   ГОТОВО!
echo ========================================
echo.
echo Теперь:
echo 1. Открой: https://github.com/doosah/V3LS3N
echo 2. Настройки GitHub Pages уже активны (deploy через Actions)
echo 3. Через 1-2 минуты сайт будет доступен!
echo.
echo Ссылка: https://doosah.github.io/V3LS3N/
echo.
pause

