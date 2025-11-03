@echo off
chcp 65001 >nul
cd /d "C:\Users\Ноут\V3LS3N-telegram-bot"
echo Checking git status...
git status
echo.
echo Adding all files...
git add .
echo.
echo Committing...
git commit -m "Add detailed logging for image generation"
echo.
echo Pushing to GitHub...
git push
echo.
echo ========================================
echo Done! Wait 3-4 minutes for Railway to deploy
echo Then check logs:
echo   railway logs --tail 100
echo ========================================
pause

