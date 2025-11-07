// Главный модуль приложения
import { WAREHOUSES, CATEGORIES, PERSONNEL_CATEGORIES, SHORTAGE_CATEGORIES } from './config.js';
import { syncToSupabase, loadFromSupabase, setupRealtimeSubscriptions, initSupabase } from './supabase-client.js';
import { parseTimeToMin, cleanOldReports } from './utils.js';
import { renderCalendar } from './calendar.js';
import { loadCategoryInputs, loadPersonnelCategoryInputs, selectYesNo } from './forms.js';
import { generateSummaryTable, generatePersonnelSummaryTable, generateShortageSummaryTable } from './tables.js';
import { exportToExcel } from './excel-export.js';
import { getChatId } from './telegram-bot.js';

// Состояние приложения
let reports = JSON.parse(localStorage.getItem('warehouseReports')) || {};
let personnelReports = JSON.parse(localStorage.getItem('personnelReports')) || {};
let shortageReports = JSON.parse(localStorage.getItem('shortageReports')) || {};
let currentDate = new Date();
let warehouseCalendarView = 'week';
let summaryCalendarView = 'month';
let personnelCalendarView = 'week';
let personnelSummaryCalendarView = 'month';
let selectedWarehouseDate = null;
let selectedSummaryDate = null;
let selectedPersonnelDate = null;
let selectedShortageWeek = null;
let selectedShortageYear = null;
let currentWarehouse = '';
let currentPersonnelObj = '';
let currentShortageWarehouse = '';
let summaryCurrentDate = new Date();
let personnelSummaryCurrentDate = new Date();
let shortageWeekUpdateHandler = null; // Для хранения обработчика событий
let selectedShortageSummaryWeek = null;
let selectedShortageSummaryYear = null;
let shortageSummaryInputHandler = null;

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

