// ========== SUPABASE CLIENT CONFIGURATION ==========
const SUPABASE_URL = 'https://hpjrjpxctmlttdwqrpvc.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhwanJqcHhjdG1sdHRkd3FycHZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwNzAxMzIsImV4cCI6MjA3NzY0NjEzMn0.jgJD4uKiLoW6MPw5yMrsoYlguowcnn5tl9pKeib7tcs';

// Initialize Supabase client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ========== SUPABASE DATABASE FUNCTIONS ==========

/**
 * Sync operational report to Supabase
 */
async function syncToSupabase(type, date, warehouse, shiftType, data) {
    try {
        const tableName = type === 'operational' ? 'operational_reports' : 'personnel_reports';
        const { error } = await supabase.from(tableName).upsert({
            report_date: date,
            warehouse: warehouse,
            shift_type: shiftType,
            data: data,
            updated_at: new Date().toISOString()
        }, { onConflict: 'report_date,warehouse,shift_type' });
        
        if (error) throw error;
        console.log('✓ Данные синхронизированы с Supabase');
        return true;
    } catch (error) {
        console.error('❌ Ошибка синхронизации с Supabase:', error);
        return false;
    }
}

/**
 * Load all reports from Supabase
 */
async function loadFromSupabase() {
    try {
        // Load operational reports
        const { data: ops, error: opsError } = await supabase
            .from('operational_reports')
            .select('*');
            
        if (opsError) throw opsError;
        
        // Load personnel reports  
        const { data: pers, error: persError } = await supabase
            .from('personnel_reports')
            .select('*');
            
        if (persError) throw persError;
        
        return {
            operational: ops || [],
            personnel: pers || []
        };
    } catch (error) {
        console.error('❌ Ошибка загрузки данных из Supabase:', error);
        return { operational: [], personnel: [] };
    }
}

/**
 * Initialize real-time subscriptions
 */
function initializeSupabaseSubscriptions(onDataChange) {
    // Operational reports subscription
    supabase
        .channel('operational-reports')
        .on('postgres_changes', 
            { event: '*', schema: 'public', table: 'operational_reports' }, 
            () => onDataChange('operational')
        )
        .subscribe();
    
    // Personnel reports subscription
    supabase
        .channel('personnel-reports')
        .on('postgres_changes', 
            { event: '*', schema: 'public', table: 'personnel_reports' }, 
            () => onDataChange('personnel')
        )
        .subscribe();
}

// Export for use in other modules
window.supabaseClient = {
    supabase,
    syncToSupabase,
    loadFromSupabase,
    initializeSupabaseSubscriptions
};
