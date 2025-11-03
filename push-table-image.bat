@echo off
chcp 65001 >nul
cd /d "C:\Users\Ноут\V3LS3N-telegram-bot"
git add .
git commit -m "Add table image generation and send to Telegram"
git push
echo.
echo Done! Railway will deploy in 2-3 minutes
echo.
echo Then test:
echo https://telegram-scheduler-production.up.railway.app/send-report
echo.
pause

