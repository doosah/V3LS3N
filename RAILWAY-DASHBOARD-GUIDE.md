# Railway Dashboard - Подробное руководство

## ШАГ 3: ПРОВЕРКА НАСТРОЕК RAILWAY DASHBOARD

### 1. Открытие Railway Dashboard

1. Откройте браузер (Chrome, Edge, Firefox)
2. Перейдите на сайт: https://railway.app
3. Войдите в свой аккаунт:
   - Если уже залогинены → переходите к шагу 2
   - Если нет → нажмите "Login" → выберите "Login with GitHub"

### 2. Поиск проекта "stunning-manifestation"

1. После входа вы увидите список ваших проектов
2. Найдите проект с названием "stunning-manifestation"
3. Нажмите на него (кликните по названию или карточке проекта)

### 3. Проверка Service Settings

После открытия проекта:

1. В левом меню или вверху страницы найдите "Settings" (Настройки)
2. Или нажмите на название сервиса → выберите "Settings"
3. Найдите раздел "Service Settings" или просто "Settings"

#### Что проверить в Service Settings:

**Root Directory** (Корневая директория):
- Должно быть ПУСТО (пустое поле)
- ИЛИ точка: "."
- НЕ должно быть: "server", "src" или другой папки

**Build Command** (Команда сборки):
- Должно быть: `npm install`
- ИЛИ оставьте пустым (Railway определит автоматически)

**Start Command** (Команда запуска):
- Должно быть: `node server.js`
- ИЛИ оставьте пустым (Railway использует из package.json)

### 4. Проверка Environment Variables (Переменные окружения)

1. В том же разделе Settings найдите "Variables" или "Environment Variables"
2. Или отдельный раздел "Variables" в меню

#### Проверьте наличие этих переменных:

1. `TELEGRAM_BOT_TOKEN`
   - Значение: `8241855422:AAG7yW4NT5yoOagAo7My6bXDCdOo-pAhUa8`

2. `TELEGRAM_CHAT_ID`
   - Значение: `-1003107822060`

3. `SUPABASE_URL`
   - Значение: `https://hpjrjpxctmlttdwqrpvc.supabase.co`

4. `SUPABASE_KEY`
   - Значение: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhwanJqcHhjdG1sdHRkd3FycHZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwNzAxMzIsImV4cCI6MjA3NzY0NjEzMn0.jgJD4uKiLoW6MPw5yMrsoYlguowcnn5tl9pKeib7tcs`

#### Если переменных нет или они неправильные:

1. Нажмите кнопку "New Variable" или "Add Variable" или "+"
2. В поле "Name" введите имя переменной (например: `TELEGRAM_BOT_TOKEN`)
3. В поле "Value" введите значение переменной
4. Нажмите "Save" или "Add"
5. Повторите для всех переменных

### 5. Проверка логов сборки (Build Logs)

1. В проекте найдите вкладку "Deployments" (Деплойменты) в меню
2. Вы увидите список всех деплоев
3. Выберите последний деплой (самый верхний в списке)
4. Нажмите на него
5. Найдите вкладку "Logs" или кнопку "View Logs"

#### Что искать в логах:

✅ УСПЕШНАЯ СБОРКА:
- "Build completed successfully"
- "Deployment successful"
- "Service started"

❌ ОШИБКИ СБОРКИ:
- "Error: ..."
- "Failed to build"
- "Cannot find module"
- "fetch is not defined"

#### Типичные ошибки и их решения:

1. `fetch is not defined`
   - Причина: Node.js версия меньше 18
   - Решение: Проверьте, что в package.json указано "node": ">=18.0.0"

2. `Cannot find module 'xxx'`
   - Причина: Отсутствует зависимость
   - Решение: Проверьте package.json, все зависимости должны быть указаны

3. `Build failed`
   - Причина: Ошибка в конфигурации или коде
   - Решение: Посмотрите полный лог ошибки выше

### 6. Перезапуск деплоя (если нужно)

Если нужно пересобрать проект вручную:

1. В разделе "Deployments"
2. Нажмите кнопку "Redeploy" или "Deploy" (обычно справа вверху)
3. Или нажмите на последний деплой → "Redeploy"
4. Railway автоматически пересоберет проект

### 7. Проверка статуса сервиса

После успешной сборки:

1. В проекте найдите вкладку "Metrics" или "Logs"
2. Проверьте, что сервис работает:
   - Должны быть логи "Server started"
   - Должна быть иконка "Running" (зеленая)

## Визуальная инструкция:

Railway Dashboard обычно выглядит так:

```
┌─────────────────────────────────┐
│ [Railway Logo]  Projects        │
├─────────────────────────────────┤
│  Your Projects:                 │
│  ┌─────────────────────────┐   │
│  │ stunning-manifestation  │   │ ← Нажмите сюда
│  │ [Status: Running]       │   │
│  └─────────────────────────┘   │
└─────────────────────────────────┘

После клика:
┌─────────────────────────────────┐
│ [Назад] stunning-manifestation │
├─────────────────────────────────┤
│ [Overview] [Logs] [Settings]   │ ← Settings здесь
│                                  │
│  Service Settings:              │
│   Root Directory: [    ]       │ ← Должно быть пусто
│   Build Command: [npm install] │
│   Start Command: [node server.js]│
│                                  │
│  Variables:                     │
│   [New Variable]                │
│   TELEGRAM_BOT_TOKEN = ...     │
│   TELEGRAM_CHAT_ID = ...       │
└─────────────────────────────────┘
```

## Если возникли проблемы:

1. Скопируйте текст ошибки из логов
2. Сообщите мне - я помогу исправить
3. Или проверьте эту инструкцию еще раз

## ВАЖНО

После изменения настроек Railway автоматически пересоберет проект.
Подождите 1-2 минуты и проверьте логи снова.

