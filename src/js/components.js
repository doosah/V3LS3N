// ========== UI COMPONENTS ==========

class ComponentRenderer {
    constructor() {
        this.components = new Map();
    }
    
    // Register a component
    register(name, component) {
        this.components.set(name, component);
    }
    
    // Render a component
    render(name, container, data = {}) {
        if (!this.components.has(name)) {
            console.error('Component not found:', name);
            return;
        }
        
        const component = this.components.get(name);
        container.innerHTML = component.render(data);
        
        // Initialize component if needed
        if (component.init) {
            component.init(container, data);
        }
    }
}

// Initialize component renderer
const componentRenderer = new ComponentRenderer();

// ========== HEADER COMPONENT ==========
const HeaderComponent = {
    render(data = {}) {
        return \`
            <div class="header">
                <div class="header-inner">
                    <img src="assets/img/logo.png" alt="V3LS3N Logo" class="logo">
                    <div class="header-text">
                        <h1>📊 Сводные данные</h1>
                        <div class="subtitle">Система учёта и аналитики складских операций</div>
                    </div>
                </div>
            </div>
        \`;
    }
};

// ========== WAREHOUSE LIST COMPONENT ==========
const WarehouseListComponent = {
    render(data = {}) {
        const { warehouses, onSelect } = data;
        return \`
            <div class="warehouse-list">
                \${warehouses.map(wh => \`
                    <button class="warehouse-btn" onclick="appState.selectWarehouse('\${wh}')">
                        \${wh}
                    </button>
                \`).join('')}
            </div>
        \`;
    }
};

// ========== CALENDAR COMPONENT ==========
const CalendarComponent = {
    render(data = {}) {
        const { view = 'week', currentDate = new Date(), onDateSelect } = data;
        return \`
            <div class="calendar" id="calendar">
                <!-- Calendar will be populated by init method -->
            </div>
        \`;
    },
    
    init(container, data) {
        this.renderCalendar(container, data);
    },
    
    renderCalendar(container, data) {
        const { view, currentDate, onDateSelect } = data;
        const calendar = container.querySelector('#calendar') || container;
        
        // Clear previous content
        calendar.innerHTML = '';
        
        // Add day headers
        const days = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
        days.forEach(day => {
            const header = document.createElement('div');
            header.className = 'calendar-header';
            header.textContent = day;
            calendar.appendChild(header);
        });
        
        // Add date buttons based on view
        if (view === 'week') {
            this.renderWeekView(calendar, currentDate, onDateSelect);
        } else {
            this.renderMonthView(calendar, currentDate, onDateSelect);
        }
    },
    
    renderWeekView(calendar, currentDate, onDateSelect) {
        const monday = new Date(currentDate);
        monday.setDate(monday.getDate() - ((monday.getDay() || 7) - 1));
        
        for (let i = 0; i < 7; i++) {
            const date = new Date(monday);
            date.setDate(monday.getDate() + i);
            
            const button = document.createElement('button');
            button.className = 'date-btn';
            button.textContent = date.getDate();
            button.onclick = () => onDateSelect && onDateSelect(date);
            
            calendar.appendChild(button);
        }
    },
    
    renderMonthView(calendar, currentDate, onDateSelect) {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startDay = firstDay.getDay() || 7;
        
        // Add empty cells for days before month start
        for (let i = 1; i < startDay; i++) {
            const empty = document.createElement('div');
            empty.className = 'date-btn empty';
            empty.textContent = '';
            calendar.appendChild(empty);
        }
        
        // Add days of the month
        for (let day = 1; day <= lastDay.getDate(); day++) {
            const date = new Date(year, month, day);
            const button = document.createElement('button');
            button.className = 'date-btn';
            button.textContent = day;
            button.onclick = () => onDateSelect && onDateSelect(date);
            
            calendar.appendChild(button);
        }
    }
};

// ========== FORM COMPONENT ==========
const FormComponent = {
    render(data = {}) {
        const { categories, values = {}, onSubmit } = data;
        return \`
            <form id="reportForm" onsubmit="event.preventDefault(); appState.saveReport()">
                <div id="categoryInputs">
                    \${this.renderCategories(categories, values)}
                </div>
                <div class="action-buttons">
                    <button type="submit">💾 Сохранить отчёт</button>
                    <button type="button" class="secondary" onclick="appState.backToMain()">
                        ← Назад к выбору отчёта
                    </button>
                </div>
            </form>
        \`;
    },
    
    renderCategories(categories, values) {
        return categories.map(cat => \`
            <div class="category-input">
                <h4>\${cat.name}</h4>
                \${this.renderCategoryInput(cat, values[cat.name] || {})}
            </div>
        \`).join('');
    },
    
    renderCategoryInput(category, value) {
        switch (category.type) {
            case 'number':
                return \`
                    <div class="input-row">
                        <div>
                            <label>План:</label>
                            <input type="number" 
                                   id="\${category.name}_plan" 
                                   value="\${value.plan || ''}" 
                                   placeholder="План">
                        </div>
                        <div>
                            <label>Факт:</label>
                            <input type="number" 
                                   id="\${category.name}_fact" 
                                   value="\${value.fact || ''}" 
                                   placeholder="Факт">
                        </div>
                    </div>
                    <div class="delta-display">
                        Дельта: <span id="\${category.name}_delta">\${value.delta || 0}</span>
                    </div>
                \`;
                
            case 'time':
                return \`
                    <div class="input-row">
                        <div>
                            <label>План (ЧЧ:ММ):</label>
                            <input type="text" 
                                   id="\${category.name}_plan" 
                                   value="\${value.plan || ''}" 
                                   placeholder="12:30">
                        </div>
                        <div>
                            <label>Факт (ЧЧ:ММ):</label>
                            <input type="text" 
                                   id="\${category.name}_fact" 
                                   value="\${value.fact || ''}" 
                                   placeholder="12:25">
                        </div>
                    </div>
                    <div class="delta-display">
                        <span id="\${category.name}_delta">\${value.delta || ''}</span>
                    </div>
                \`;
                
            case 'single':
                return \`
                    <div>
                        <label>\${category.label} (\${category.unit}):</label>
                        <input type="number" 
                               id="\${category.name}_value" 
                               value="\${value.value || ''}" 
                               placeholder="\${category.label}">
                    </div>
                \`;
                
            case 'select':
                return \`
                    <div>
                        <label>Выберите:</label>
                        <select id="\${category.name}_value">
                            <option value="">-- Не выбрано --</option>
                            \${category.options.map(opt => \`
                                <option value="\${opt}" \${value.value === opt ? 'selected' : ''}>
                                    \${opt}
                                </option>
                            \`).join('')}
                        </select>
                    </div>
                \`;
                
            default:
                return \`<div>Тип поля не поддерживается: \${category.type}</div>\`;
        }
    }
};

// Register all components
componentRenderer.register('header', HeaderComponent);
componentRenderer.register('warehouse-list', WarehouseListComponent);
componentRenderer.register('calendar', CalendarComponent);
componentRenderer.register('form', FormComponent);

// Export for use in app
window.componentRenderer = componentRenderer;
