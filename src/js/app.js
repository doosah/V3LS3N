// Главный модуль приложения
import { WAREHOUSES, CATEGORIES, PERSONNEL_CATEGORIES } from './config.js';
import { syncToSupabase, loadFromSupabase, setupRealtimeSubscriptions, initSupabase } from './supabase-client.js';
import { parseTimeToMin, cleanOldReports } from './utils.js';
import { renderCalendar } from './calendar.js';
import { loadCategoryInputs, loadPersonnelCategoryInputs, selectYesNo } from './forms.js';
import { generateSummaryTable, generatePersonnelSummaryTable } from './tables.js';
import { exportToExcel } from './excel-export.js';
import { getChatId } from './telegram-bot.js';

// Состояние приложения
let reports = JSON.parse(localStorage.getItem('warehouseReports')) || {};
let personnelReports = JSON.parse(localStorage.getItem('personnelReports')) || {};
let currentDate = new Date();
let warehouseCalendarView = 'week';
let summaryCalendarView = 'month';
let personnelCalendarView = 'week';
let personnelSummaryCalendarView = 'month';
let selectedWarehouseDate = null;
let selectedSummaryDate = null;
let selectedPersonnelDate = null;
let currentWarehouse = '';
let currentPersonnelObj = '';
let summaryCurrentDate = new Date();
let personnelSummaryCurrentDate = new Date();

// Функции чистки
function cleanOldPersonnelReports() {
    cleanOldReports(personnelReports);
    localStorage.setItem('personnelReports', JSON.stringify(personnelReports));
}

// Генерация списков
function generateWarehouseList() {
    const list = document.getElementById('warehouseList');
    if (!list) return;
    list.innerHTML = '';
    WAREHOUSES.forEach(wh => {
        const btn = document.createElement('button');
        btn.className = 'warehouse-btn';
        btn.textContent = wh;
        btn.onclick = () => showWarehouseReport(wh);
        list.appendChild(btn);
    });
}

function generatePersonnelList() {
    const list = document.getElementById('personnelList');
    if (!list) return;
    list.innerHTML = '';
    WAREHOUSES.forEach(obj => {
        const btn = document.createElement('button');
        btn.className = 'warehouse-btn';
        btn.textContent = obj;
        btn.onclick = () => showPersonnelReport(obj);
        list.appendChild(btn);
    });
}

// Выбор отчёта
function selectReport(reportType) {
    document.getElementById('mainSection')?.classList.remove('active');
    currentDate = new Date();

    switch (reportType) {
        case 'operational':
            document.getElementById('warehouseReportSection')?.classList.add('active');
            generateWarehouseList();
            document.querySelector('#warehouseReportSection .date-section')?.classList.add('hidden');
            document.querySelector('#warehouseReportSection .radio-group')?.classList.add('hidden');
            document.querySelector('#warehouseReportSection #reportForm')?.classList.add('hidden');
            break;
        case 'personnel':
            document.getElementById('personnelReportSection')?.classList.add('active');
            generatePersonnelList();
            document.querySelector('#personnelReportSection .date-section')?.classList.add('hidden');
            document.querySelector('#personnelReportSection .radio-group')?.classList.add('hidden');
            document.querySelector('#personnelReportSection #personnelReportForm')?.classList.add('hidden');
            break;
    }
}

// Показ отчёта по складу
function showWarehouseReport(wh) {
    currentWarehouse = wh;
    const title = document.getElementById('warehouseTitle');
    if (title) title.textContent = `📍 ${wh}`;
    
    document.querySelector('#warehouseReportSection .date-section')?.classList.remove('hidden');
    document.querySelector('#warehouseReportSection .radio-group')?.classList.remove('hidden');
    document.querySelector('#warehouseReportSection #reportForm')?.classList.remove('hidden');
    
    selectedWarehouseDate = currentDate.toLocaleDateString('ru-RU');
    const dateDisplay = document.getElementById('selectedWarehouseDate');
    if (dateDisplay) dateDisplay.innerHTML = `<strong>Выбрано:</strong> ${selectedWarehouseDate}`;
    
    renderWarehouseCalendar();
    loadCategoryInputs(reports, currentWarehouse, selectedWarehouseDate, currentDate, warehouseCalendarView);
}

