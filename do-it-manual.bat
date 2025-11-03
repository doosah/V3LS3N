@echo off
chcp 65001 >nul
echo ========================================
echo Creating Telegram Bot Repository
echo ========================================
echo.

echo Step 1: Creating folder...
if exist "C:\Users\Ноут\V3LS3N-telegram-bot" (
    echo Folder exists, removing...
    rmdir /s /q "C:\Users\Ноут\V3LS3N-telegram-bot"
)
mkdir "C:\Users\Ноут\V3LS3N-telegram-bot"

echo.
echo Step 2: Copying files...
xcopy /E /I /Y "C:\Users\Ноут\V3LS3N\server\*" "C:\Users\Ноут\V3LS3N-telegram-bot\"

echo.
echo Step 3: Setting up git...
cd /d "C:\Users\Ноут\V3LS3N-telegram-bot"
git init
git add .
git commit -m "Initial commit - Telegram bot server"

echo.
echo Step 4: Adding remote...
git remote add origin https://github.com/doosah/V3LS3N-telegram-bot.git
git branch -M main

echo.
echo Step 5: Pushing to GitHub...
git push -u origin main

echo.
echo ========================================
echo Done!
echo ========================================
echo.
echo Now go to Railway and deploy:
echo 1. https://railway.app
echo 2. New Project - Deploy from GitHub
echo 3. Select: V3LS3N-telegram-bot
echo.
pause

