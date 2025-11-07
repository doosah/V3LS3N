-- SQL скрипт для создания таблицы shortage_reports в Supabase
-- Выполните этот скрипт в SQL Editor в Supabase Dashboard

CREATE TABLE IF NOT EXISTS shortage_reports (
    id BIGSERIAL PRIMARY KEY,
    week_key TEXT NOT NULL, -- формат: YYYY-W## (например, 2025-W32)
    warehouse TEXT NOT NULL,
    data JSONB NOT NULL DEFAULT '{}',
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(week_key, warehouse)
);

-- Создание индексов для быстрого поиска
CREATE INDEX IF NOT EXISTS idx_shortage_reports_week_key ON shortage_reports(week_key);
CREATE INDEX IF NOT EXISTS idx_shortage_reports_warehouse ON shortage_reports(warehouse);
CREATE INDEX IF NOT EXISTS idx_shortage_reports_week_warehouse ON shortage_reports(week_key, warehouse);

-- Включение Row Level Security (RLS) если нужно
-- ALTER TABLE shortage_reports ENABLE ROW LEVEL SECURITY;

-- Политика для анонимного доступа (если нужно)
-- CREATE POLICY "Allow anonymous read/write" ON shortage_reports
--     FOR ALL USING (true) WITH CHECK (true);

-- Комментарии к таблице и колонкам
COMMENT ON TABLE shortage_reports IS 'Еженедельные отчеты о недостачах по складам';
COMMENT ON COLUMN shortage_reports.week_key IS 'Ключ недели в формате YYYY-W## (например, 2025-W32)';
COMMENT ON COLUMN shortage_reports.warehouse IS 'Название склада';
COMMENT ON COLUMN shortage_reports.data IS 'JSON данные отчета о недостачах';
COMMENT ON COLUMN shortage_reports.updated_at IS 'Дата последнего обновления';