function generateShortageList() {
    const list = document.getElementById('shortageList');
    if (!list) return;
    list.innerHTML = '';
    WAREHOUSES.forEach(wh => {
        const btn = document.createElement('button');
        btn.className = 'warehouse-btn';
        btn.textContent = wh;
        btn.onclick = () => showShortageReport(wh);
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
        case 'shortage':
            document.getElementById('shortageReportSection')?.classList.add('active');
            document.getElementById('shortageSummarySection')?.classList.remove('active');
            document.getElementById('shortageSummaryTableSection')?.classList.remove('active');
            generateShortageList();
            document.querySelector('#shortageReportSection .week-section')?.classList.add('hidden');
            document.querySelector('#shortageReportSection #shortageReportForm')?.classList.add('hidden');
            selectedShortageSummaryWeek = null;
            selectedShortageSummaryYear = null;
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

// Показ отчёта по недостачам
function showShortageReport(wh) {
    currentShortageWarehouse = wh;
    const title = document.getElementById('shortageTitle');
    if (title) title.textContent = `📍 ${wh} - Еженедельный разбор недостач`;
    
    document.querySelector('#shortageReportSection .week-section')?.classList.remove('hidden');
    document.querySelector('#shortageReportSection #shortageReportForm')?.classList.remove('hidden');
    
    // Инициализация недели и года
    const weekInput = document.getElementById('weekNumber');
    const yearInput = document.getElementById('weekYear');
    if (weekInput && yearInput) {
        const defaults = getDefaultShortageWeekInfo();
        weekInput.value = defaults.week;
        yearInput.value = defaults.year;
        
        selectedShortageWeek = weekInput.value;
        selectedShortageYear = yearInput.value;
        
        const weekDisplay = document.getElementById('selectedWeek');
        if (weekDisplay) weekDisplay.innerHTML = `<strong>Выбрано:</strong> Неделя ${selectedShortageWeek} ${selectedShortageYear} года`;
        
        // Удаляем предыдущие обработчики (если были)
        if (shortageWeekUpdateHandler) {
            weekInput.removeEventListener('input', shortageWeekUpdateHandler);
            yearInput.removeEventListener('input', shortageWeekUpdateHandler);
        }
        
        // Создаем новую функцию обработчика
        shortageWeekUpdateHandler = () => {
            selectedShortageWeek = weekInput.value;
            selectedShortageYear = yearInput.value;
            if (weekDisplay) weekDisplay.innerHTML = `<strong>Выбрано:</strong> Неделя ${selectedShortageWeek} ${selectedShortageYear} года`;
            loadShortageCategoryInputs();
        };
        
        // Добавляем новые обработчики
        weekInput.addEventListener('input', shortageWeekUpdateHandler);
        yearInput.addEventListener('input', shortageWeekUpdateHandler);
    }
    
    loadShortageCategoryInputs();
}

// Функция получения номера недели
function getWeekNumber(date) {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
    return Math.ceil((((d - yearStart) / 86400000) + 1)/7);
}

function getDateFromWeek(year, week) {
    const simple = new Date(Date.UTC(year, 0, 1 + (week - 1) * 7));
    const dow = simple.getUTCDay();
    const weekStart = new Date(simple);
    if (dow <= 4) {
        weekStart.setUTCDate(simple.getUTCDate() - (dow === 0 ? 6 : dow - 1));
    } else {
        weekStart.setUTCDate(simple.getUTCDate() + (8 - dow));
    }
    return new Date(Date.UTC(weekStart.getUTCFullYear(), weekStart.getUTCMonth(), weekStart.getUTCDate()));
}

function getWeeksInYear(year) {
    const lastDay = new Date(Date.UTC(year, 11, 31));
    let week = getWeekNumber(lastDay);
    if (week === 1) {
        const prevWeekDay = new Date(Date.UTC(year, 11, 24));
        week = getWeekNumber(prevWeekDay);
    }
    return week;
}

function getDefaultShortageWeekInfo() {
    const date = new Date();
    date.setDate(date.getDate() - 7);
    const year = date.getFullYear();
    const week = getWeekNumber(date);
    return { week, year };
}

function loadShortageCategoryInputs() {
    if (!currentShortageWarehouse || !selectedShortageWeek || !selectedShortageYear) return;
    
    const weekKey = `${selectedShortageYear}-W${selectedShortageWeek}`;
    const data = shortageReports[weekKey]?.[currentShortageWarehouse] || {};
    
    const div = document.getElementById('shortageCategoryInputs');
    if (!div) return;
    
    div.innerHTML = '';
    
    SHORTAGE_CATEGORIES.forEach(cat => {
        const catData = data[cat.name] || {};
        const cd = document.createElement('div');
        cd.className = 'category-input';
        let html = `<h4>${cat.name}</h4>`;
        
        if (cat.type === 'single') {
            html += `<div><label>${cat.label}${cat.unit ? ` (${cat.unit})` : ''}:</label><input type="number" id="shortage_${currentShortageWarehouse}_${cat.name}_value" placeholder="${cat.label}" inputmode="numeric" value="${catData.value || ''}"></div>`;
        } else if (cat.type === 'text') {
            html += `<div><label>${cat.name}:</label><textarea id="shortage_${currentShortageWarehouse}_${cat.name}_value" placeholder="${cat.name}" rows="3">${catData.value || ''}</textarea></div>`;
        } else if (cat.type === 'select') {
            html += `<div><label>${cat.name}:</label><select id="shortage_${currentShortageWarehouse}_${cat.name}_value"><option value="">-- Не выбрано --</option>`;
            cat.options.forEach(opt => html += `<option value="${opt}" ${catData.value === opt ? 'selected' : ''}>${opt}</option>`);
            html += `</select></div>`;
        }
        
        cd.innerHTML = html;
        div.appendChild(cd);
    });
}

// Сохранение отчёта по недостачам
function saveShortageReport() {
    if (!currentShortageWarehouse || !selectedShortageWeek || !selectedShortageYear) {
        alert('Выберите склад и неделю');
        return;
    }
    
    const weekKey = `${selectedShortageYear}-W${selectedShortageWeek}`;
    if (!shortageReports[weekKey]) shortageReports[weekKey] = {};
    if (!shortageReports[weekKey][currentShortageWarehouse]) shortageReports[weekKey][currentShortageWarehouse] = {};
    
    const reportData = {};
    
    SHORTAGE_CATEGORIES.forEach(cat => {
        const inputId = `shortage_${currentShortageWarehouse}_${cat.name}_value`;
        const input = document.getElementById(inputId);
        if (input) {
            if (cat.type === 'text') {
                reportData[cat.name] = { value: input.value.trim() };
            } else if (cat.type === 'select') {
                reportData[cat.name] = { value: input.value };
            } else {
                const val = input.value.trim();
                reportData[cat.name] = { value: val ? parseFloat(val) : '' };
            }
        }
    });
    
    shortageReports[weekKey][currentShortageWarehouse] = reportData;
    localStorage.setItem('shortageReports', JSON.stringify(shortageReports));
    
    // Синхронизация с Supabase
    syncShortageToSupabase(currentShortageWarehouse, selectedShortageYear, selectedShortageWeek, reportData);
    
    alert('✅ Отчёт сохранён!');
}

async function syncShortageToSupabase(warehouse, year, week, data) {
    try {
        await syncToSupabase('shortage', `${year}-W${week}`, warehouse, null, data);
    } catch (error) {
        console.error('Ошибка синхронизации отчета о недостачах:', error);
    }
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

// Функции для сводной таблицы по недостачам
function showShortageSummarySection() {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.getElementById('shortageSummarySection')?.classList.add('active');

    const weekInput = document.getElementById('shortageSummaryWeekNumber');
    const yearInput = document.getElementById('shortageSummaryWeekYear');
    if (weekInput && yearInput) {
        if (!selectedShortageSummaryWeek || !selectedShortageSummaryYear) {
            const defaults = getDefaultShortageWeekInfo();
            selectedShortageSummaryWeek = String(defaults.week);
            selectedShortageSummaryYear = String(defaults.year);
        }

        weekInput.value = selectedShortageSummaryWeek;
        yearInput.value = selectedShortageSummaryYear;
        updateShortageSummarySelectedDisplay();

        if (shortageSummaryInputHandler) {
            weekInput.removeEventListener('input', shortageSummaryInputHandler);
            yearInput.removeEventListener('input', shortageSummaryInputHandler);
        }

        shortageSummaryInputHandler = () => {
            selectedShortageSummaryWeek = weekInput.value;
            selectedShortageSummaryYear = yearInput.value;
            updateShortageSummarySelectedDisplay();
        };

        weekInput.addEventListener('input', shortageSummaryInputHandler);
        yearInput.addEventListener('input', shortageSummaryInputHandler);
    }
}

function updateShortageSummarySelectedDisplay() {
    const display = document.getElementById('shortageSelectedWeekDisplay');
    if (display) {
        display.innerHTML = `<strong>Выбрано:</strong> Неделя ${selectedShortageSummaryWeek || '-'} ${selectedShortageSummaryYear || ''} года`;
    }
}

async function showShortageSummaryData() {
    const weekInput = document.getElementById('shortageSummaryWeekNumber');
    const yearInput = document.getElementById('shortageSummaryWeekYear');

    if (!weekInput || !yearInput || !weekInput.value || !yearInput.value) {
        alert('Выберите неделю и год');
        return;
    }

    selectedShortageSummaryWeek = weekInput.value;
    selectedShortageSummaryYear = yearInput.value;
    updateShortageSummarySelectedDisplay();

    await updateShortageSummaryTable(parseInt(selectedShortageSummaryYear, 10), parseInt(selectedShortageSummaryWeek, 10));

    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.getElementById('shortageSummaryTableSection')?.classList.add('active');
}

async function updateShortageSummaryTable(year, week) {
    const normalizedWeek = String(week);
    const normalizedYear = String(year);

    const weekDisplay = document.getElementById('currentShortageSummaryWeek');
    if (weekDisplay) weekDisplay.textContent = `Неделя ${normalizedWeek} ${normalizedYear} года`;

    const weekInput = document.getElementById('shortageSummaryWeekNumber');
    const yearInput = document.getElementById('shortageSummaryWeekYear');
    if (weekInput) weekInput.value = normalizedWeek;
    if (yearInput) yearInput.value = normalizedYear;

    selectedShortageSummaryWeek = weekInput ? weekInput.value : normalizedWeek;
    selectedShortageSummaryYear = yearInput ? yearInput.value : normalizedYear;
    updateShortageSummarySelectedDisplay();

    await loadFromSupabase(reports, personnelReports, shortageReports);

    const table = document.getElementById('shortageSummaryTable');
    if (table) {
        const weekKey = `${selectedShortageSummaryYear}-W${selectedShortageSummaryWeek}`;
        table.innerHTML = generateShortageSummaryTable(shortageReports, weekKey);
    }
}

async function prevShortageSummaryWeek() {
    await changeShortageSummaryWeek(-1);
}

async function nextShortageSummaryWeek() {
    await changeShortageSummaryWeek(1);
}

async function changeShortageSummaryWeek(offset) {
    if (!selectedShortageSummaryWeek || !selectedShortageSummaryYear) return;

    let week = parseInt(selectedShortageSummaryWeek, 10);
    let year = parseInt(selectedShortageSummaryYear, 10);

    week += offset;
    let weeksInYear = getWeeksInYear(year);

    if (week < 1) {
        year -= 1;
        weeksInYear = getWeeksInYear(year);
        week = weeksInYear;
    } else if (week > weeksInYear) {
        year += 1;
        week = 1;
    }

    await updateShortageSummaryTable(year, week);
}

// Полнэкранная таблица
function toggleFullScreen(sectionId) {
    if (!sectionId) {
        // Старый способ для обратной совместимости
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
        return;
    }
    
    // Новый способ - работаем с секцией напрямую
    const section = document.getElementById(sectionId);
    if (!section) return;
    
    if (section.classList.contains('fullscreen')) {
        section.classList.remove('fullscreen');
        document.body.style.overflow = 'auto';
    } else {
        section.classList.add('fullscreen');
        document.body.style.overflow = 'hidden';
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

// ============================================
// ЭКСПОРТ ВСЕХ ФУНКЦИЙ В WINDOW ДЛЯ INLINE HANDLERS
// ВАЖНО: Выполняется сразу после определения всех функций, ДО DOMContentLoaded
// ============================================
try {
    // Экспортируем функции немедленно для доступности из inline handlers
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
    window.saveShortageReport = saveShortageReport;
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
    window.showShortageSummarySection = showShortageSummarySection;
    window.showShortageSummaryData = showShortageSummaryData;
    window.prevShortageSummaryWeek = prevShortageSummaryWeek;
    window.nextShortageSummaryWeek = nextShortageSummaryWeek;
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
    
    console.log('✅ Все функции экспортированы в window');
} catch (error) {
    console.error('❌ Ошибка экспорта функций в window:', error);
}

// Инициализация
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Инициализируем Supabase после загрузки CDN скрипта
        initSupabase();
        document.querySelectorAll('input[name="warehouseReportType"]').forEach(r => 
            r.addEventListener('change', () => loadCategoryInputs(reports, currentWarehouse, selectedWarehouseDate, currentDate, warehouseCalendarView))
        );
        
        document.querySelectorAll('input[name="personnelReportType"]').forEach(r => 
            r.addEventListener('change', () => loadPersonnelCategoryInputs(personnelReports, currentPersonnelObj, selectedPersonnelDate))
        );

        // Загружаем данные из Supabase (не блокируем загрузку если ошибка)
               try {
                   await loadFromSupabase(reports, personnelReports, shortageReports);
               } catch (error) {
                   console.error('Ошибка загрузки из Supabase:', error);
               }
        
        cleanOldReports(reports);
        localStorage.setItem('warehouseReports', JSON.stringify(reports));
        cleanOldPersonnelReports();
        
        generateWarehouseList();
        generatePersonnelList();
        generateShortageList();
        renderWarehouseCalendar();
        renderPersonnelCalendar();
        renderSummaryCalendar();
        renderPersonnelSummaryCalendar();
        
               try {
                   setupRealtimeSubscriptions(() => loadFromSupabase(reports, personnelReports, shortageReports));
               } catch (error) {
                   console.error('Ошибка настройки realtime:', error);
               }
        
        // Инициализация плашки с информацией о последнем обновлении
        initUpdateBadge();
        
        console.log('✅ Приложение инициализировано успешно');
    } catch (error) {
        console.error('❌ Критическая ошибка инициализации:', error);
        alert('Ошибка загрузки приложения. Пожалуйста, обновите страницу.');
    }
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
    const lastUpdateDate = '06.11.2025 08:43:48';
    
    // Форматируем текст плашки
    updateBadgeText.textContent = `Последнее обновление функционала ${lastUpdateDate}`;
    
    console.log('✅ Плашка обновления инициализирована:', lastUpdateDate);
}
