// Supabase клиент
const SUPABASE_URL = 'https://hpjrjpxctmlttdwqrpvc.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhwanJqcHhjdG1sdHRkd3FycHZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwNzAxMzIsImV4cCI6MjA3NzY0NjEzMn0.jgJD4uKiLoW6MPw5yMrsoYlguowcnn5tl9pKeib7tcs';

// Используем глобальный supabase из CDN
let supabase;
function initSupabase() {
    if (window.supabase && !supabase) {
        supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    }
}

// Инициализируем при загрузке модуля
initSupabase();

export { supabase, initSupabase };

// Преобразование даты из DD.MM.YYYY в YYYY-MM-DD
function convertDateToSupabaseFormat(date) {
    // Если дата уже в формате YYYY-MM-DD, возвращаем как есть
    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return date;
    }
    
    // Преобразуем из DD.MM.YYYY в YYYY-MM-DD
    if (/^\d{2}\.\d{2}\.\d{4}$/.test(date)) {
        const parts = date.split('.');
        return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    
    // Если формат не распознан, пробуем преобразовать через Date
    try {
        const dateObj = new Date(date);
        if (!isNaN(dateObj.getTime())) {
            const year = dateObj.getFullYear();
            const month = String(dateObj.getMonth() + 1).padStart(2, '0');
            const day = String(dateObj.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        }
    } catch (e) {
        console.error('Ошибка преобразования даты:', e);
    }
    
    // Если ничего не помогло, возвращаем исходную дату
    console.warn('Не удалось преобразовать дату:', date);
    return date;
}

// Синхронизация с Supabase
export async function syncToSupabase(type, date, warehouse, shiftType, data) {
    if (!supabase) {
        console.warn('Supabase не инициализирован');
        return;
    }
    
    try {
        // Преобразуем дату в формат YYYY-MM-DD для Supabase
        const supabaseDate = convertDateToSupabaseFormat(date);
        
        const tableName = type === 'operational' ? 'operational_reports' : 'personnel_reports';
        
        console.log(`Синхронизация ${type} отчета:`, {
            date: date,
            supabaseDate: supabaseDate,
            warehouse: warehouse,
            shiftType: shiftType,
            dataKeys: Object.keys(data || {})
        });
        
        const result = await supabase.from(tableName).upsert({
            report_date: supabaseDate,
            warehouse: warehouse,
            shift_type: shiftType,
            data: data,
            updated_at: new Date().toISOString()
        }, { onConflict: 'report_date,warehouse,shift_type' });
        
        if (result.error) {
            console.error('Ошибка синхронизации:', result.error);
            throw result.error;
        }
        
        console.log('✓ Синхронизировано с Supabase:', {
            date: supabaseDate,
            warehouse: warehouse,
            shiftType: shiftType
        });
    } catch (error) {
        console.error('Ошибка синхронизации:', error);
        throw error;
    }
}

// Загрузка из Supabase
export async function loadFromSupabase(storeOperational, storePersonnel) {
    if (!supabase) return;
    try {
        const { data: ops } = await supabase.from('operational_reports').select('*');
        if (ops && storeOperational) {
            ops.forEach(row => {
                if (!storeOperational[row.report_date]) storeOperational[row.report_date] = {};
                if (!storeOperational[row.report_date][row.warehouse]) storeOperational[row.report_date][row.warehouse] = {};
                storeOperational[row.report_date][row.warehouse][row.shift_type] = row.data;
            });
            localStorage.setItem('warehouseReports', JSON.stringify(storeOperational));
            console.log('Operational reports loaded');
        }

        const { data: pers } = await supabase.from('personnel_reports').select('*');
        if (pers && storePersonnel) {
            pers.forEach(row => {
                if (!storePersonnel[row.report_date]) storePersonnel[row.report_date] = {};
                if (!storePersonnel[row.report_date][row.warehouse]) storePersonnel[row.report_date][row.warehouse] = {};
                storePersonnel[row.report_date][row.warehouse][row.shift_type] = row.data;
            });
            localStorage.setItem('personnelReports', JSON.stringify(storePersonnel));
            console.log('Personnel reports loaded');
        }
        console.log('✓ Данные загружены из Supabase');
    } catch (error) {
        console.error('Ошибка загрузки:', error);
    }
}

// Real-time подписки
export function setupRealtimeSubscriptions(loadCallback) {
    if (!supabase) return;
    supabase.channel('ops')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'operational_reports' }, () => {
            loadCallback();
        })
        .subscribe();

    supabase.channel('pers')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'personnel_reports' }, () => {
            loadCallback();
        })
        .subscribe();
}
