// Модуль таблиц
import { WAREHOUSES, CATEGORIES, PERSONNEL_CATEGORIES } from './config.js';

export function addRow(date, wh, typeData, typeLabel) {
    let cells = '';
    let volumePlan = 0;
    cells += `<td>${date}</td><td>${wh}</td><td>ХА</td>`;

    CATEGORIES.forEach(cat => {
        const data = typeData[cat.name] || {};
        if (cat.type === 'single') {
            cells += `<td>${data.value || '-'}</td>`;
        } else if (cat.type === 'yesno') {
            const val = data.value || '';
            const isBad = val === 'yes';
            cells += `<td class="${isBad ? 'bad' : (val ? 'good' : '')}">${val ? (isBad ? '❌' : '✅') : '-'}</td>`;
        } else if (cat.type === 'select') {
            cells += `<td>${data.value || '-'}</td>`;
        } else if (cat.type === 'triple') {
            cat.fields.forEach(f => cells += `<td>${data[f.n] || '-'}</td>`);
        } else if (cat.type === 'double') {
            cat.fields.forEach(f => cells += `<td>${data[f.n] || '-'}</td>`);
        } else if (cat.type === 'time') {
            cells += `<td>${data.plan || '-'}</td><td>${data.fact || '-'}</td>`;
            const deltaText = data.delta || '';
            const isGood = deltaText === 'Норма';
            cells += `<td class="${isGood ? 'good' : (deltaText ? 'bad' : '')}">${deltaText ? (isGood ? '✅' : '❌') : '-'}</td>`;
        } else if (cat.type === 'number') {
            cells += `<td>${data.plan || '-'}</td><td>${data.fact || '-'}</td>`;
            const deltaCell = data.delta !== undefined && data.delta !== '' ? data.delta : '-';
            const deltaClass = typeof deltaCell === 'number' ? (deltaCell >= 0 ? 'positive' : 'negative') : '';
            cells += `<td class="${deltaClass}">${deltaCell}</td>`;

            if (cat.name === 'Обработка') {
                const p = parseInt(data.plan) || 0;
                volumePlan += p;
            }
        }
    });

    cells += `<td>${typeLabel}</td>`;
    return { html: `<tr>${cells}</tr>`, volumePlan };
}

export function addPersonnelRow(date, wh, typeData, typeLabel) {
    let cells = '';
    let staffPlan = 0;
    cells += `<td>${date}</td><td>${wh}</td><td>ХА</td>`;

    PERSONNEL_CATEGORIES.forEach(cat => {
        const data = typeData[cat.name] || {};
        if (cat.type === 'number') {
            cells += `<td>${data.plan || '-'}</td><td>${data.fact || '-'}</td>`;
            const deltaCell = data.delta !== undefined && data.delta !== '' ? data.delta : '-';
            const deltaClass = typeof deltaCell === 'number' ? (deltaCell >= 0 ? 'positive' : 'negative') : '';
            cells += `<td class="${deltaClass}">${deltaCell}</td>`;

            if (cat.name === 'Штат') {
                const p = parseInt(data.plan) || 0;
                staffPlan += p;
            }
        } else if (cat.type === 'quadruple' || cat.type === 'triple') {
            cat.fields.forEach(f => cells += `<td>${data[f.n] || '-'}</td>`);
        } else if (cat.type === 'single' || cat.type === 'text') {
            cells += `<td>${data.value || '-'}</td>`;
        } else if (cat.type === 'select') {
            cells += `<td>${data.value || '-'}</td>`;
        }
    });

    cells += `<td>${typeLabel}</td>`;
    return { html: `<tr>${cells}</tr>`, staffPlan };
}

