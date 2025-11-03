// ========== УПРОЩЕННОЕ ПРИЛОЖЕНИЕ V3LS3N ==========
console.log('🚀 V3LS3N App инициализация...');

class SimpleV3LS3NApp {
    constructor() {
        console.log('🎯 Конструктор V3LS3N App...');
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
        
        // Автоматически инициализируем при создании
        this.initialize();
    }
    
    initialize() {
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
                    
                    <div style="margin-top: 30px; padding: 15px; background: rgba(255,255,255,0.1); border-radius: 8px;">
                        <h3>📈 Статус системы</h3>
                        <p>✅ JavaScript работает</p>
                        <p>✅ Стили загружены</p>
                        <p>✅ Навигация активна</p>
                    </div>
                </div>
                
                <div id="warehouseReportSection" class="section">
                    <h2>📦 Отчёт по складу</h2>
                    <div class="warehouse-list" id="warehouseList"></div>
                    <div class="action-buttons">
                        <button class="secondary large-button" onclick="app.showSummarySection()">
                            📋 Сводная таблица
                        </button>
                        <button class="secondary" onclick="app.backToMain()">
                            ← Назад к выбору отчёта
                        </button>
                    </div>
                </div>
                
                <div id="summarySection" class="section">
                    <h2>📊 Сводная таблица</h2>
                    <div class="content" style="padding: 20px; background: rgba(255,255,255,0.1); border-radius: 12px;">
                        <h3>Данные по всем складам</h3>
                        <p>Здесь будет отображаться общая сводка по операционным показателям.</p>
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-top: 20px;">
                            <div style="background: rgba(102,126,234,0.3); padding: 15px; border-radius: 8px; text-align: center;">
                                <div style="font-size: 24px;">14</div>
                                <div>Складов</div>
                            </div>
                            <div style="background: rgba(67,233,123,0.3); padding: 15px; border-radius: 8px; text-align: center;">
                                <div style="font-size: 24px;">28</div>
                                <div>Смен</div>
                            </div>
                            <div style="background: rgba(250,112,154,0.3); padding: 15px; border-radius: 8px; text-align: center;">
                                <div style="font-size: 24px;">2</div>
                                <div>Руководителя</div>
                            </div>
                        </div>
                        <button class="secondary" style="margin-top: 20px;" onclick="app.backToMain()">← Назад</button>
                    </div>
                </div>
            </div>
            
            <div id="console-output" style="position: fixed; bottom: 10px; left: 10px; background: rgba(0,0,0,0.8); color: lime; padding: 10px; border-radius: 5px; font-family: monospace; font-size: 12px; max-width: 300px; max-height: 150px; overflow-y: auto;">
                <strong>Консоль отладки:</strong>
                <div id="console-messages"></div>
            </div>
        \`;
        
        this.generateWarehouseList();
        this.log('Приложение отрендерено');
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
        
        this.log(\`Сгенерирован список из \${this.state.warehouses.length} складов\`);
    }
    
    selectReport(reportType) {
        this.hideAllSections();
        
        switch(reportType) {
            case 'operational':
                document.getElementById('warehouseReportSection').classList.add('active');
                this.log('Выбран операционный отчёт');
                break;
            case 'personnel':
                this.showMessage('Функционал отчётов по персоналу в разработке');
                this.log('Выбран отчёт по персоналу (в разработке)');
                break;
        }
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
        // Временное уведомление
        const notification = document.createElement('div');
        notification.style.cssText = 'position: fixed; top: 20px; right: 20px; background: #667eea; color: white; padding: 15px; border-radius: 8px; z-index: 1000;';
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 3000);
    }
    
    log(message) {
        console.log(\`[V3LS3N] \${message}\`);
        const consoleMessages = document.getElementById('console-messages');
        if (consoleMessages) {
            const messageElement = document.createElement('div');
            messageElement.textContent = \`\${new Date().toLocaleTimeString()}: \${message}\`;
            consoleMessages.appendChild(messageElement);
            consoleMessages.scrollTop = consoleMessages.scrollHeight;
            
            // Ограничиваем количество сообщений
            if (consoleMessages.children.length > 10) {
                consoleMessages.removeChild(consoleMessages.firstChild);
            }
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

// Автоматически создаем и инициализируем приложение при загрузке
console.log('🔄 Создание экземпляра V3LS3N App...');
window.app = new SimpleV3LS3NApp();

// Экспортируем для глобального доступа
window.SimpleV3LS3NApp = SimpleV3LS3NApp;

console.log('✅ V3LS3N App полностью загружен и инициализирован');
