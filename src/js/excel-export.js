// Экспорт данных в Excel

import { WAREHOUSES } from './config.js';

/**
 * Создание Excel файла из данных
 */
export async function exportToExcel(data, filters = {}) {
    // Используем библиотеку SheetJS (xlsx) через CDN
    try {
        // Проверяем, загружена ли библиотека
        if (!window.XLSX) {
            throw new Error('XLSX library not loaded. Please include the script in index.html');
        }
        
        const XLSX = window.XLSX;
        
        // Создание рабочей книги
        const wb = XLSX.utils.book_new();
        
        // Фильтрация данных
        let filteredData = filterData(data, filters);
        
        // Создание листов для каждого типа отчета
        if (filters.reportType === 'operational' || !filters.reportType) {
            const operationalData = filteredData.filter(d => d.type === 'operational');
            if (operationalData.length > 0) {
                const ws = createOperationalSheet(operationalData, XLSX);
                XLSX.utils.book_append_sheet(wb, ws, 'Операционные');
            }
        }
        
        if (filters.reportType === 'personnel' || !filters.reportType) {
            const personnelData = filteredData.filter(d => d.type === 'personnel');
            if (personnelData.length > 0) {
                const ws = createPersonnelSheet(personnelData, XLSX);
                XLSX.utils.book_append_sheet(wb, ws, 'Персонал');
            }
        }
        
        // Сохранение файла
        const fileName = generateFileName(filters);
        XLSX.writeFile(wb, fileName);
        
        return true;
    } catch (error) {
        console.error('Ошибка экспорта в Excel:', error);
        // Fallback: создание CSV
        return exportToCSV(data, filters);
    }
}

/**
 * Фильтрация данных по параметрам
 */
function filterData(data, filters) {
    let filtered = [...data];
    
    // Фильтр по датам
    if (filters.dateFrom) {
        filtered = filtered.filter(d => d.date >= filters.dateFrom);
    }
    if (filters.dateTo) {
        filtered = filtered.filter(d => d.date <= filters.dateTo);
    }
    
    // Фильтр по типу смены
    if (filters.shiftType) {
        filtered = filtered.filter(d => d.shiftType === filters.shiftType);
    }
    
    // Фильтр по руководителю
    if (filters.manager) {
        filtered = filtered.filter(d => d.manager === filters.manager);
    }
    
    // Фильтр по складу
    if (filters.warehouse) {
        filtered = filtered.filter(d => d.warehouse === filters.warehouse);
    }
    
    // Фильтр по типу отчета
    if (filters.reportType) {
        filtered = filtered.filter(d => d.type === filters.reportType);
    }
    
    return filtered;
}

/**
 * Создание листа для операционных отчетов
 */
function createOperationalSheet(data, XLSX) {
    const headers = [
        'Дата', 'Склад', 'Смена', 'Руководитель', 
        'Объем (план)', 'Объем (факт)', 'Отклонение',
        'ХА', 'Риски', 'Примечания'
    ];
    
    const rows = data.map(report => [
        report.date,
        report.warehouse,
        report.shiftType === 'day' ? 'Дневная' : 'Ночная',
        report.manager || '',
        report.volumePlan || 0,
        report.volumeFact || 0,
        (report.volumeFact || 0) - (report.volumePlan || 0),
        report.warehouseCode || '',
        report.hasRisks ? 'Да' : 'Нет',
        report.notes || ''
    ]);
    
    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    
    // Настройка ширины столбцов
    worksheet['!cols'] = [
        { wch: 12 }, // Дата
        { wch: 20 }, // Склад
        { wch: 10 }, // Смена
        { wch: 25 }, // Руководитель
        { wch: 15 }, // Объем (план)
        { wch: 15 }, // Объем (факт)
        { wch: 15 }, // Отклонение
        { wch: 10 }, // ХА
        { wch: 10 }, // Риски
        { wch: 30 }  // Примечания
    ];
    
    return worksheet;
}

/**
 * Создание листа для отчетов по персоналу
 */
function createPersonnelSheet(data, XLSX) {
    const headers = [
        'Дата', 'Склад', 'Смена', 'Руководитель',
        'Штат (план)', 'Штат (факт)', 'Отклонение',
        'Примечания'
    ];
    
    const rows = data.map(report => {
        // Преобразуем данные из структуры personnelReports
        const reportData = report.data || report;
        return [
            report.date,
            report.warehouse,
            report.shiftType === 'day' ? 'Дневная' : 'Ночная',
            reportData.manager || report.manager || '',
            reportData.staffPlan || reportData.personnel || 0,
            reportData.staffFact || reportData.personnel || 0,
            (reportData.staffFact || reportData.personnel || 0) - (reportData.staffPlan || reportData.personnel || 0),
            reportData.notes || ''
        ];
    });
    
    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    
    // Настройка ширины столбцов
    worksheet['!cols'] = [
        { wch: 12 }, // Дата
        { wch: 20 }, // Склад
        { wch: 10 }, // Смена
        { wch: 25 }, // Руководитель
        { wch: 15 }, // Штат (план)
        { wch: 15 }, // Штат (факт)
        { wch: 15 }, // Отклонение
        { wch: 30 }  // Примечания
    ];
    
    return worksheet;
}

/**
 * Генерация имени файла
 */
function generateFileName(filters) {
    const dateFrom = filters.dateFrom || 'all';
    const dateTo = filters.dateTo || 'all';
    const reportType = filters.reportType || 'all';
    
    return `V3LS3N_Export_${reportType}_${dateFrom}_${dateTo}.xlsx`;
}

/**
 * Fallback: экспорт в CSV
 */
function exportToCSV(data, filters) {
    const filtered = filterData(data, filters);
    const csv = convertToCSV(filtered);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', generateFileName(filters).replace('.xlsx', '.csv'));
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    return true;
}

function convertToCSV(data) {
    if (data.length === 0) return '';
    
    const headers = Object.keys(data[0]);
    const rows = data.map(obj => headers.map(header => obj[header] || '').join(','));
    
    return [headers.join(','), ...rows].join('\n');
}

