// Модуль форм
import { CATEGORIES, PERSONNEL_CATEGORIES } from './config.js';
import { parseTimeToMin } from './utils.js';

export function loadCategoryInputs(reports, currentWarehouse, selectedWarehouseDate, currentDate, warehouseCalendarView) {
    if (!selectedWarehouseDate) return;
    
    const type = document.querySelector('input[name="warehouseReportType"]:checked')?.value;
    if (!type) return;
    
    const div = document.getElementById('categoryInputs');
    if (!div) return;
    
    div.innerHTML = '';
    
    CATEGORIES.forEach(cat => {
        const data = reports[selectedWarehouseDate]?.[currentWarehouse]?.[type]?.[cat.name] || {};
        const cd = document.createElement('div');
        cd.className = 'category-input';
        let html = `<h4>${cat.name}</h4>`;

        if (cat.type === 'number') {
            html += `<div class="input-row"><div><label>План:</label><input type="number" id="${currentWarehouse}_${type}_${cat.name}_plan" placeholder="План" inputmode="numeric" value="${data.plan || ''}"></div><div><label>Факт:</label><input type="number" id="${currentWarehouse}_${type}_${cat.name}_fact" placeholder="Факт" inputmode="numeric" value="${data.fact || ''}"></div></div><div class="delta-display">Дельта: <span id="${currentWarehouse}_${type}_${cat.name}_delta"></span></div>`;
        } else if (cat.type === 'time') {
            html += `<div class="input-row"><div><label>План (ЧЧ:ММ):</label><input type="text" id="${currentWarehouse}_${type}_${cat.name}_plan" placeholder="12:30" value="${data.plan || ''}"></div><div><label>Факт (ЧЧ:ММ):</label><input type="text" id="${currentWarehouse}_${type}_${cat.name}_fact" placeholder="12:25" value="${data.fact || ''}"></div></div><div class="delta-display"><span id="${currentWarehouse}_${type}_${cat.name}_delta"></span></div>`;
        } else if (cat.type === 'single') {
            html += `<div><label>${cat.label} (${cat.unit}):</label><input type="number" id="${currentWarehouse}_${type}_${cat.name}_value" placeholder="${cat.label}" inputmode="numeric" value="${data.value || ''}"></div>`;
        } else if (cat.type === 'triple') {
            html += `<div class="input-triple">`;
            cat.fields.forEach(f => html += `<div><label>${f.n} (${f.u}):</label><input type="number" id="${currentWarehouse}_${type}_${cat.name}_${f.n}" placeholder="${f.n}" inputmode="numeric" value="${data[f.n] || ''}"></div>`);
            html += `</div>`;
        } else if (cat.type === 'double') {
            html += `<div class="input-double">`;
            cat.fields.forEach(f => html += `<div><label>${f.n} (${f.u}):</label><input type="number" id="${currentWarehouse}_${type}_${cat.name}_${f.n}" placeholder="${f.n}" inputmode="numeric" value="${data[f.n] || ''}"></div>`);
            html += `</div>`;
        } else if (cat.type === 'yesno') {
            const val = data.value || '';
            html += `<div class="yesno-buttons"><button type="button" class="yesno-btn yes ${val === 'yes' ? 'selected' : ''}" onclick="selectYesNo('${currentWarehouse}','${type}','${cat.name}','yes',event)">ДА</button><button type="button" class="yesno-btn no ${val === 'no' ? 'selected' : ''}" onclick="selectYesNo('${currentWarehouse}','${type}','${cat.name}','no',event)">НЕТ</button></div><input type="hidden" id="${currentWarehouse}_${type}_${cat.name}_value" value="${val}">`;
        } else if (cat.type === 'select') {
            html += `<div><label>Выберите:</label><select id="${currentWarehouse}_${type}_${cat.name}_value"><option value="">-- Не выбрано --</option>`;
            cat.options.forEach(opt => html += `<option value="${opt}" ${data.value === opt ? 'selected' : ''}>${opt}</option>`);
            html += `</select></div>`;
        }

        cd.innerHTML = html;
        div.appendChild(cd);

        if (cat.type === 'number' || cat.type === 'time') {
            const planEl = document.getElementById(`${currentWarehouse}_${type}_${cat.name}_plan`);
            const factEl = document.getElementById(`${currentWarehouse}_${type}_${cat.name}_fact`);
            const update = () => {
                const plan = planEl.value.trim();
                const fact = factEl.value.trim();
                const span = document.getElementById(`${currentWarehouse}_${type}_${cat.name}_delta`);
                if (!span) return;

                if (cat.type === 'number') {
                    const p = parseInt(plan) || 0;
                    const f = parseInt(fact) || 0;
                    span.textContent = f - p;
                    span.className = (f - p) >= 0 ? 'positive' : 'negative';
                } else if (cat.type === 'time') {
                    if (plan && fact) {
                        const pMin = parseTimeToMin(plan);
                        const fMin = parseTimeToMin(fact);
                        if (!isNaN(pMin) && !isNaN(fMin)) {
                            span.textContent = fMin <= pMin ? 'Норма' : 'Отклонение';
                            span.className = fMin <= pMin ? 'good' : 'bad';
                        } else {
                            span.textContent = 'Неверный формат (ЧЧ:ММ)';
                            span.className = 'bad';
                        }
                    } else {
                        span.textContent = '';
                    }
                }
            };
            planEl.addEventListener('input', update);
            factEl.addEventListener('input', update);
            update();
        }
    });
}

