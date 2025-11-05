// Экспорт данных в Excel

import { WAREHOUSES, CATEGORIES, PERSONNEL_CATEGORIES } from './config.js';

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
        
        console.log('📊 Экспорт Excel:', {
            totalRecords: filteredData.length,
            operational: filteredData.filter(d => d.type === 'operational').length,
            personnel: filteredData.filter(d => d.type === 'personnel').length,
            filters
        });
        
        // Проверка на пустые данные
        if (!filteredData || filteredData.length === 0) {
            console.warn('⚠️ Нет данных для экспорта. Проверьте фильтры и наличие данных в системе.');
            alert('⚠️ Нет данных для экспорта. Проверьте фильтры и наличие данных в системе.');
            // Создаем пустой файл с заголовками для примера
            const emptyWs = XLSX.utils.aoa_to_sheet([['Нет данных для экспорта']]);
            XLSX.utils.book_append_sheet(wb, emptyWs, 'Пусто');
            const fileName = generateFileName(filters);
            XLSX.writeFile(wb, fileName);
            return false;
        }
        
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
        
        // Проверка что есть хотя бы один лист
        if (wb.SheetNames.length === 0) {
            throw new Error('Нет данных для экспорта. Проверьте фильтры.');
        }
        
        // Сохранение файла
        const fileName = generateFileName(filters);
        XLSX.writeFile(wb, fileName);
        
        console.log('✅ Excel файл сохранен:', fileName);
        return true;
    } catch (error) {
        console.error('❌ Ошибка экспорта в Excel:', error);
        alert(`❌ Ошибка при экспорте: ${error.message}\n\nПроверьте консоль для подробностей.`);
        // Fallback: создание CSV
        try {
            return exportToCSV(data, filters);
        } catch (csvError) {
            console.error('❌ Ошибка CSV экспорта:', csvError);
            return false;
        }
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
    // Создаем расширенные заголовки с категориями
    const baseHeaders = ['Дата', 'Склад', 'Смена', 'Руководитель'];
    const categoryHeaders = [];
    
    // Добавляем заголовки для всех категорий
    CATEGORIES.forEach(cat => {
        if (cat.type === 'single' || cat.type === 'yesno' || cat.type === 'select') {
            categoryHeaders.push(cat.name);
        } else if (cat.type === 'triple') {
            cat.fields.forEach(f => categoryHeaders.push(`${cat.name} - ${f.n}`));
        } else if (cat.type === 'double') {
            cat.fields.forEach(f => categoryHeaders.push(`${cat.name} - ${f.n}`));
        } else if (cat.type === 'time') {
            categoryHeaders.push(`${cat.name} - План`, `${cat.name} - Факт`, `${cat.name} - Δ`);
        } else if (cat.type === 'number') {
            categoryHeaders.push(`${cat.name} - План`, `${cat.name} - Факт`, `${cat.name} - Δ`);
        }
    });
    
    const headers = [...baseHeaders, ...categoryHeaders];
    
    // Преобразуем данные в строки
    const rows = data.map(report => {
        const row = [
            report.date || '',
            report.warehouse || '',
            report.shiftType === 'day' ? 'Дневная' : (report.shiftType === 'night' ? 'Ночная' : ''),
            report.manager || report['Руководитель']?.value || ''
        ];
        
        // Добавляем данные по категориям
        CATEGORIES.forEach(cat => {
            // report[cat.name] может быть объектом {value, plan, fact} или просто объектом
            const catData = report[cat.name];
            
            // Проверяем что catData существует
            if (!catData || (typeof catData === 'object' && Object.keys(catData).length === 0)) {
                // Пустые данные - добавляем пустые ячейки
                if (cat.type === 'single' || cat.type === 'yesno' || cat.type === 'select') {
                    row.push('');
                } else if (cat.type === 'triple' || cat.type === 'double') {
                    cat.fields.forEach(() => row.push(''));
                } else if (cat.type === 'time' || cat.type === 'number') {
                    row.push('', '', '');
                }
                return;
            }
            
            if (cat.type === 'single') {
                row.push(catData?.value || catData || '');
            } else if (cat.type === 'yesno') {
                const val = catData?.value !== undefined ? catData.value : catData;
                if (val === true || val === 'yes' || val === 'Да') {
                    row.push('Да');
                } else if (val === false || val === 'no' || val === 'Нет') {
                    row.push('Нет');
                } else {
                    row.push('');
                }
            } else if (cat.type === 'select') {
                row.push(catData?.value || catData || '');
            } else if (cat.type === 'triple' || cat.type === 'double') {
                cat.fields.forEach(f => {
                    row.push(catData?.[f.n] || '');
                });
            } else if (cat.type === 'time') {
                row.push(catData?.plan || '', catData?.fact || '', catData?.delta || '');
            } else if (cat.type === 'number') {
                const plan = parseFloat(catData?.plan) || 0;
                const fact = parseFloat(catData?.fact) || 0;
                const delta = fact - plan;
                row.push(plan || '', fact || '', delta || '');
            }
        });
        
        return row;
    });
    
    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    
    // Настройка ширины столбцов
    const colWidths = [
        { wch: 12 }, // Дата
        { wch: 25 }, // Склад
        { wch: 10 }, // Смена
        { wch: 30 }, // Руководитель
    ];
    
    // Добавляем ширины для категорий
    CATEGORIES.forEach(cat => {
        if (cat.type === 'single' || cat.type === 'yesno' || cat.type === 'select') {
            colWidths.push({ wch: 15 });
        } else if (cat.type === 'triple' || cat.type === 'double') {
            cat.fields.forEach(() => colWidths.push({ wch: 15 }));
        } else if (cat.type === 'time' || cat.type === 'number') {
            colWidths.push({ wch: 12 }, { wch: 12 }, { wch: 12 });
        }
    });
    
    worksheet['!cols'] = colWidths;
    
    return worksheet;
}

