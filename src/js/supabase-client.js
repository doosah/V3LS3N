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

// Синхронизация с Supabase
export async function syncToSupabase(type, date, warehouse, shiftType, data) {
    if (!supabase) return;
    try {
        const tableName = type === 'operational' ? 'operational_reports' : 'personnel_reports';
        await supabase.from(tableName).upsert({
            report_date: date,
            warehouse: warehouse,
            shift_type: shiftType,
            data: data,
            updated_at: new Date().toISOString()
        }, { onConflict: 'report_date,warehouse,shift_type' });
        console.log('✓ Синхронизировано с Supabase');
    } catch (error) {
        console.error('Ошибка синхронизации:', error);
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