export function loadPersonnelCategoryInputs(personnelReports, currentPersonnelObj, selectedPersonnelDate) {
    if (!selectedPersonnelDate || !currentPersonnelObj) return;
    
    const type = document.querySelector('input[name="personnelReportType"]:checked')?.value;
    if (!type) return;
    
    const div = document.getElementById('personnelCategoryInputs');
    if (!div) return;
    
    div.innerHTML = '';

    PERSONNEL_CATEGORIES.forEach(cat => {
        const data = personnelReports[selectedPersonnelDate]?.[currentPersonnelObj]?.[type]?.[cat.name] || {};
        const cd = document.createElement('div');
        cd.className = 'category-input';
        let html = `<h4>${cat.name}</h4>`;

        if (cat.type === 'number') {
            html += `<div class="input-row"><div><label>План:</label><input type="number" id="${currentPersonnelObj}_${type}_${cat.name}_plan" placeholder="План" value="${data.plan || ''}"></div><div><label>Факт:</label><input type="number" id="${currentPersonnelObj}_${type}_${cat.name}_fact" placeholder="Факт" value="${data.fact || ''}"></div></div><div class="delta-display">Дельта: <span id="${currentPersonnelObj}_${type}_${cat.name}_delta"></span></div>`;
        } else if (cat.type === 'quadruple') {
            html += `<div class="input-row">`;
            cat.fields.forEach((f, i) => {
                html += `<div><label>${f.n} (${f.u}):</label><input type="${i === 3 ? 'text' : 'number'}" id="${currentPersonnelObj}_${type}_${cat.name}_${f.n}" placeholder="${f.n}" value="${data[f.n] || ''}" ${i === 3 ? 'readonly' : ''}></div>`;
            });
            html += `</div>`;
        } else if (cat.type === 'single') {
            html += `<div><label>${cat.label} (${cat.unit}):</label><input type="number" id="${currentPersonnelObj}_${type}_${cat.name}_value" placeholder="${cat.label}" value="${data.value || ''}"></div>`;
        } else if (cat.type === 'triple') {
            html += `<div class="input-row">`;
            cat.fields.forEach(f => {
                html += `<div><label>${f.n} (${f.u}):</label><input type="number" id="${currentPersonnelObj}_${type}_${cat.name}_${f.n}" placeholder="${f.n}" value="${data[f.n] || ''}"></div>`;
            });
            html += `</div>`;
        } else if (cat.type === 'text') {
            html += `<div><label>Комментарии:</label><textarea id="${currentPersonnelObj}_${type}_${cat.name}_value" rows="3">${data.value || ''}</textarea></div>`;
        } else if (cat.type === 'select') {
            html += `<div><label>Выберите:</label><select id="${currentPersonnelObj}_${type}_${cat.name}_value"><option value="">-- Не выбрано --</option>`;
            cat.options.forEach(opt => html += `<option value="${opt}" ${data.value === opt ? 'selected' : ''}>${opt}</option>`);
            html += `</select></div>`;
        }

        cd.innerHTML = html;
        div.appendChild(cd);

        if (cat.type === 'number') {
            const planEl = document.getElementById(`${currentPersonnelObj}_${type}_${cat.name}_plan`);
            const factEl = document.getElementById(`${currentPersonnelObj}_${type}_${cat.name}_fact`);
            const deltaEl = document.getElementById(`${currentPersonnelObj}_${type}_${cat.name}_delta`);
            
            const updateDelta = () => {
                const plan = (parseInt(planEl.value) || 0);
                const fact = (parseInt(factEl.value) || 0);
                const delta = fact - plan;
                deltaEl.textContent = delta;
                deltaEl.className = delta >= 0 ? 'positive' : 'negative';
            };
            
            planEl.addEventListener('input', updateDelta);
            factEl.addEventListener('input', updateDelta);
            updateDelta();
        }
    });

    updateOzonJobShare(currentPersonnelObj, type);
}

function updateOzonJobShare(currentPersonnelObj, type) {
    const ozonFactEl = document.getElementById(`${currentPersonnelObj}_${type}_Ozon Job_Факт`);
    const totalFactEl = document.getElementById(`${currentPersonnelObj}_${type}_Total_fact`);
    const shareEl = document.getElementById(`${currentPersonnelObj}_${type}_Ozon Job_Доля OJ`);
    
    if (!ozonFactEl || !totalFactEl || !shareEl) return;
    
    const update = () => {
        const ozonFact = parseInt(ozonFactEl.value) || 0;
        const totalFact = parseInt(totalFactEl.value) || 0;
        const share = totalFact > 0 ? Math.round((ozonFact / totalFact) * 100) : 0;
        shareEl.value = share.toString();
    };
    
    ozonFactEl.addEventListener('input', update);
    totalFactEl.addEventListener('input', update);
    update();
}

export function selectYesNo(wh, t, cat, val, e) {
    e.preventDefault();
    const inputEl = document.getElementById(`${wh}_${t}_${cat}_value`);
    if (inputEl) inputEl.value = val;
    e.target.parentElement.querySelectorAll('.yesno-btn').forEach(b => b.classList.remove('selected'));
    e.target.classList.add('selected');
}

