// Экспорт данных в Excel

import { WAREHOUSES, CATEGORIES, PERSONNEL_CATEGORIES } from './config.js';

/**
 * Создание Excel файла из данных
 */
export async function exportToExcel(data, filters = {}) {
    // Используем библиотеку SheetJS (xlsx) через CDN
    try {
        // Проверяем, загружена ли библиотека (ждем немного, если еще не загрузилась)
        let XLSX = window.XLSX;
        
        if (!XLSX) {
            // Ждем до 3 секунд пока библиотека загрузится
            for (let i = 0; i < 30; i++) {
                await new Promise(resolve => setTimeout(resolve, 100));
                if (window.XLSX) {
                    XLSX = window.XLSX;
                    break;
                }
            }
            
            if (!XLSX) {
                throw new Error('XLSX library not loaded. Please check if the script is included in index.html');
            }
        }
        
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
        
        // Настройка опций для правильной кодировки UTF-8
        const writeOptions = {
            type: 'binary',
            bookType: 'xlsx',
            cellStyles: true,
            bookSST: false
        };
        
        // Используем writeFile с опциями для правильной кодировки
        XLSX.writeFile(wb, fileName, writeOptions);
        
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
 * Преобразование даты из YYYY-MM-DD в DD.MM.YYYY
 */
function formatDateForExport(dateStr) {
    if (!dateStr) return '';
    
    // Если дата уже в формате DD.MM.YYYY, возвращаем как есть
    if (/^\d{2}\.\d{2}\.\d{4}$/.test(dateStr)) {
        return dateStr;
    }
    
    // Преобразуем из YYYY-MM-DD в DD.MM.YYYY
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
        const parts = dateStr.split('-');
        return `${parts[2]}.${parts[1]}.${parts[0]}`;
    }
    
    return dateStr;
}

/**
 * Извлечение значения из объекта категории с обработкой разных форматов
 */
function extractCategoryValue(catData, catType) {
    if (catData === null || catData === undefined) return null;
    
    // Если данные - строка, пробуем распарсить JSON
    if (typeof catData === 'string') {
        // Если это строка "[object Object]", значит объект был неправильно сериализован
        if (catData === '[object Object]') {
            return null;
        }
        try {
            const parsed = JSON.parse(catData);
            return parsed;
        } catch (e) {
            // Если не JSON, возвращаем как есть
            return catData;
        }
    }
    
    // Если не объект, возвращаем как есть
    if (typeof catData !== 'object') {
        return catData;
    }
    
    // Если это массив, возвращаем как есть (будет обработан отдельно)
    if (Array.isArray(catData)) {
        return catData;
    }
    
    // Для разных типов категорий извлекаем значения по-разному
    if (catType === 'single' || catType === 'select') {
        return catData.value !== undefined ? catData.value : catData;
    } else if (catType === 'yesno') {
        const val = catData.value !== undefined ? catData.value : catData;
        if (val === true || val === 'yes' || val === 'Да') return 'Да';
        if (val === false || val === 'no' || val === 'Нет') return 'Нет';
        return '';
    } else if (catType === 'triple' || catType === 'double' || catType === 'quadruple') {
        // Возвращаем объект как есть, его поля будут обработаны отдельно
        return catData;
    } else if (catType === 'time' || catType === 'number') {
        return catData; // Возвращаем объект с plan, fact, delta
    } else if (catType === 'text') {
        return catData.value !== undefined ? catData.value : (catData.text !== undefined ? catData.text : catData);
    }
    
    return catData;
}

/**
 * Безопасное преобразование значения в строку для Excel
 */
function safeStringify(value) {
    if (value === null || value === undefined) return '';
    
    // Если это строка "[object Object]", значит объект был неправильно сериализован
    if (typeof value === 'string' && value === '[object Object]') {
        return '';
    }
    
    // Если это объект, пробуем извлечь значение
    if (typeof value === 'object' && !Array.isArray(value)) {
        // Если в объекте есть поле value, используем его
        if (value.value !== undefined) {
            return String(value.value);
        }
        // Если это обычный объект без value, возвращаем пустую строку
        if (Object.keys(value).length === 0) {
            return '';
        }
        // Пробуем найти первое примитивное значение
        for (const key in value) {
            if (value[key] !== null && value[key] !== undefined && typeof value[key] !== 'object') {
                return String(value[key]);
            }
        }
        return '';
    }
    
    return String(value);
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
        // Форматируем дату
        const formattedDate = formatDateForExport(report.date);
        
        // Извлекаем значение руководителя
        let managerValue = '';
        if (report.manager) {
            managerValue = typeof report.manager === 'string' ? report.manager : report.manager;
        } else if (report['Руководитель']) {
            const managerData = extractCategoryValue(report['Руководитель'], 'select');
            managerValue = typeof managerData === 'string' ? managerData : (managerData?.value || '');
        }
        
        const row = [
            formattedDate,
            report.warehouse || '',
            report.shiftType === 'day' ? 'Дневная' : (report.shiftType === 'night' ? 'Ночная' : ''),
            managerValue
        ];
        
        // Добавляем данные по категориям
        CATEGORIES.forEach(cat => {
            let catData = report[cat.name];
            
            // Логируем проблемные данные для отладки
            if (catData && typeof catData === 'string' && catData === '[object Object]') {
                console.warn(`⚠️ Найдена строка "[object Object]" для категории ${cat.name}:`, report);
            }
            
            // Извлекаем значение с правильной обработкой
            catData = extractCategoryValue(catData, cat.type);
            
            // Проверяем что catData существует
            if (!catData || (typeof catData === 'object' && Object.keys(catData).length === 0 && !Array.isArray(catData))) {
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
                const value = typeof catData === 'object' ? (catData.value !== undefined ? catData.value : '') : catData;
                row.push(safeStringify(value));
            } else if (cat.type === 'yesno') {
                const val = typeof catData === 'object' ? (catData.value !== undefined ? catData.value : catData) : catData;
                if (val === true || val === 'yes' || val === 'Да' || val === true) {
                    row.push('Да');
                } else if (val === false || val === 'no' || val === 'Нет' || val === false) {
                    row.push('Нет');
                } else {
                    row.push('');
                }
            } else if (cat.type === 'select') {
                const value = typeof catData === 'object' ? (catData.value !== undefined ? catData.value : '') : catData;
                row.push(safeStringify(value));
            } else if (cat.type === 'triple' || cat.type === 'double') {
                // Проверяем, что catData - объект
                if (typeof catData === 'object' && catData !== null && !Array.isArray(catData)) {
                    cat.fields.forEach(f => {
                        const fieldValue = catData[f.n] !== undefined ? catData[f.n] : null;
                        row.push(safeStringify(fieldValue));
                    });
                } else {
                    cat.fields.forEach(() => row.push(''));
                }
            } else if (cat.type === 'time') {
                const plan = (typeof catData === 'object' && catData !== null && !Array.isArray(catData)) ? (catData.plan || '') : '';
                const fact = (typeof catData === 'object' && catData !== null && !Array.isArray(catData)) ? (catData.fact || '') : '';
                const delta = (typeof catData === 'object' && catData !== null && !Array.isArray(catData)) ? (catData.delta || '') : '';
                row.push(safeStringify(plan), safeStringify(fact), safeStringify(delta));
            } else if (cat.type === 'number') {
                const plan = (typeof catData === 'object' && catData !== null && !Array.isArray(catData)) ? (parseFloat(catData.plan) || 0) : 0;
                const fact = (typeof catData === 'object' && catData !== null && !Array.isArray(catData)) ? (parseFloat(catData.fact) || 0) : 0;
                const delta = fact - plan;
                row.push(plan !== 0 ? String(plan) : '', fact !== 0 ? String(fact) : '', delta !== 0 ? String(delta) : '');
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
        // Форматируем дату
        const formattedDate = formatDateForExport(report.date);
        
        // Извлекаем значение руководителя
        let managerValue = '';
        if (report.manager) {
            managerValue = typeof report.manager === 'string' ? report.manager : report.manager;
        } else if (report['Руководитель']) {
            const managerData = extractCategoryValue(report['Руководитель'], 'select');
            managerValue = typeof managerData === 'string' ? managerData : (managerData?.value || '');
        }
        
        const row = [
            formattedDate,
            report.warehouse || '',
            report.shiftType === 'day' ? 'Дневная' : (report.shiftType === 'night' ? 'Ночная' : ''),
            managerValue
        ];
        
        // Добавляем данные по категориям
        PERSONNEL_CATEGORIES.forEach(cat => {
            let catData = report[cat.name];
            
            // Извлекаем значение с правильной обработкой
            catData = extractCategoryValue(catData, cat.type);
            
            // Проверяем что catData существует
            if (!catData || (typeof catData === 'object' && Object.keys(catData).length === 0 && !Array.isArray(catData))) {
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
                const value = typeof catData === 'object' ? (catData.value !== undefined ? catData.value : '') : catData;
                row.push(safeStringify(value));
            } else if (cat.type === 'triple' || cat.type === 'quadruple') {
                // Проверяем, что catData - объект
                if (typeof catData === 'object' && catData !== null && !Array.isArray(catData)) {
                    cat.fields.forEach(f => {
                        const fieldValue = catData[f.n] !== undefined ? catData[f.n] : null;
                        row.push(safeStringify(fieldValue));
                    });
                } else {
                    cat.fields.forEach(() => row.push(''));
                }
            } else if (cat.type === 'number') {
                const plan = (typeof catData === 'object' && catData !== null && !Array.isArray(catData)) ? (parseFloat(catData.plan) || 0) : 0;
                const fact = (typeof catData === 'object' && catData !== null && !Array.isArray(catData)) ? (parseFloat(catData.fact) || 0) : 0;
                const delta = fact - plan;
                row.push(plan !== 0 ? String(plan) : '', fact !== 0 ? String(fact) : '', delta !== 0 ? String(delta) : '');
            } else if (cat.type === 'text') {
                const value = typeof catData === 'object' && !Array.isArray(catData) ? 
                    (catData.value !== undefined ? catData.value : (catData.text !== undefined ? catData.text : '')) : 
                    catData;
                row.push(safeStringify(value));
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

