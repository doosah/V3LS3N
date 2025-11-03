@echo off
chcp 65001 >nul
cd /d "C:\Users\Ноут\V3LS3N-telegram-bot"
git add index.js
git commit -m "Add /send-report endpoint for manual report sending"
git push
echo.
echo Done! Railway will deploy in 1-2 minutes
echo.
echo Then open:
echo https://telegram-scheduler-production.up.railway.app/send-report
echo.
pause

