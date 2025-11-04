@echo off
chcp 65001 >nul
cd /d "C:\Users\Ноут\V3LS3N-telegram-bot"
git add .
git commit -m "Fix: Correct table styling and data processing (delta calculation)"
git push
echo.
echo Done! Railway will deploy in 3-5 minutes
echo.
pause

