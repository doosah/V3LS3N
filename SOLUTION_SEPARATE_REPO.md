# ✅ РЕШЕНИЕ: Отдельный репозиторий для сервера

## Проблема
Railway постоянно пытается запустить `index.html` вместо Node.js сервера.

## Решение
Создать **отдельный репозиторий** только для сервера Telegram бота.

---

## Шаг 1: Создать новый репозиторий на GitHub

1. Открой: https://github.com/new
2. Название: `V3LS3N-telegram-bot` (или любое другое)
3. Сделай его **приватным** (если хочешь)
4. **НЕ добавляй** README, .gitignore, лицензию
5. Нажми **Create repository**

---

## Шаг 2: Скопировать только server/ в новый репозиторий

Создай папку для нового репозитория:

```powershell
cd C:\Users\Ноут
mkdir V3LS3N-telegram-bot
cd V3LS3N-telegram-bot
```

Скопируй содержимое server/:

```powershell
# Скопировать все файлы из server/
Copy-Item -Path "..\V3LS3N\server\*" -Destination "." -Recurse

# Инициализировать git
git init
git add .
git commit -m "Initial commit - Telegram bot server"

# Добавить remote (замени URL на свой)
git remote add origin https://github.com/doosah/V3LS3N-telegram-bot.git
git branch -M main
git push -u origin main
```

---

## Шаг 3: Деплой на Railway

1. Открой Railway: https://railway.app
2. **New Project** → **Deploy from GitHub repo**
3. Выбери **V3LS3N-telegram-bot** (новый репозиторий)
4. Railway автоматически:
   - Определит Node.js проект
   - Установит зависимости (`npm install`)
   - Запустит `node index.js` (из package.json)

**Готово!** Railway запустит сервер без проблем, потому что там нет `index.html`.

---

## Шаг 4: Настроить переменные окружения в Railway

В Railway Settings → Variables добавь:

```
TELEGRAM_BOT_TOKEN=8241855422:AAG7yW4NT5yoOagAo7My6bXDCdOo-pAhUa8
TELEGRAM_CHAT_ID=-1003107822060
SUPABASE_URL=https://hpjrjpxctmlttdwqrpvc.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhwanJqcHhjdG1sdHRkd3FycHZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwNzAxMzIsImV4cCI6MjA3NzY0NjEzMn0.jgJD4uKiLoW6MPw5yMrsoYlguowcnn5tl9pKeib7tcs
PORT=3000
```

---

## Альтернатива: Использовать Render.com

Render.com проще и не путается с файлами.

1. Открой: https://render.com
2. **New** → **Web Service**
3. Подключи GitHub репозиторий `V3LS3N-telegram-bot`
4. Настройки:
   - **Root Directory**: оставь пустым (или `server` если скопируешь всю структуру)
   - **Build Command**: `npm install`
   - **Start Command**: `node index.js`
5. Добавь переменные окружения
6. **Deploy**

Render.com точно работает с Node.js проектами.

---

## Почему это лучше?

✅ Нет конфликта с `index.html`
✅ Railway автоматически определит Node.js проект
✅ Проще поддерживать
✅ Можно деплоить отдельно от фронтенда
✅ Меньше проблем с конфигурацией

---

## Что делать со старым сервисом на Railway?

1. Удали старый сервис из Railway (или оставь, если нужно)
2. Или переименуй его для фронтенда (если хочешь деплоить фронт на Railway)