/**
 * Создание листа для отчетов по персоналу
 */
function createPersonnelSheet(data, XLSX) {
    // Создаем расширенные заголовки с категориями
    const baseHeaders = ['Дата', 'Склад', 'Смена', 'Руководитель'];
    const categoryHeaders = [];
    
    // Добавляем заголовки для всех категорий персонала
    PERSONNEL_CATEGORIES.forEach(cat => {
        if (cat.type === 'single' || cat.type === 'select') {
            categoryHeaders.push(cat.name);
        } else if (cat.type === 'triple') {
            cat.fields.forEach(f => categoryHeaders.push(`${cat.name} - ${f.n}`));
        } else if (cat.type === 'quadruple') {
            cat.fields.forEach(f => categoryHeaders.push(`${cat.name} - ${f.n}`));
        } else if (cat.type === 'number') {
            categoryHeaders.push(`${cat.name} - План`, `${cat.name} - Факт`, `${cat.name} - Δ`);
        } else if (cat.type === 'text') {
            categoryHeaders.push(cat.name);
        }
    });
    
    const headers = [...baseHeaders, ...categoryHeaders];
    
    // Преобразуем данные в строки
    const rows = data.map(report => {
        const row = [
            report.date || '',
            report.warehouse || '',
            report.shiftType === 'day' ? 'Дневная' : (report.shiftType === 'night' ? 'Ночная' : ''),
            report.manager || report['Руководитель']?.value || ''
        ];
        
        // Добавляем данные по категориям
        PERSONNEL_CATEGORIES.forEach(cat => {
            const catData = report[cat.name];
            
            // Проверяем что catData существует
            if (!catData || (typeof catData === 'object' && Object.keys(catData).length === 0)) {
                // Пустые данные - добавляем пустые ячейки
                if (cat.type === 'single' || cat.type === 'select' || cat.type === 'text') {
                    row.push('');
                } else if (cat.type === 'triple' || cat.type === 'quadruple') {
                    cat.fields.forEach(() => row.push(''));
                } else if (cat.type === 'number') {
                    row.push('', '', '');
                }
                return;
            }
            
            if (cat.type === 'single' || cat.type === 'select') {
                row.push(catData?.value || catData || '');
            } else if (cat.type === 'triple' || cat.type === 'quadruple') {
                cat.fields.forEach(f => {
                    row.push(catData?.[f.n] || '');
                });
            } else if (cat.type === 'number') {
                const plan = parseFloat(catData?.plan) || 0;
                const fact = parseFloat(catData?.fact) || 0;
                const delta = fact - plan;
                row.push(plan || '', fact || '', delta || '');
            } else if (cat.type === 'text') {
                row.push(catData?.value || catData?.text || catData || '');
            }
        });
        
        return row;
    });
    
    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    
    // Настройка ширины столбцов
    const colWidths = [
        { wch: 12 }, // Дата
        { wch: 25 }, // Склад
        { wch: 10 }, // Смена
        { wch: 30 }, // Руководитель
    ];
    
    // Добавляем ширины для категорий
    PERSONNEL_CATEGORIES.forEach(cat => {
        if (cat.type === 'single' || cat.type === 'select' || cat.type === 'text') {
            colWidths.push({ wch: 20 });
        } else if (cat.type === 'triple') {
            cat.fields.forEach(() => colWidths.push({ wch: 12 }));
        } else if (cat.type === 'quadruple') {
            cat.fields.forEach(() => colWidths.push({ wch: 12 }));
        } else if (cat.type === 'number') {
            colWidths.push({ wch: 12 }, { wch: 12 }, { wch: 12 });
        }
    });
    
    worksheet['!cols'] = colWidths;
    
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

