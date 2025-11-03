# Ручные шаги для создания репозитория

## Шаг 1: Создай репозиторий на GitHub

1. Открой: https://github.com/new
2. Название: **V3LS3N-telegram-bot**
3. НЕ добавляй README, .gitignore, лицензию
4. Нажми **Create repository**

## Шаг 2: Скопируй файлы вручную

Открой PowerShell и выполни:

```powershell
# Создать папку
New-Item -ItemType Directory -Path "C:\Users\Ноут\V3LS3N-telegram-bot" -Force

# Скопировать файлы
Copy-Item -Path "C:\Users\Ноут\V3LS3N\server\*" -Destination "C:\Users\Ноут\V3LS3N-telegram-bot" -Recurse

# Перейти в папку
cd "C:\Users\Ноут\V3LS3N-telegram-bot"

# Настроить git
git init
git add .
git commit -m "Initial commit"

# Добавить remote
git remote add origin https://github.com/doosah/V3LS3N-telegram-bot.git

# Отправить
git branch -M main
git push -u origin main
```

## Шаг 3: Деплой на Railway

1. Открой: https://railway.app
2. **New Project** → **Deploy from GitHub repo**
3. Выбери: **V3LS3N-telegram-bot**
4. Railway автоматически запустит сервер

## Шаг 4: Добавь переменные окружения

В Railway: **Settings** → **Variables** → **Add Variable**

Добавь 4 переменные:
- `TELEGRAM_BOT_TOKEN` = `8241855422:AAG7yW4NT5yoOagAo7My6bXDCdOo-pAhUa8`
- `TELEGRAM_CHAT_ID` = `-1003107822060`
- `SUPABASE_URL` = `https://hpjrjpxctmlttdwqrpvc.supabase.co`
- `SUPABASE_KEY` = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhwanJqcHhjdG1sdHRkd3FycHZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwNzAxMzIsImV4cCI6MjA3NzY0NjEzMn0.jgJD4uKiLoW6MPw5yMrsoYlguowcnn5tl9pKeib7tcs`

## Готово!

Через 2-3 минуты проверь логи Railway - должен запуститься сервер.

