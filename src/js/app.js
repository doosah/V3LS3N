// ========== MAIN APPLICATION ==========

class V3LS3NApp {
    constructor() {
        this.state = {
            currentSection: 'main',
            currentWarehouse: '',
            currentPersonnelObj: '',
            selectedDate: new Date(),
            reports: JSON.parse(localStorage.getItem('warehouseReports')) || {},
            personnelReports: JSON.parse(localStorage.getItem('personnelReports')) || {},
            calendarView: 'week'
        };
        
        this.init();
    }
    
    async init() {
        // Load data from Supabase
        await this.loadData();
        
        // Initialize UI
        this.renderApp();
        this.setupEventListeners();
        
        // Initialize Supabase real-time subscriptions
        if (window.supabaseClient) {
            window.supabaseClient.initializeSupabaseSubscriptions(
                (type) => this.onDataChange(type)
            );
        }
        
        console.log('🚀 V3LS3N App initialized');
    }
    
    // Render main application
    renderApp() {
        const appContainer = document.getElementById('app');
        if (!appContainer) return;
        
        appContainer.innerHTML = \`
            <div class="container">
                <div id="header"></div>
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
                    <h2 id="warehouseTitle">Отчёт по складу</h2>
                    <div id="warehouseListContainer"></div>
                    <div class="action-buttons">
                        <button class="secondary large-button" onclick="app.showSummarySection()">
                            📋 Сводная таблица
                        </button>
                        <button class="secondary" onclick="app.backToMain()">
                            ← Назад к выбору отчёта
                        </button>
                    </div>
                </div>
                <!-- Additional sections will be added dynamically -->
            </div>
            <div id="console-output"></div>
        \`;
        
        // Render header
        if (window.componentRenderer) {
            window.componentRenderer.render('header', document.getElementById('header'));
        }
    }
    
    // Setup event listeners
    setupEventListeners() {
        // Global keyboard shortcuts
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
                    case '3':
                        e.preventDefault();
                        this.selectReport('personnel');
                        break;
                }
            }
        });
    }
    
    // Load data from Supabase
    async loadData() {
        if (!window.supabaseClient) {
            console.warn('Supabase client not available, using local storage only');
            return;
        }
        
        try {
            const data = await window.supabaseClient.loadFromSupabase();
            
            // Merge with local data
            if (data.operational.length > 0) {
                data.operational.forEach(item => {
                    if (!this.state.reports[item.report_date]) {
                        this.state.reports[item.report_date] = {};
                    }
                    if (!this.state.reports[item.report_date][item.warehouse]) {
                        this.state.reports[item.report_date][item.warehouse] = {};
                    }
                    this.state.reports[item.report_date][item.warehouse][item.shift_type] = item.data;
                });
            }
            
            if (data.personnel.length > 0) {
                data.personnel.forEach(item => {
                    if (!this.state.personnelReports[item.report_date]) {
                        this.state.personnelReports[item.report_date] = {};
                    }
                    if (!this.state.personnelReports[item.report_date][item.warehouse]) {
                        this.state.personnelReports[item.report_date][item.warehouse] = {};
                    }
                    this.state.personnelReports[item.report_date][item.warehouse][item.shift_type] = item.data;
                });
            }
            
            // Clean old reports
            this.cleanOldData();
            
            console.log('✓ Data loaded successfully');
        } catch (error) {
            console.error('❌ Error loading data:', error);
        }
    }
    
    // Clean old data
    cleanOldData() {
        if (window.appUtils) {
            this.state.reports = window.appUtils.cleanOldReports(this.state.reports);
            this.state.personnelReports = window.appUtils.cleanOldReports(this.state.personnelReports);
            
            // Save cleaned data
            localStorage.setItem('warehouseReports', JSON.stringify(this.state.reports));
            localStorage.setItem('personnelReports', JSON.stringify(this.state.personnelReports));
        }
    }
    
    // Handle data changes from Supabase
    onDataChange(type) {
        console.log(\`Data changed: \${type}\`);
        this.loadData(); // Reload data
        
        // Update UI if needed
        if (this.state.currentSection.includes('summary')) {
            this.updateSummaryTables();
        }
    }
    
    // Navigation methods
    selectReport(reportType) {
        this.hideAllSections();
        
        switch(reportType) {
            case 'operational':
                this.showOperationalReport();
                break;
            case 'personnel':
                this.showPersonnelReport();
                break;
        }
    }
    
    showOperationalReport() {
        document.getElementById('warehouseReportSection').classList.add('active');
        
        if (window.componentRenderer && window.appConfig) {
            window.componentRenderer.render(
                'warehouse-list', 
                document.getElementById('warehouseListContainer'), 
                { 
                    warehouses: window.appConfig.WAREHOUSES,
                    onSelect: (warehouse) => this.selectWarehouse(warehouse)
                }
            );
        }
    }
    
    showPersonnelReport() {
        // Similar implementation for personnel reports
        console.log('Personnel report selected');
    }
    
    selectWarehouse(warehouse) {
        this.state.currentWarehouse = warehouse;
        // Show date selection and form for the selected warehouse
        this.showWarehouseForm(warehouse);
    }
    
    showWarehouseForm(warehouse) {
        // Implementation for showing warehouse form
        console.log('Selected warehouse:', warehouse);
    }
    
    showSummarySection() {
        // Implementation for summary section
        console.log('Show summary section');
    }
    
    backToMain() {
        this.hideAllSections();
        document.getElementById('mainSection').classList.add('active');
        this.state.currentWarehouse = '';
        this.state.currentPersonnelObj = '';
    }
    
    hideAllSections() {
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });
    }
    
    // Save report method
    async saveReport() {
        // Implementation for saving reports
        console.log('Saving report...');
        
        // Sync with Supabase if available
        if (window.supabaseClient) {
            // await window.supabaseClient.syncToSupabase(...);
        }
    }
    
    // Update summary tables
    updateSummaryTables() {
        // Implementation for updating summary tables
    }
}

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new V3LS3NApp();
});

// Global error handler
window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
});

// Export app for global access
window.V3LS3NApp = V3LS3NApp;
