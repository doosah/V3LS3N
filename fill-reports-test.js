// Скрипт заполнения отчетов за 06.11.2025
// Дневная смена: 3 склада, Ночная смена: 5 складов

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://hpjrjpxctmlttdwqrpvc.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhwanJqcHhjdG1sdHRkd3FycHZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwNzAxMzIsImV4cCI6MjA3NzY0NjEzMn0.jgJD4uKiLoW6MPw5yMrsoYlguowcnn5tl9pKeib7tcs';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const ALL_WAREHOUSES = [
    "АРХАНГЕЛЬСК_ХАБ_НАХИМОВА",
    "МУРМАНСК_ХАБ_ОБЪЕЗДНАЯ",
    "ВЕЛИКИЙ_НОВГОРОД_ХАБ_НЕХИНСКАЯ",
    "ПЕТРОЗАВОДСК_ХАБ_ПРЯЖИНСКОЕ",
    "ПСКОВ_ХАБ_МАРГЕЛОВА",
    "ПСКОВ_ХАБ_НОВЫЙ",
    "СЫКТЫВКАР_ХАБ_ЛЕСОПАРКОВАЯ",
    "СЫКТЫВКАР_ХАБ_ОКТЯБРЬСКИЙ",
    "ЧЕРЕПОВЕЦ_ХАБ_СТРОЙИНДУСТРИИ",
    "ВОЛОГДА_ХАБ_БЕЛОЗЕРСКОЕ",
    "СПБ_ХАБ_Осиновая Роща",
    "СПБ_Хаб_Парголово",
    "СПБ_Хаб_Парголово_Блок_3",
    "СПБ_Хаб_Парголово_Блок_4"
];

// Выбираем случайные склады
function getRandomWarehouses(count) {
    const shuffled = [...ALL_WAREHOUSES].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
}

// Генерация случайного числа
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Генерация случайного времени
function randomTime() {
    const hour = randomInt(8, 22);
    const minute = randomInt(0, 59);
    return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
}

// Генерация данных для операционных отчетов
function generateOperationalData() {
    return {
        'Обработка': {
            plan: randomInt(100, 1000),
            fact: randomInt(100, 1000)
        },
        'Персонал': {
            plan: randomInt(10, 50),
            fact: randomInt(10, 50)
        },
        'Окончание выдачи': {
            plan: randomTime(),
            fact: randomTime()
        },
        'Обработка FBS': {
            plan: randomInt(50, 500),
            fact: randomInt(50, 500)
        },
        'Возвратный поток (Бэклог)': {
            plan: randomInt(10, 200),
            fact: randomInt(10, 200)
        },
        'Обезличка': {
            value: randomInt(5, 50)
        },
        'Эффективность': {
            plan: randomInt(80, 100),
            fact: randomInt(75, 105)
        },
        'Кол-во паллета-мест к отгрузке': {
            'FBS': randomInt(10, 100),
            'X-Dock': randomInt(5, 50),
            'Возвраты': randomInt(3, 30)
        },
        'Хронь ХД': {
            'Сорт': randomInt(0, 20),
            'Нон-Сорт': randomInt(0, 15)
        },
        'Риски': {
            value: Math.random() > 0.7 ? 'yes' : 'no'
        },
        'Промежуточная Выдача': {
            value: randomInt(1, 30)
        },
        '% не профиля': {
            value: randomInt(0, 15)
        },
        'Руководитель': {
            value: Math.random() > 0.5 ? 'Территория 1 Шутин Д.М.' : 'Территория 2 Любавкская М.И.'
        }
    };
}

// Генерация данных для отчетов по персоналу
function generatePersonnelData() {
    return {
        'Штат': {
            plan: randomInt(10, 30),
            fact: randomInt(10, 30)
        },
        'Ozon Job': {
            plan: randomInt(5, 15),
            fact: randomInt(5, 15),
            capacity: randomInt(8, 20),
            share: randomInt(60, 90)
        },
        'PB': {
            value: randomInt(1, 5)
        },
        'Командир...': {
            value: randomInt(0, 3)
        },
        'Total': {
            plan: randomInt(15, 40),
            fact: randomInt(15, 40)
        },
        'Производство': {
            value: randomInt(85, 95)
        },
        'Причины невыхода': {
            value: randomInt(0, 2)
        },
        'Комментарии': {
            value: 'Тестовые данные ' + randomInt(1, 100)
        },
        'Руководитель': {
            value: Math.random() > 0.5 ? 'Территория 1 Шутин Д.М.' : 'Территория 2 Любавкская М.И.'
        }
    };
}

