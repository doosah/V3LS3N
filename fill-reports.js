// Скрипт заполнения отчетов случайными данными
// Заполняет все отчеты с 01.11.2025 по 05.11.2025 для всех складов и обеих смен

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://hpjrjpxctmlttdwqrpvc.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhwanJqcHhjdG1sdHRkd3FycHZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwNzAxMzIsImV4cCI6MjA3NzY0NjEzMn0.jgJD4uKiLoW6MPw5yMrsoYlguowcnn5tl9pKeib7tcs';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const WAREHOUSES = [
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

const SHIFTS = ['day', 'night'];

// Генерация случайного числа в диапазоне
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Генерация случайного времени
function randomTime() {
    const hour = randomInt(8, 22);
    const minute = randomInt(0, 59);
    return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
}

// Генерация случайного значения для операционных отчетов
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

// Генерация случайного значения для отчетов по персоналу
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

// Основная функция
async function fillReports() {
    console.log('🚀 Заполнение отчетов случайными данными...');
    console.log('📅 Период: 01.11.2025 - 05.11.2025');
    console.log(`📦 Складов: ${WAREHOUSES.length}`);
    console.log(`🌓 Смен: ${SHIFTS.length * 2} (дневная и ночная)\n`);
    
    const dates = [
        '2025-11-01',
        '2025-11-02',
        '2025-11-03',
        '2025-11-04',
        '2025-11-05'
    ];
    
    let operationalCount = 0;
    let personnelCount = 0;
    let errors = 0;
    
    // Заполняем операционные отчеты
    console.log('📊 Заполнение операционных отчетов...');
    for (const date of dates) {
        for (const warehouse of WAREHOUSES) {
            for (const shift of SHIFTS) {
                try {
                    const data = generateOperationalData();
                    
                    const { error } = await supabase
                        .from('operational_reports')
                        .upsert({
                            report_date: date,
                            warehouse: warehouse,
                            shift_type: shift,
                            data: data,
                            updated_at: new Date().toISOString()
                        }, { onConflict: 'report_date,warehouse,shift_type' });
                    
                    if (error) {
                        console.error(`❌ Ошибка для ${warehouse} ${date} ${shift}:`, error.message);
                        errors++;
                    } else {
                        operationalCount++;
                        if (operationalCount % 10 === 0) {
                            console.log(`   ✅ Заполнено ${operationalCount} операционных отчетов...`);
                        }
                    }
                } catch (err) {
                    console.error(`❌ Ошибка для ${warehouse} ${date} ${shift}:`, err.message);
                    errors++;
                }
            }
        }
    }
    
    console.log(`\n✅ Операционные отчеты: ${operationalCount} записей`);
    
    // Заполняем отчеты по персоналу
    console.log('\n👥 Заполнение отчетов по персоналу...');
    for (const date of dates) {
        for (const warehouse of WAREHOUSES) {
            for (const shift of SHIFTS) {
                try {
                    const data = generatePersonnelData();
                    
                    const { error } = await supabase
                        .from('personnel_reports')
                        .upsert({
                            report_date: date,
                            warehouse: warehouse,
                            shift_type: shift,
                            data: data,
                            updated_at: new Date().toISOString()
                        }, { onConflict: 'report_date,warehouse,shift_type' });
                    
                    if (error) {
                        console.error(`❌ Ошибка для ${warehouse} ${date} ${shift}:`, error.message);
                        errors++;
                    } else {
                        personnelCount++;
                        if (personnelCount % 10 === 0) {
                            console.log(`   ✅ Заполнено ${personnelCount} отчетов по персоналу...`);
                        }
                    }
                } catch (err) {
                    console.error(`❌ Ошибка для ${warehouse} ${date} ${shift}:`, err.message);
                    errors++;
                }
            }
        }
    }
    
    console.log(`\n✅ Отчеты по персоналу: ${personnelCount} записей`);
    
    // Проверяем результаты
    console.log('\n🔍 Проверка заполненных данных...');
    for (const date of dates) {
        const { data: ops } = await supabase
            .from('operational_reports')
            .select('*')
            .eq('report_date', date);
        
        const { data: pers } = await supabase
            .from('personnel_reports')
            .select('*')
            .eq('report_date', date);
        
        console.log(`   ${date}: ${ops?.length || 0} операционных, ${pers?.length || 0} персонала`);
    }
    
    console.log(`\n📊 Итоги:`);
    console.log(`   ✅ Операционные отчеты: ${operationalCount}`);
    console.log(`   ✅ Отчеты по персоналу: ${personnelCount}`);
    console.log(`   ❌ Ошибок: ${errors}`);
    console.log(`   📈 Всего записей: ${operationalCount + personnelCount}`);
    
    if (errors === 0) {
        console.log('\n✅ Все отчеты успешно заполнены!');
    } else {
        console.log(`\n⚠️  Заполнено с ошибками (${errors} ошибок)`);
    }
}

fillReports().catch(error => {
    console.error('❌ Критическая ошибка:', error);
    process.exit(1);
});

