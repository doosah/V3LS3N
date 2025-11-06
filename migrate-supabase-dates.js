// Скрипт миграции данных в Supabase
// Исправляет формат дат из DD.MM.YYYY в YYYY-MM-DD

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://hpjrjpxctmlttdwqrpvc.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhwanJqcHhjdG1sdHRkd3FycHZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwNzAxMzIsImV4cCI6MjA3NzY0NjEzMn0.jgJD4uKiLoW6MPw5yMrsoYlguowcnn5tl9pKeib7tcs';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Преобразование даты из DD.MM.YYYY в YYYY-MM-DD
function convertDateToSupabaseFormat(date) {
    if (!date) return null;
    
    // Если дата уже в формате YYYY-MM-DD, возвращаем как есть
    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return date;
    }
    
    // Преобразуем из DD.MM.YYYY в YYYY-MM-DD
    if (/^\d{2}\.\d{2}\.\d{4}$/.test(date)) {
        const parts = date.split('.');
        return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    
    return null;
}

// Миграция данных для одной таблицы
async function migrateTable(tableName) {
    console.log(`\n📊 Миграция таблицы: ${tableName}`);
    
    try {
        // Получаем все записи
        const { data: records, error: fetchError } = await supabase
            .from(tableName)
            .select('*');
        
        if (fetchError) {
            console.error(`❌ Ошибка загрузки из ${tableName}:`, fetchError);
            return { migrated: 0, errors: 0 };
        }
        
        if (!records || records.length === 0) {
            console.log(`ℹ️  Таблица ${tableName} пуста`);
            return { migrated: 0, errors: 0 };
        }
        
        console.log(`📋 Найдено записей: ${records.length}`);
        
        let migrated = 0;
        let errors = 0;
        
        // Обрабатываем каждую запись
        for (const record of records) {
            const oldDate = record.report_date;
            
            // Пропускаем, если дата уже в правильном формате
            if (/^\d{4}-\d{2}-\d{2}$/.test(oldDate)) {
                continue;
            }
            
            // Преобразуем дату
            const newDate = convertDateToSupabaseFormat(oldDate);
            
            if (!newDate) {
                console.warn(`⚠️  Не удалось преобразовать дату: ${oldDate} (ID: ${record.id})`);
                errors++;
                continue;
            }
            
            // Обновляем запись с новой датой
            const { error: updateError } = await supabase
                .from(tableName)
                .update({ report_date: newDate })
                .eq('id', record.id);
            
            if (updateError) {
                console.error(`❌ Ошибка обновления записи ID ${record.id}:`, updateError);
                errors++;
            } else {
                console.log(`✅ Мигрировано: ${oldDate} → ${newDate} (ID: ${record.id}, Склад: ${record.warehouse})`);
                migrated++;
            }
        }
        
        return { migrated, errors };
    } catch (error) {
        console.error(`❌ Критическая ошибка при миграции ${tableName}:`, error);
        return { migrated: 0, errors: 1 };
    }
}

// Проверка данных за конкретную дату
async function checkDataForDate(dateISO) {
    console.log(`\n🔍 Проверка данных за дату: ${dateISO}`);
    
    try {
        // Проверяем операционные отчеты
        const { data: operational, error: opError } = await supabase
            .from('operational_reports')
            .select('*')
            .eq('report_date', dateISO);
        
        if (opError) {
            console.error('❌ Ошибка проверки операционных отчетов:', opError);
        } else {
            console.log(`📊 Операционные отчеты за ${dateISO}: ${operational?.length || 0} записей`);
            if (operational && operational.length > 0) {
                operational.forEach(r => {
                    console.log(`   - ${r.warehouse} (${r.shift_type}): ${Object.keys(r.data || {}).length} категорий`);
                });
            }
        }
        
        // Проверяем отчеты по персоналу
        const { data: personnel, error: persError } = await supabase
            .from('personnel_reports')
            .select('*')
            .eq('report_date', dateISO);
        
        if (persError) {
            console.error('❌ Ошибка проверки отчетов по персоналу:', persError);
        } else {
            console.log(`👥 Отчеты по персоналу за ${dateISO}: ${personnel?.length || 0} записей`);
            if (personnel && personnel.length > 0) {
                personnel.forEach(r => {
                    console.log(`   - ${r.warehouse} (${r.shift_type}): ${Object.keys(r.data || {}).length} категорий`);
                });
            }
        }
        
        return {
            operational: operational || [],
            personnel: personnel || []
        };
    } catch (error) {
        console.error('❌ Ошибка при проверке данных:', error);
        return { operational: [], personnel: [] };
    }
}

// Основная функция
async function main() {
    console.log('🚀 Запуск миграции данных в Supabase...');
    console.log(`📅 Дата проверки: 2025-11-02 (02.11.2025 ночная смена)`);
    
    // Проверяем данные до миграции
    console.log('\n📋 Проверка данных ДО миграции:');
    await checkDataForDate('2025-11-02');
    
    // Мигрируем операционные отчеты
    const operationalResult = await migrateTable('operational_reports');
    
    // Мигрируем отчеты по персоналу
    const personnelResult = await migrateTable('personnel_reports');
    
    // Итоги миграции
    console.log('\n📊 Итоги миграции:');
    console.log(`   Операционные отчеты: ${operationalResult.migrated} мигрировано, ${operationalResult.errors} ошибок`);
    console.log(`   Отчеты по персоналу: ${personnelResult.migrated} мигрировано, ${personnelResult.errors} ошибок`);
    console.log(`   Всего мигрировано: ${operationalResult.migrated + personnelResult.migrated}`);
    
    // Проверяем данные после миграции
    console.log('\n📋 Проверка данных ПОСЛЕ миграции:');
    const afterMigration = await checkDataForDate('2025-11-02');
    
    const totalAfter = afterMigration.operational.length + afterMigration.personnel.length;
    
    if (totalAfter > 0) {
        console.log(`\n✅ Данные за 02.11.2025 найдены: ${totalAfter} записей`);
    } else {
        console.log(`\n⚠️  Данные за 02.11.2025 не найдены. Возможно, их нужно пересохранить в сервисе V3LS3N.`);
    }
    
    console.log('\n✅ Миграция завершена!');
}

main().catch(error => {
    console.error('❌ Критическая ошибка:', error);
    process.exit(1);
});

