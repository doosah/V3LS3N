@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo ========================================
echo   ДЕПЛОЙ НА GITHUB PAGES
echo ========================================
echo.
echo Шаг 1: Добавляю все файлы...
git add .
echo.
echo Шаг 2: Создаю коммит...
git commit -m "Деплой на GitHub Pages с Supabase интеграцией"
echo.
echo Шаг 3: Отправляю на GitHub...
git push origin main
echo.
echo ========================================
echo   ГОТОВО!
echo ========================================
echo.
echo Теперь:
echo 1. Открой: https://github.com/doosah/V3LS3N
echo 2. Settings → Pages → включи GitHub Pages
echo 3. Через 1-2 минуты сайт будет доступен!
echo.
echo Ссылка будет: https://doosah.github.io/V3LS3N/
echo.
pause

