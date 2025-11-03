// ========== UTILITY FUNCTIONS ==========

/**
 * Format date to Russian locale
 */
function formatDate(date) {
    return date.toLocaleDateString('ru-RU');
}

/**
 * Parse date string to Date object
 */
function parseDate(dateStr) {
    const [day, month, year] = dateStr.split('.').map(Number);
    return new Date(year, month - 1, day);
}

/**
 * Parse time string to minutes
 */
function parseTimeToMin(timeStr) {
    if (!timeStr) return NaN;
    const parts = timeStr.split(':');
    if (parts.length !== 2) return NaN;
    const h = parseInt(parts[0]) || 0;
    const m = parseInt(parts[1]) || 0;
    return h * 60 + m;
}

/**
 * Clean old reports from storage
 */
function cleanOldReports(reports, retentionMonths = 6) {
    const cutoffDate = new Date();
    cutoffDate.setMonth(cutoffDate.getMonth() - retentionMonths);
    
    const cleaned = {};
    Object.keys(reports).forEach(dateStr => {
        try {
            const reportDate = parseDate(dateStr);
            if (reportDate >= cutoffDate) {
                cleaned[dateStr] = reports[dateStr];
            }
        } catch (e) {
            // Invalid date format, keep the report
            cleaned[dateStr] = reports[dateStr];
        }
    });
    
    return cleaned;
}

/**
 * Generate test data for new warehouses
 */
function generateTestData() {
    const testReports = {};
    const testPersonnel = {};
    const today = new Date();
    
    // Generate data for last 5 days
    for (let i = 0; i < 5; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const dateStr = formatDate(date);
        
        testReports[dateStr] = {};
        testPersonnel[dateStr] = {};
        
        appConfig.WAREHOUSES.forEach((warehouse, index) => {
            // Operational test data
            testReports[dateStr][warehouse] = {
                day: generateOperationalTestData('day', index),
                night: generateOperationalTestData('night', index)
            };
            
            // Personnel test data  
            testPersonnel[dateStr][warehouse] = {
                day: generatePersonnelTestData('day', index),
                night: generatePersonnelTestData('night', index)
            };
        });
    }
    
    return { operational: testReports, personnel: testPersonnel };
}

/**
 * Generate operational test data
 */
function generateOperationalTestData(shiftType, index) {
    const baseValue = shiftType === 'day' ? 200 : 100;
    const data = {};
    
    appConfig.OPERATIONAL_CATEGORIES.forEach(cat => {
        if (cat.type === 'number') {
            data[cat.name] = {
                plan: String(baseValue + Math.floor(Math.random() * 50) + index * 10),
                fact: String(baseValue + Math.floor(Math.random() * 40) + index * 10),
                delta: 10 + Math.floor(Math.random() * 10)
            };
        } else if (cat.type === 'time') {
            data[cat.name] = {
                plan: shiftType === 'day' ? '12:30' : '03:00',
                fact: shiftType === 'day' ? '12:25' : '03:15',
                delta: shiftType === 'day' ? 'Норма' : 'Отклонение'
            };
        } else if (cat.type === 'single') {
            data[cat.name] = { value: String(10 + Math.floor(Math.random() * 10)) };
        } else if (cat.type === 'triple') {
            const tripleData = {};
            cat.fields.forEach(f => {
                tripleData[f.n] = String(10 + Math.floor(Math.random() * 10));
            });
            data[cat.name] = tripleData;
        } else if (cat.type === 'double') {
            const doubleData = {};
            cat.fields.forEach(f => {
                doubleData[f.n] = String(20 + Math.floor(Math.random() * 15));
            });
            data[cat.name] = doubleData;
        } else if (cat.type === 'yesno') {
            data[cat.name] = { value: Math.random() > 0.3 ? 'no' : 'yes' };
        } else if (cat.type === 'select') {
            data[cat.name] = { 
                value: Math.random() > 0.5 ? 
                    'Территория 1 Шутин Д.М.' : 
                    'Территория 2 Любавкская М.И.' 
            };
        }
    });
    
    return data;
}

/**
 * Generate personnel test data
 */
function generatePersonnelTestData(shiftType, index) {
    const baseValue = shiftType === 'day' ? 20 : 10;
    const data = {};
    
    appConfig.PERSONNEL_CATEGORIES.forEach(cat => {
        if (cat.type === 'number') {
            data[cat.name] = {
                plan: baseValue + Math.floor(Math.random() * 10) + index,
                fact: baseValue + Math.floor(Math.random() * 8) + index,
                delta: Math.floor(Math.random() * 5)
            };
        } else if (cat.type === 'quadruple') {
            const quadData = {};
            cat.fields.forEach((f, i) => {
                const val = baseValue / 2 + Math.floor(Math.random() * 5) + index;
                quadData[f.n] = i === 3 ? 
                    Math.round((val / (baseValue + 5)) * 100) + '%' : 
                    val;
            });
            data[cat.name] = quadData;
        } else if (cat.type === 'single') {
            data[cat.name] = { value: Math.floor(Math.random() * 10) };
        } else if (cat.type === 'triple') {
            const tripleData = {};
            cat.fields.forEach(f => {
                tripleData[f.n] = Math.floor(Math.random() * 3);
            });
            data[cat.name] = tripleData;
        } else if (cat.type === 'text') {
            data[cat.name] = { value: `Тестовые данные для ${shiftType === 'day' ? 'дневной' : 'ночной'} смены` };
        } else if (cat.type === 'select') {
            data[cat.name] = { 
                value: Math.random() > 0.5 ? 
                    'Территория 1 Шутин Д.М.' : 
                    'Территория 2 Любавкская М.И.' 
            };
        }
    });
    
    return data;
}

/**
 * Debounce function for performance
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Export utilities
window.appUtils = {
    formatDate,
    parseDate,
    parseTimeToMin,
    cleanOldReports,
    generateTestData,
    debounce
};