// Показ отчёта по персоналу
function showPersonnelReport(obj) {
    currentPersonnelObj = obj;
    const title = document.getElementById('personnelTitle');
    if (title) title.textContent = `📍 ${obj}`;
    
    document.querySelector('#personnelReportSection .date-section')?.classList.remove('hidden');
    document.querySelector('#personnelReportSection .radio-group')?.classList.remove('hidden');
    document.querySelector('#personnelReportSection #personnelReportForm')?.classList.remove('hidden');
    
    selectedPersonnelDate = currentDate.toLocaleDateString('ru-RU');
    const dateDisplay = document.getElementById('selectedPersonnelDate');
    if (dateDisplay) dateDisplay.innerHTML = `<strong>Выбрано:</strong> ${selectedPersonnelDate}`;
    
    renderPersonnelCalendar();
    loadPersonnelCategoryInputs(personnelReports, currentPersonnelObj, selectedPersonnelDate);
}

// Календарь склада
function renderWarehouseCalendar() {
    renderCalendar('warehouseCalendar', warehouseCalendarView, (date) => {
        currentDate = date;
        selectedWarehouseDate = currentDate.toLocaleDateString('ru-RU');
        const dateDisplay = document.getElementById('selectedWarehouseDate');
        if (dateDisplay) dateDisplay.innerHTML = `<strong>Выбрано:</strong> ${selectedWarehouseDate}`;
        renderWarehouseCalendar();
        loadCategoryInputs(reports, currentWarehouse, selectedWarehouseDate, currentDate, warehouseCalendarView);
    }, currentDate);
    
    const toggleText = document.getElementById('warehouseViewToggleText');
    if (toggleText) toggleText.textContent = warehouseCalendarView === 'week' ? '📅 Неделя' : '📆 Месяц';
}

// Календарь персонала
function renderPersonnelCalendar() {
    renderCalendar('personnelCalendar', personnelCalendarView, (date) => {
        currentDate = date;
        selectedPersonnelDate = currentDate.toLocaleDateString('ru-RU');
        const dateDisplay = document.getElementById('selectedPersonnelDate');
        if (dateDisplay) dateDisplay.innerHTML = `<strong>Выбрано:</strong> ${selectedPersonnelDate}`;
        renderPersonnelCalendar();
        loadPersonnelCategoryInputs(personnelReports, currentPersonnelObj, selectedPersonnelDate);
    }, currentDate);
    
    const toggleText = document.getElementById('personnelViewToggleText');
    if (toggleText) toggleText.textContent = personnelCalendarView === 'week' ? '📅 Неделя' : '📆 Месяц';
}

// Навигация по календарю
function prevPeriod() {
    warehouseCalendarView === 'week' ? currentDate.setDate(currentDate.getDate() - 7) : currentDate.setMonth(currentDate.getMonth() - 1);
    renderWarehouseCalendar();
}

function nextPeriod() {
    warehouseCalendarView === 'week' ? currentDate.setDate(currentDate.getDate() + 7) : currentDate.setMonth(currentDate.getMonth() + 1);
    renderWarehouseCalendar();
}

function toggleCalendarView() {
    warehouseCalendarView = warehouseCalendarView === 'week' ? 'month' : 'week';
    renderWarehouseCalendar();
}

function prevPeriodPersonnel() {
    personnelCalendarView === 'week' ? currentDate.setDate(currentDate.getDate() - 7) : currentDate.setMonth(currentDate.getMonth() - 1);
    renderPersonnelCalendar();
}

function nextPeriodPersonnel() {
    personnelCalendarView === 'week' ? currentDate.setDate(currentDate.getDate() + 7) : currentDate.setMonth(currentDate.getMonth() + 1);
    renderPersonnelCalendar();
}

function toggleCalendarViewPersonnel() {
    personnelCalendarView = personnelCalendarView === 'week' ? 'month' : 'week';
    renderPersonnelCalendar();
}

