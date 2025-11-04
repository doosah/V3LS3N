@echo off
chcp 65001 >nul
cd /d "C:\Users\Ноут\V3LS3N-telegram-bot"
git add -A
git commit -m "Add test image endpoint and improve image generation logging"
git push
echo.
echo Done! Railway will deploy in 3-5 minutes
echo.
echo After deployment, test image generation at:
echo https://telegram-scheduler-production.up.railway.app/test-image
echo.
pause