async function fillReportsForDate() {
    const dateISO = '2025-11-06';
    console.log('🚀 Заполнение отчетов за 06.11.2025');
    
    // Дневная смена: 3 склада
    const dayWarehouses = getRandomWarehouses(3);
    console.log(`\n☀️ Дневная смена: ${dayWarehouses.length} складов`);
    dayWarehouses.forEach(w => console.log(`   - ${w}`));
    
    // Ночная смена: 5 складов
    const nightWarehouses = getRandomWarehouses(5);
    console.log(`\n🌙 Ночная смена: ${nightWarehouses.length} складов`);
    nightWarehouses.forEach(w => console.log(`   - ${w}`));
    
    let operationalCount = 0;
    let personnelCount = 0;
    let errors = 0;
    
    // Заполняем дневную смену
    console.log('\n📊 Заполнение дневной смены...');
    for (const warehouse of dayWarehouses) {
        try {
            // Операционные отчеты
            const operationalData = generateOperationalData();
            const { error: opError } = await supabase
                .from('operational_reports')
                .upsert({
                    report_date: dateISO,
                    warehouse: warehouse,
                    shift_type: 'day',
                    data: operationalData,
                    updated_at: new Date().toISOString()
                }, { onConflict: 'report_date,warehouse,shift_type' });
            
            if (opError) {
                console.error(`❌ Ошибка операционного отчета ${warehouse}:`, opError.message);
                errors++;
            } else {
                operationalCount++;
            }
            
            // Отчеты по персоналу
            const personnelData = generatePersonnelData();
            const { error: persError } = await supabase
                .from('personnel_reports')
                .upsert({
                    report_date: dateISO,
                    warehouse: warehouse,
                    shift_type: 'day',
                    data: personnelData,
                    updated_at: new Date().toISOString()
                }, { onConflict: 'report_date,warehouse,shift_type' });
            
            if (persError) {
                console.error(`❌ Ошибка отчета по персоналу ${warehouse}:`, persError.message);
                errors++;
            } else {
                personnelCount++;
            }
            
            console.log(`✅ Заполнен ${warehouse} (дневная)`);
        } catch (err) {
            console.error(`❌ Ошибка для ${warehouse}:`, err.message);
            errors++;
        }
    }
    
    // Заполняем ночную смену
    console.log('\n📊 Заполнение ночной смены...');
    for (const warehouse of nightWarehouses) {
        try {
            // Операционные отчеты
            const operationalData = generateOperationalData();
            const { error: opError } = await supabase
                .from('operational_reports')
                .upsert({
                    report_date: dateISO,
                    warehouse: warehouse,
                    shift_type: 'night',
                    data: operationalData,
                    updated_at: new Date().toISOString()
                }, { onConflict: 'report_date,warehouse,shift_type' });
            
            if (opError) {
                console.error(`❌ Ошибка операционного отчета ${warehouse}:`, opError.message);
                errors++;
            } else {
                operationalCount++;
            }
            
            // Отчеты по персоналу
            const personnelData = generatePersonnelData();
            const { error: persError } = await supabase
                .from('personnel_reports')
                .upsert({
                    report_date: dateISO,
                    warehouse: warehouse,
                    shift_type: 'night',
                    data: personnelData,
                    updated_at: new Date().toISOString()
                }, { onConflict: 'report_date,warehouse,shift_type' });
            
            if (persError) {
                console.error(`❌ Ошибка отчета по персоналу ${warehouse}:`, persError.message);
                errors++;
            } else {
                personnelCount++;
            }
            
            console.log(`✅ Заполнен ${warehouse} (ночная)`);
        } catch (err) {
            console.error(`❌ Ошибка для ${warehouse}:`, err.message);
            errors++;
        }
    }
    
    console.log(`\n📊 Итоги:`);
    console.log(`   ✅ Операционные отчеты: ${operationalCount}`);
    console.log(`   ✅ Отчеты по персоналу: ${personnelCount}`);
    console.log(`   ❌ Ошибок: ${errors}`);
    console.log(`\n✅ Заполнение завершено!`);
}

fillReportsForDate().catch(error => {
    console.error('❌ Критическая ошибка:', error);
    process.exit(1);
});