// Сохранение операционного отчёта
function saveWarehouseReport() {
    if (!selectedWarehouseDate) return alert('⚠️ Выберите дату!');
    if (!currentWarehouse) return alert('⚠️ Выберите склад!');
    
    const type = document.querySelector('input[name="warehouseReportType"]:checked')?.value;
    if (!type) return;

    if (!reports[selectedWarehouseDate]) reports[selectedWarehouseDate] = {};
    if (!reports[selectedWarehouseDate][currentWarehouse]) reports[selectedWarehouseDate][currentWarehouse] = {};
    if (!reports[selectedWarehouseDate][currentWarehouse][type]) reports[selectedWarehouseDate][currentWarehouse][type] = {};

    CATEGORIES.forEach(cat => {
        let data = {};
        if (cat.type === 'number' || cat.type === 'time') {
            const planEl = document.getElementById(`${currentWarehouse}_${type}_${cat.name}_plan`);
            const factEl = document.getElementById(`${currentWarehouse}_${type}_${cat.name}_fact`);
            if (planEl && factEl) {
                const plan = planEl.value.trim();
                const fact = factEl.value.trim();
                let delta = '';
                if (cat.type === 'number') {
                    const p = parseInt(plan) || 0;
                    const f = parseInt(fact) || 0;
                    delta = f - p;
                } else if (cat.type === 'time') {
                    delta = plan && fact ? (parseTimeToMin(plan) && parseTimeToMin(fact) ? (parseTimeToMin(fact) <= parseTimeToMin(plan) ? 'Норма' : 'Отклонение') : 'Неверный формат (ЧЧ:ММ)') : '';
                }
                data = { plan, fact, delta };
            }
        } else if (cat.type === 'single') {
            const valueEl = document.getElementById(`${currentWarehouse}_${type}_${cat.name}_value`);
            if (valueEl) data = { value: valueEl.value.trim() };
        } else if (cat.type === 'triple' || cat.type === 'double') {
            data = {};
            cat.fields.forEach(f => {
                const el = document.getElementById(`${currentWarehouse}_${type}_${cat.name}_${f.n}`);
                if (el) data[f.n] = el.value.trim();
            });
        } else if (cat.type === 'yesno') {
            const valueEl = document.getElementById(`${currentWarehouse}_${type}_${cat.name}_value`);
            if (valueEl) data = { value: valueEl.value.trim() };
        } else if (cat.type === 'select') {
            const valueEl = document.getElementById(`${currentWarehouse}_${type}_${cat.name}_value`);
            if (valueEl) data = { value: valueEl.value.trim() };
        }
        reports[selectedWarehouseDate][currentWarehouse][type][cat.name] = data;
    });

    localStorage.setItem('warehouseReports', JSON.stringify(reports));
    cleanOldReports(reports);
    localStorage.setItem('warehouseReports', JSON.stringify(reports));

    syncToSupabase('operational', selectedWarehouseDate, currentWarehouse, type, reports[selectedWarehouseDate][currentWarehouse][type]);

    alert('✅ Сохранено! Данные доступны в общем своде.');
    backToMain();
}

// Сохранение отчёта по персоналу
function savePersonnelReport() {
    if (!selectedPersonnelDate) return alert('⚠️ Выберите дату!');
    if (!currentPersonnelObj) return alert('⚠️ Выберите объект!');
    
    const type = document.querySelector('input[name="personnelReportType"]:checked')?.value;
    if (!type) return;

    if (!personnelReports[selectedPersonnelDate]) personnelReports[selectedPersonnelDate] = {};
    if (!personnelReports[selectedPersonnelDate][currentPersonnelObj]) personnelReports[selectedPersonnelDate][currentPersonnelObj] = {};
    if (!personnelReports[selectedPersonnelDate][currentPersonnelObj][type]) personnelReports[selectedPersonnelDate][currentPersonnelObj][type] = {};

    PERSONNEL_CATEGORIES.forEach(cat => {
        let data = {};
        if (cat.type === 'number') {
            const planEl = document.getElementById(`${currentPersonnelObj}_${type}_${cat.name}_plan`);
            const factEl = document.getElementById(`${currentPersonnelObj}_${type}_${cat.name}_fact`);
            if (planEl && factEl) {
                data.plan = planEl.value.trim();
                data.fact = factEl.value.trim();
                data.delta = (parseInt(factEl.value) || 0) - (parseInt(planEl.value) || 0);
            }
        } else if (cat.type === 'quadruple' || cat.type === 'triple') {
            data = {};
            cat.fields.forEach(f => {
                const el = document.getElementById(`${currentPersonnelObj}_${type}_${cat.name}_${f.n}`);
                if (el) data[f.n] = el.value.trim();
            });
        } else if (cat.type === 'single' || cat.type === 'text') {
            const valueEl = document.getElementById(`${currentPersonnelObj}_${type}_${cat.name}_value`);
            if (valueEl) data.value = valueEl.value.trim();
        } else if (cat.type === 'select') {
            const valueEl = document.getElementById(`${currentPersonnelObj}_${type}_${cat.name}_value`);
            if (valueEl) data.value = valueEl.value.trim();
        }
        personnelReports[selectedPersonnelDate][currentPersonnelObj][type][cat.name] = data;
    });

    localStorage.setItem('personnelReports', JSON.stringify(personnelReports));
    cleanOldPersonnelReports();

    syncToSupabase('personnel', selectedPersonnelDate, currentPersonnelObj, type, personnelReports[selectedPersonnelDate][currentPersonnelObj][type]);

    alert('✅ Данные сохранены!');
    backToMain();
}

