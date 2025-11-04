@echo off
chcp 65001 >nul
cd /d "C:\Users\Ноут\V3LS3N-telegram-bot"
echo ========================================
echo FINAL PUSH - All changes
echo ========================================
echo.
git add -A
git status
echo.
echo Committing...
git commit -m "Add table image generation with detailed logging"
echo.
echo Pushing to GitHub...
git push
echo.
echo ========================================
echo DONE!
echo ========================================
echo.
echo Wait 5-10 minutes for Railway to auto-deploy
echo Or restart manually in Railway Dashboard
echo.
pause