export function generateSummaryTable(reports, selectedSummaryDate, includeDay, includeNight, selectedManager) {
    let html = '<div class="table-wrapper"><table><thead><tr><th>Дата</th><th>Склад</th><th>ХА</th>';
    html += CATEGORIES.map(cat => {
        if (cat.type === 'single' || cat.type === 'yesno' || cat.type === 'select') return `<th>${cat.name}</th>`;
        if (cat.type === 'triple') return `<th colspan="3">${cat.name}</th>`;
        if (cat.type === 'double') return `<th colspan="2">${cat.name}</th>`;
        return `<th colspan="3">${cat.name}</th>`;
    }).join('') + '<th>Тип</th></tr>';

    html += '<tr><th>Дата</th><th>Склад</th><th>ХА</th>';
    html += CATEGORIES.map(cat => {
        if (cat.type === 'single') return `<th>${cat.unit}</th>`;
        if (cat.type === 'triple' || cat.type === 'double') return cat.fields.map(f => `<th>${f.u}</th>`).join('');
        if (cat.type === 'time') return '<th>План</th><th>Факт</th><th>Δ</th>';
        if (cat.type === 'number') return '<th>План</th><th>Факт</th><th>Δ</th>';
        return `<th></th>`;
    }).join('') + '<th>Тип</th></tr></thead><tbody>';

    let totalVolumePlan = 0;
    const warehouseData = reports[selectedSummaryDate] || {};

    WAREHOUSES.forEach(wh => {
        const whData = warehouseData[wh] || {};
        let rowAdded = false;

        if (includeDay && whData.day) {
            const managerValue = whData.day['Руководитель']?.value || '';
            if (!selectedManager || managerValue === selectedManager) {
                const rowData = addRow(selectedSummaryDate, wh, whData.day, '☀️');
                html += rowData.html;
                totalVolumePlan += rowData.volumePlan;
                rowAdded = true;
            }
        }

        if (includeNight && whData.night) {
            const managerValue = whData.night['Руководитель']?.value || '';
            if (!selectedManager || managerValue === selectedManager) {
                const rowData = addRow(selectedSummaryDate, wh, whData.night, '🌙');
                html += rowData.html;
                totalVolumePlan += rowData.volumePlan;
                rowAdded = true;
            }
        }

        if (!rowAdded) {
            let cells = `<td>${selectedSummaryDate}</td><td>${wh}</td><td>ХА</td>`;
            const numCols = CATEGORIES.reduce((acc, cat) => {
                if (cat.type === 'single' || cat.type === 'yesno' || cat.type === 'select' || cat.type === 'time') return acc + 1;
                if (cat.type === 'triple') return acc + 3;
                if (cat.type === 'double') return acc + 2;
                return acc + 3;
            }, 0);
            for (let i = 0; i < numCols; i++) cells += '<td>-</td>';
            cells += '<td>-</td>';
            html += `<tr>${cells}</tr>`;
        }
    });

    html += '</tbody></table></div>';
    const chartIcon = '<svg class="chart-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style="width:1.2em;height:1.2em;display:inline-block;vertical-align:middle;margin-right:5px;"><rect x="3" y="12" width="4" height="8" fill="#ffffff"/><rect x="10" y="18" width="4" height="2" fill="#ffffff"/><rect x="17" y="6" width="4" height="14" fill="#ffffff"/></svg>';
    html += `<div class="summary-total">${chartIcon} Итого по Объёму (план): ${totalVolumePlan}</div>`;
    return html;
}

export function generatePersonnelSummaryTable(personnelReports, selectedSummaryDate, includeDay, includeNight, selectedManager) {
    let html = '<div class="table-wrapper"><table><thead><tr><th>Дата</th><th>Склад</th><th>ХА</th>';
    html += PERSONNEL_CATEGORIES.map(cat => {
        if (cat.type === 'number') return `<th colspan="3">${cat.name}</th>`;
        if (cat.type === 'quadruple') return `<th colspan="4">${cat.name}</th>`;
        if (cat.type === 'triple') return `<th colspan="3">${cat.name}</th>`;
        return `<th>${cat.name}</th>`;
    }).join('') + '<th>Тип</th></tr>';

    html += '<tr><th>Дата</th><th>Склад</th><th>ХА</th>';
    html += PERSONNEL_CATEGORIES.map(cat => {
        if (cat.type === 'number') return '<th>План</th><th>Факт</th><th>Δ</th>';
        if (cat.type === 'quadruple') return cat.fields.map(f => `<th>${f.n}</th>`).join('');
        if (cat.type === 'triple') return cat.fields.map(f => `<th>${f.u}</th>`).join('');
        if (cat.type === 'single') return `<th>${cat.unit}</th>`;
        if (cat.type === 'text') return '<th>Текст</th>';
        return `<th></th>`;
    }).join('') + '<th>Тип</th></tr></thead><tbody>';

    let totalStaffPlan = 0;
    const personnelData = personnelReports[selectedSummaryDate] || {};

    WAREHOUSES.forEach(wh => {
        const objData = personnelData[wh] || {};
        let rowAdded = false;

        if (includeDay && objData.day) {
            const managerValue = objData.day['Руководитель']?.value || '';
            if (!selectedManager || managerValue === selectedManager) {
                const rowData = addPersonnelRow(selectedSummaryDate, wh, objData.day, '☀️');
                html += rowData.html;
                totalStaffPlan += rowData.staffPlan;
                rowAdded = true;
            }
        }

        if (includeNight && objData.night) {
            const managerValue = objData.night['Руководитель']?.value || '';
            if (!selectedManager || managerValue === selectedManager) {
                const rowData = addPersonnelRow(selectedSummaryDate, wh, objData.night, '🌙');
                html += rowData.html;
                totalStaffPlan += rowData.staffPlan;
                rowAdded = true;
            }
        }

        if (!rowAdded) {
            let cells = `<td>${selectedSummaryDate}</td><td>${wh}</td><td>ХА</td>`;
            const numCols = PERSONNEL_CATEGORIES.reduce((acc, cat) => {
                if (cat.type === 'number') return acc + 3;
                if (cat.type === 'quadruple') return acc + 4;
                if (cat.type === 'triple') return acc + 3;
                return acc + 1;
            }, 0);
            for (let i = 0; i < numCols; i++) cells += '<td>-</td>';
            cells += '<td>-</td>';
            html += `<tr>${cells}</tr>`;
        }
    });

    html += '</tbody></table></div>';
    const chartIcon = '<svg class="chart-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style="width:1.2em;height:1.2em;display:inline-block;vertical-align:middle;margin-right:5px;"><rect x="3" y="12" width="4" height="8" fill="#ffffff"/><rect x="10" y="18" width="4" height="2" fill="#ffffff"/><rect x="17" y="6" width="4" height="14" fill="#ffffff"/></svg>';
    html += `<div class="summary-total">${chartIcon} Итого по Штат (план): ${totalStaffPlan}</div>`;
    return html;
}