// Сводные таблицы
function updateSummaryTable() {
    if (selectedSummaryDate) showSummaryData();
}

function showSummaryData() {
    if (!selectedSummaryDate) return alert('⚠️ Кликните на дату в календаре!');
    
    const includeDay = document.getElementById('summaryDay')?.checked;
    const includeNight = document.getElementById('summaryNight')?.checked;
    if (!includeDay && !includeNight) return alert('⚠️ Выберите хотя бы один тип отчёта!');
    
    const selectedManager = document.getElementById('managerFilter')?.value || '';
    const dateDisplay = document.getElementById('currentSummaryDate');
    if (dateDisplay) dateDisplay.textContent = selectedSummaryDate;

    document.getElementById('summarySection')?.classList.remove('active');
    document.getElementById('summaryTableSection')?.classList.add('active');

    const tableDiv = document.getElementById('summaryTable');
    if (tableDiv) {
        tableDiv.innerHTML = generateSummaryTable(reports, selectedSummaryDate, includeDay, includeNight, selectedManager);
    }
}

function updatePersonnelSummaryTable() {
    if (selectedSummaryDate) showPersonnelSummaryData();
}

function showPersonnelSummaryData() {
    if (!selectedSummaryDate) return alert('⚠️ Кликните на дату в календаре!');
    
    const includeDay = document.getElementById('personnelSummaryDay')?.checked;
    const includeNight = document.getElementById('personnelSummaryNight')?.checked;
    if (!includeDay && !includeNight) return alert('⚠️ Выберите хотя бы один тип отчёта!');
    
    const selectedManager = document.getElementById('personnelManagerFilter')?.value || '';
    const dateDisplay = document.getElementById('currentPersonnelSummaryDate');
    if (dateDisplay) dateDisplay.textContent = selectedSummaryDate;

    document.getElementById('personnelSummarySection')?.classList.remove('active');
    document.getElementById('personnelSummaryTableSection')?.classList.add('active');

    const tableDiv = document.getElementById('personnelSummaryTable');
    if (tableDiv) {
        tableDiv.innerHTML = generatePersonnelSummaryTable(personnelReports, selectedSummaryDate, includeDay, includeNight, selectedManager);
    }
}

// Навигация по сводным календарям
function showSummarySection() {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.getElementById('summarySection')?.classList.add('active');
    renderSummaryCalendar();
}

function showPersonnelSummarySection() {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.getElementById('personnelSummarySection')?.classList.add('active');
    renderPersonnelSummaryCalendar();
}

function prevPeriodSummary() {
    summaryCalendarView === 'week' ? summaryCurrentDate.setDate(summaryCurrentDate.getDate() - 7) : summaryCurrentDate.setMonth(summaryCurrentDate.getMonth() - 1);
    renderSummaryCalendar();
}

function nextPeriodSummary() {
    summaryCalendarView === 'week' ? summaryCurrentDate.setDate(summaryCurrentDate.getDate() + 7) : summaryCurrentDate.setMonth(summaryCurrentDate.getMonth() + 1);
    renderSummaryCalendar();
}

function toggleCalendarViewSummary() {
    summaryCalendarView = summaryCalendarView === 'week' ? 'month' : 'week';
    const toggleText = document.getElementById('summaryViewToggleText');
    if (toggleText) toggleText.textContent = summaryCalendarView === 'week' ? '📅 Неделя' : '📆 Месяц';
    renderSummaryCalendar();
}

function renderSummaryCalendar() {
    renderCalendar('summaryCalendar', summaryCalendarView, (date) => {
        selectedSummaryDate = date.toLocaleDateString('ru-RU');
    }, summaryCurrentDate);
}

