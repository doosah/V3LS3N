@echo off
chcp 65001 >nul
cd /d "C:\Users\Ноут\V3LS3N-telegram-bot"
git add -A
git commit -m "Fix: Simplify final report - only image, reminder only tags"
git push
echo.
echo Done! Railway will deploy in 3-5 minutes
echo.
pause

