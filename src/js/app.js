// ========== УПРОЩЕННОЕ ПРИЛОЖЕНИЕ V3LS3N ==========
console.log('🚀 V3LS3N App инициализация...');

class SimpleV3LS3NApp {
    constructor() {
        this.state = {
            currentSection: 'main',
            warehouses: [
                "АРХАНГЕЛЬСК_ХАБ_НАХИМОВА",
                "МУРМАНСК_ХАБ_ОБЪЕЗДНАЯ",
                "ВЕЛИКИЙ_НОВГОРОД_ХАБ_НЕХИНСКАЯ",
                "ПЕТРОЗАВОДСК_ХАБ_ПРЯЖИНСКОЕ",
                "ПСКОВ_ХАБ_МАРГЕЛОВА",
                "ПСКОВ_ХАБ_НОВЫЙ",
                "СЫКТЫВКАР_ХАБ_ЛЕСОПАРКОВАЯ",
                "СЫКТЫВКАР_ХАБ_ОКТЯБРЬСКИЙ",
                "ЧЕРЕПОВЕЦ_ХАБ_СТРОЙИНДУСТРИИ",
                "ВОЛОГДА_ХАБ_БЕЛОЗЕРСКОЕ",
                "СПБ_ХАБ_Осиновая Роща",
                "СПБ_Хаб_Парголово",
                "СПБ_Хаб_Парголово_Блок_3",
                "СПБ_Хаб_Парголово_Блок_4"
            ]
        };
    }
    
    init() {
        console.log('🎯 Инициализация приложения...');
        this.renderApp();
        this.setupEventListeners();
        console.log('✅ Приложение запущено!');
    }
    
    renderApp() {
        const appContainer = document.getElementById('app');
        if (!appContainer) {
            console.error('❌ Контейнер app не найден');
            return;
        }
        
        appContainer.innerHTML = \`
            <div class="container">
                <div class="header">
                    <div class="header-inner">
                        <div class="logo">V3LS3N</div>
                        <div class="header-text">
                            <h1>📊 Сводные данные</h1>
                            <div class="subtitle">Система учёта и аналитики складских операций</div>
                        </div>
                    </div>
                </div>
                
                <div id="mainSection" class="section active">
                    <h2>Выберите отчёт</h2>
                    <button class="large-button" onclick="app.selectReport('operational')">
                        📄 Операционные показатели
                    </button>
                    <button class="large-button" onclick="app.selectReport('personnel')">
                        📊 Персонал
                    </button>
                </div>
                
                <div id="warehouseReportSection" class="section">
                    <h2>📦 Отчёт по складу</h2>
                    <div class="warehouse-list" id="warehouseList"></div>
                    <div class="action-buttons">
                        <button class="secondary" onclick="app.backToMain()">
                            ← Назад к выбору отчёта
                        </button>
                    </div>
                </div>
                
                <div id="summarySection" class="section">
                    <h2>📋 Сводная таблица</h2>
                    <div class="content" style="padding: 20px; background: rgba(255,255,255,0.1); border-radius: 12px;">
                        <p>Функционал сводной таблицы будет доступен после настройки операционных отчётов.</p>
                        <button class="secondary" onclick="app.backToMain()">← Назад</button>
                    </div>
                </div>
            </div>
            
            <div id="console-output" style="position: fixed; bottom: 10px; left: 10px; background: rgba(0,0,0,0.8); color: lime; padding: 10px; border-radius: 5px; font-family: monospace; font-size: 12px; max-width: 300px;">
                <strong>Консоль отладки:</strong>
                <div id="console-messages"></div>
            </div>
        \`;
        
        this.generateWarehouseList();
    }
    
    generateWarehouseList() {
        const listContainer = document.getElementById('warehouseList');
        if (!listContainer) return;
        
        listContainer.innerHTML = '';
        this.state.warehouses.forEach(warehouse => {
            const button = document.createElement('button');
            button.className = 'warehouse-btn';
            button.textContent = warehouse;
            button.onclick = () => this.selectWarehouse(warehouse);
            listContainer.appendChild(button);
        });
    }
    
    selectReport(reportType) {
        this.hideAllSections();
        
        switch(reportType) {
            case 'operational':
                document.getElementById('warehouseReportSection').classList.add('active');
                break;
            case 'personnel':
                // Показываем заглушку для персонала
                this.showMessage('Функционал отчётов по персоналу в разработке');
                break;
        }
        
        this.log(\`Выбран отчёт: \${reportType}\`);
    }
    
    selectWarehouse(warehouse) {
        this.log(\`Выбран склад: \${warehouse}\`);
        this.showMessage(\`Открывается отчёт для склада: \${warehouse}\`);
    }
    
    showSummarySection() {
        this.hideAllSections();
        document.getElementById('summarySection').classList.add('active');
        this.log('Открыта сводная таблица');
    }
    
    backToMain() {
        this.hideAllSections();
        document.getElementById('mainSection').classList.add('active');
        this.log('Возврат в главное меню');
    }
    
    hideAllSections() {
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });
    }
    
    showMessage(message) {
        this.log(message);
        alert(message);
    }
    
    log(message) {
        console.log(message);
        const consoleMessages = document.getElementById('console-messages');
        if (consoleMessages) {
            const messageElement = document.createElement('div');
            messageElement.textContent = \`\${new Date().toLocaleTimeString()}: \${message}\`;
            consoleMessages.appendChild(messageElement);
            consoleMessages.scrollTop = consoleMessages.scrollHeight;
        }
    }
    
    setupEventListeners() {
        // Глобальные горячие клавиши
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch(e.key) {
                    case '1':
                        e.preventDefault();
                        this.backToMain();
                        break;
                    case '2':
                        e.preventDefault();
                        this.selectReport('operational');
                        break;
                }
            }
        });
        
        this.log('Обработчики событий установлены');
    }
}

// Создаем глобальный экземпляр приложения
window.app = new SimpleV3LS3NApp();

// Экспортируем для глобального доступа
window.SimpleV3LS3NApp = SimpleV3LS3NApp;

console.log('✅ V3LS3N App класс загружен');