function prevPeriodPersonnelSummary() {
    personnelSummaryCalendarView === 'week' ? personnelSummaryCurrentDate.setDate(personnelSummaryCurrentDate.getDate() - 7) : personnelSummaryCurrentDate.setMonth(personnelSummaryCurrentDate.getMonth() - 1);
    renderPersonnelSummaryCalendar();
}

function nextPeriodPersonnelSummary() {
    personnelSummaryCalendarView === 'week' ? personnelSummaryCurrentDate.setDate(personnelSummaryCurrentDate.getDate() + 7) : personnelSummaryCurrentDate.setMonth(personnelSummaryCurrentDate.getMonth() + 1);
    renderPersonnelSummaryCalendar();
}

function toggleCalendarViewPersonnelSummary() {
    personnelSummaryCalendarView = personnelSummaryCalendarView === 'week' ? 'month' : 'week';
    const toggleText = document.getElementById('personnelSummaryViewToggleText');
    if (toggleText) toggleText.textContent = personnelSummaryCalendarView === 'week' ? '📅 Неделя' : '📆 Месяц';
    renderPersonnelSummaryCalendar();
}

function renderPersonnelSummaryCalendar() {
    renderCalendar('personnelSummaryCalendar', personnelSummaryCalendarView, (date) => {
        selectedSummaryDate = date.toLocaleDateString('ru-RU');
    }, personnelSummaryCurrentDate);
}

// Навигация по дням
function prevSummaryDay() {
    if (!selectedSummaryDate) return;
    const [day, month, year] = selectedSummaryDate.split('.').map(Number);
    const date = new Date(year, month - 1, day);
    date.setDate(date.getDate() - 1);
    selectedSummaryDate = date.toLocaleDateString('ru-RU');
    const dateDisplay = document.getElementById('currentSummaryDate');
    if (dateDisplay) dateDisplay.textContent = selectedSummaryDate;
    showSummaryData();
}

function nextSummaryDay() {
    if (!selectedSummaryDate) return;
    const [day, month, year] = selectedSummaryDate.split('.').map(Number);
    const date = new Date(year, month - 1, day);
    date.setDate(date.getDate() + 1);
    selectedSummaryDate = date.toLocaleDateString('ru-RU');
    const dateDisplay = document.getElementById('currentSummaryDate');
    if (dateDisplay) dateDisplay.textContent = selectedSummaryDate;
    showSummaryData();
}

function prevPersonnelSummaryDay() {
    if (!selectedSummaryDate) return;
    const [day, month, year] = selectedSummaryDate.split('.').map(Number);
    const date = new Date(year, month - 1, day);
    date.setDate(date.getDate() - 1);
    selectedSummaryDate = date.toLocaleDateString('ru-RU');
    const dateDisplay = document.getElementById('currentPersonnelSummaryDate');
    if (dateDisplay) dateDisplay.textContent = selectedSummaryDate;
    showPersonnelSummaryData();
}

function nextPersonnelSummaryDay() {
    if (!selectedSummaryDate) return;
    const [day, month, year] = selectedSummaryDate.split('.').map(Number);
    const date = new Date(year, month - 1, day);
    date.setDate(date.getDate() + 1);
    selectedSummaryDate = date.toLocaleDateString('ru-RU');
    const dateDisplay = document.getElementById('currentPersonnelSummaryDate');
    if (dateDisplay) dateDisplay.textContent = selectedSummaryDate;
    showPersonnelSummaryData();
}

// Полнэкранная таблица
function toggleFullScreen() {
    const fs = document.getElementById('fullScreenTable');
    const tbl = document.getElementById('summaryTable')?.innerHTML;
    if (!fs || !tbl) return;
    
    if (fs.style.display === 'none') {
        document.getElementById('fullSummaryTable').innerHTML = tbl;
        fs.style.display = 'block';
        document.body.style.overflow = 'hidden';
    } else {
        fs.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

function togglePersonnelFullScreen() {
    const fs = document.getElementById('fullPersonnelScreenTable');
    const tbl = document.getElementById('personnelSummaryTable')?.innerHTML;
    if (!fs || !tbl) return;
    
    if (fs.style.display === 'none') {
        document.getElementById('fullPersonnelSummaryTable').innerHTML = tbl;
        fs.style.display = 'block';
        document.body.style.overflow = 'hidden';
    } else {
        fs.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Возврат в главное меню
function backToMain() {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.getElementById('mainSection')?.classList.add('active');
    currentWarehouse = '';
    currentPersonnelObj = '';
    selectedWarehouseDate = null;
    selectedPersonnelDate = null;
    selectedSummaryDate = null;
}

// Экспорт функций в window для inline handlers
window.selectReport = selectReport;
window.backToMain = backToMain;
window.prevPeriod = prevPeriod;
window.nextPeriod = nextPeriod;
window.toggleCalendarView = toggleCalendarView;
window.prevPeriodPersonnel = prevPeriodPersonnel;
window.nextPeriodPersonnel = nextPeriodPersonnel;
window.toggleCalendarViewPersonnel = toggleCalendarViewPersonnel;
window.saveWarehouseReport = saveWarehouseReport;
window.savePersonnelReport = savePersonnelReport;
// selectYesNo уже экспортирован из forms.js и будет доступен через импорт
window.selectYesNo = selectYesNo;
window.updateSummaryTable = updateSummaryTable;
window.showSummaryData = showSummaryData;
window.showSummarySection = showSummarySection;
window.prevPeriodSummary = prevPeriodSummary;
window.nextPeriodSummary = nextPeriodSummary;
window.toggleCalendarViewSummary = toggleCalendarViewSummary;
window.prevSummaryDay = prevSummaryDay;
window.nextSummaryDay = nextSummaryDay;
window.toggleFullScreen = toggleFullScreen;
window.updatePersonnelSummaryTable = updatePersonnelSummaryTable;
window.showPersonnelSummaryData = showPersonnelSummaryData;
window.showPersonnelSummarySection = showPersonnelSummarySection;
window.prevPeriodPersonnelSummary = prevPeriodPersonnelSummary;
window.nextPeriodPersonnelSummary = nextPeriodPersonnelSummary;
window.toggleCalendarViewPersonnelSummary = toggleCalendarViewPersonnelSummary;
window.prevPersonnelSummaryDay = prevPersonnelSummaryDay;
window.nextPersonnelSummaryDay = nextPersonnelSummaryDay;
window.togglePersonnelFullScreen = togglePersonnelFullScreen;

// Функции экспорта
function showExportSection() {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.getElementById('exportSection')?.classList.add('active');
    
    // Заполнение списка складов
    const warehouseSelect = document.getElementById('exportWarehouse');
    if (warehouseSelect) {
        warehouseSelect.innerHTML = '<option value="">Все склады</option>';
        WAREHOUSES.forEach(wh => {
            const option = document.createElement('option');
            option.value = wh;
            option.textContent = wh;
            warehouseSelect.appendChild(option);
        });
    }
}

async function performExport() {
    const filters = {
        dateFrom: document.getElementById('exportDateFrom')?.value || null,
        dateTo: document.getElementById('exportDateTo')?.value || null,
        shiftType: document.getElementById('exportShiftType')?.value || null,
        manager: document.getElementById('exportManager')?.value || null,
        warehouse: document.getElementById('exportWarehouse')?.value || null,
        reportType: document.getElementById('exportReportType')?.value || null
    };
    
    // Собираем все данные из reports и personnelReports
    const allData = [];
    
    console.log('📊 Начало экспорта. Reports keys:', Object.keys(reports).length);
    console.log('📊 PersonnelReports keys:', Object.keys(personnelReports).length);
    
    // Операционные отчеты
    // Структура: reports[date][warehouse][shiftType][category] = data
    Object.keys(reports).forEach(date => {
        if (reports[date] && typeof reports[date] === 'object') {
            Object.keys(reports[date]).forEach(warehouse => {
                if (reports[date][warehouse] && typeof reports[date][warehouse] === 'object') {
                    Object.keys(reports[date][warehouse]).forEach(shiftType => {
                        if (reports[date][warehouse][shiftType] && typeof reports[date][warehouse][shiftType] === 'object') {
                            const reportData = reports[date][warehouse][shiftType];
                            
                            // Проверяем что есть данные
                            const hasData = Object.keys(reportData).length > 0;
                            if (hasData) {
                                // Добавляем данные с категориями как отдельными полями
                                const reportRecord = {
                                    type: 'operational',
                                    date: date,
                                    warehouse: warehouse,
                                    shiftType: shiftType
                                };
                                
                                // Добавляем все категории
                                Object.keys(reportData).forEach(categoryName => {
                                    let categoryValue = reportData[categoryName];
                                    
                                    // Логируем проблемные данные для отладки
                                    if (categoryValue && typeof categoryValue === 'object' && categoryValue.toString && categoryValue.toString() === '[object Object]') {
                                        console.warn(`⚠️ Найден объект без правильной сериализации:`, {
                                            date, warehouse, shiftType, categoryName,
                                            value: categoryValue,
                                            keys: Object.keys(categoryValue)
                                        });
                                    }
                                    
                                    // Проверяем на проблемные данные (строки)
                                    if (categoryValue && typeof categoryValue === 'string' && categoryValue === '[object Object]') {
                                        console.warn(`⚠️ Найдена строка "[object Object]" в операционном отчете:`, {
                                            date, warehouse, shiftType, categoryName
                                        });
                                        categoryValue = null; // Удаляем проблемное значение
                                    }
                                    
                                    // Если значение - строка, пробуем распарсить JSON
                                    if (typeof categoryValue === 'string' && categoryValue !== '[object Object]') {
                                        try {
                                            categoryValue = JSON.parse(categoryValue);
                                        } catch (e) {
                                            // Если не JSON, оставляем как строку
                                        }
                                    }
                                    
                                    // Если это объект, убеждаемся что он правильно структурирован
                                    if (categoryValue && typeof categoryValue === 'object' && !Array.isArray(categoryValue)) {
                                        // Проверяем, что это не просто пустой объект
                                        if (Object.keys(categoryValue).length === 0) {
                                            categoryValue = null;
                                        }
                                    }
                                    
                                    reportRecord[categoryName] = categoryValue;
                                });
                                
                                allData.push(reportRecord);
                                console.log(`📊 Добавлен операционный отчет: ${date}, ${warehouse}, ${shiftType}, категорий: ${Object.keys(reportData).length}`);
                            }
                        }
                    });
                }
            });
        }
    });
    
    // Отчеты по персоналу
    // Структура: personnelReports[date][warehouse][shiftType][category] = data
    Object.keys(personnelReports).forEach(date => {
        if (personnelReports[date] && typeof personnelReports[date] === 'object') {
            Object.keys(personnelReports[date]).forEach(warehouse => {
                if (personnelReports[date][warehouse] && typeof personnelReports[date][warehouse] === 'object') {
                    Object.keys(personnelReports[date][warehouse]).forEach(shiftType => {
                        if (personnelReports[date][warehouse][shiftType] && typeof personnelReports[date][warehouse][shiftType] === 'object') {
                            const reportData = personnelReports[date][warehouse][shiftType];
                            
                            // Проверяем что есть данные
                            const hasData = Object.keys(reportData).length > 0;
                            if (hasData) {
                                // Добавляем данные с категориями как отдельными полями
                                const reportRecord = {
                                    type: 'personnel',
                                    date: date,
                                    warehouse: warehouse,
                                    shiftType: shiftType
                                };
                                
                                // Добавляем все категории
                                Object.keys(reportData).forEach(categoryName => {
                                    let categoryValue = reportData[categoryName];
                                    
                                    // Логируем проблемные данные для отладки
                                    if (categoryValue && typeof categoryValue === 'object' && categoryValue.toString && categoryValue.toString() === '[object Object]') {
                                        console.warn(`⚠️ Найден объект без правильной сериализации:`, {
                                            date, warehouse, shiftType, categoryName,
                                            value: categoryValue,
                                            keys: Object.keys(categoryValue)
                                        });
                                    }
                                    
                                    // Проверяем на проблемные данные (строки)
                                    if (categoryValue && typeof categoryValue === 'string' && categoryValue === '[object Object]') {
                                        console.warn(`⚠️ Найдена строка "[object Object]" в операционном отчете:`, {
                                            date, warehouse, shiftType, categoryName
                                        });
                                        categoryValue = null; // Удаляем проблемное значение
                                    }
                                    
                                    // Если значение - строка, пробуем распарсить JSON
                                    if (typeof categoryValue === 'string' && categoryValue !== '[object Object]') {
                                        try {
                                            categoryValue = JSON.parse(categoryValue);
                                        } catch (e) {
                                            // Если не JSON, оставляем как строку
                                        }
                                    }
                                    
                                    // Если это объект, убеждаемся что он правильно структурирован
                                    if (categoryValue && typeof categoryValue === 'object' && !Array.isArray(categoryValue)) {
                                        // Проверяем, что это не просто пустой объект
                                        if (Object.keys(categoryValue).length === 0) {
                                            categoryValue = null;
                                        }
                                    }
                                    
                                    reportRecord[categoryName] = categoryValue;
                                });
                                
                                allData.push(reportRecord);
                                console.log(`📊 Добавлен отчет персонала: ${date}, ${warehouse}, ${shiftType}, категорий: ${Object.keys(reportData).length}`);
                            }
                        }
                    });
                }
            });
        }
    });
    
    console.log(`📊 Всего собрано записей для экспорта: ${allData.length}`);
    
    // Детальное логирование первых нескольких записей для отладки
    if (allData.length > 0) {
        console.log('📊 Пример первой записи для экспорта:', JSON.stringify(allData[0], null, 2));
        console.log('📊 Ключи первой записи:', Object.keys(allData[0]));
        
        // Проверяем первую запись на проблемные данные
        const firstRecord = allData[0];
        Object.keys(firstRecord).forEach(key => {
            const value = firstRecord[key];
            if (value && typeof value === 'object' && !Array.isArray(value)) {
                console.log(`  - ${key}:`, typeof value, 'keys:', Object.keys(value));
            }
        });
    }
    
    try {
        await exportToExcel(allData, filters);
        alert('✅ Экспорт выполнен успешно!');
    } catch (error) {
        console.error('Ошибка экспорта:', error);
        alert('❌ Ошибка при экспорте. Проверьте консоль.');
    }
}

window.showExportSection = showExportSection;
window.performExport = performExport;

// Функция для получения chat_id (для настройки)
window.getTelegramChatId = async function() {
    const chatId = await getChatId();
    if (chatId) {
        alert(`Chat ID найден: ${chatId}\n\nДобавьте его в src/js/telegram-config.js:\nCHAT_ID: '${chatId}'`);
        console.log('Chat ID:', chatId);
        return chatId;
    } else {
        alert('Chat ID не найден. Отправьте боту сообщение и повторите попытку.');
        return null;
    }
};

// Инициализация
window.addEventListener('DOMContentLoaded', async () => {
    // Инициализируем Supabase после загрузки CDN скрипта
    initSupabase();
    document.querySelectorAll('input[name="warehouseReportType"]').forEach(r => 
        r.addEventListener('change', () => loadCategoryInputs(reports, currentWarehouse, selectedWarehouseDate, currentDate, warehouseCalendarView))
    );
    
    document.querySelectorAll('input[name="personnelReportType"]').forEach(r => 
        r.addEventListener('change', () => loadPersonnelCategoryInputs(personnelReports, currentPersonnelObj, selectedPersonnelDate))
    );

    await loadFromSupabase(reports, personnelReports);
    cleanOldReports(reports);
    localStorage.setItem('warehouseReports', JSON.stringify(reports));
    cleanOldPersonnelReports();
    
    generateWarehouseList();
    generatePersonnelList();
    renderWarehouseCalendar();
    renderPersonnelCalendar();
    renderSummaryCalendar();
    renderPersonnelSummaryCalendar();
    
    setupRealtimeSubscriptions(() => loadFromSupabase(reports, personnelReports));
    
    // Инициализация плашки с информацией о последнем обновлении
    initUpdateBadge();
});

/**
 * Инициализация плашки с информацией о последнем обновлении
 * Дата обновляется автоматически при каждом коммите через git commit date
 */
function initUpdateBadge() {
    const updateBadge = document.getElementById('updateBadge');
    const updateBadgeText = document.getElementById('updateBadgeText');
    
    if (!updateBadge || !updateBadgeText) return;
    
    // Дата последнего обновления функционала
    // Обновляется при каждом функциональном деплое
    // Формат: DD.MM.YYYY HH:mm:ss
    const lastUpdateDate = '06.11.2025 03:33:00';
    
    // Форматируем текст плашки
    updateBadgeText.textContent = `Последнее обновление функционала ${lastUpdateDate}`;
    
    console.log('✅ Плашка обновления инициализирована:', lastUpdateDate);
}
