// ========== APPLICATION CONFIGURATION ==========

// Warehouse configurations
const WAREHOUSES = [
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
];

// Operational report categories
const OPERATIONAL_CATEGORIES = [
    {name: 'Обработка', type: 'number'},
    {name: 'Персонал', type: 'number'},
    {name: 'Окончание выдачи', type: 'time'},
    {name: 'Обработка FBS', type: 'number'},
    {name: 'Возвратный поток (Бэклог)', type: 'number'},
    {name: 'Обезличка', type: 'single', label: 'Поддоны', unit: 'шт'},
    {name: 'Эффективность', type: 'number'},
    {name: 'Кол-во паллета-мест к отгрузке', type: 'triple',
     fields: [{n: 'FBS', u: 'шт'}, {n: 'X-Dock', u: 'шт'}, {n: 'Возвраты', u: 'шт'}]},
    {name: 'Хронь ХД', type: 'double',
     fields: [{n: 'Сорт', u: 'шт'}, {n: 'Нон-Сорт', u: 'шт'}]},
    {name: 'Риски', type: 'yesno'},
    {name: 'Промежуточная Выдача', type: 'single', label: 'Значение', unit: 'шт'},
    {name: '% не профиля', type: 'single', label: 'Процент', unit: '%'},
    {name: 'Руководитель', type: 'select', options: ['Территория 1 Шутин Д.М.', 'Территория 2 Любавкская М.И.']}
];

// Personnel report categories  
const PERSONNEL_CATEGORIES = [
    {name: 'Штат', type: 'number'},
    {name: 'Ozon Job', type: 'quadruple', fields: [{n: 'План', u: ''}, {n: 'Факт', u: ''}, {n: 'Капац.', u: ''}, {n: 'Доля', u: '%'}]},
    {name: 'РВ', type: 'single', label: 'Значение', unit: ''},
    {name: 'Командировка', type: 'single', label: 'Значение', unit: ''},
    {name: 'Total', type: 'number'},
    {name: 'Производительность', type: 'single', label: 'Процент', unit: '%'},
    {name: 'Причины невыхода', type: 'triple', fields: [{n: 'ОТ', u: ''}, {n: 'БЛ', u: ''}, {n: 'НН', u: ''}]},
    {name: 'Комментарии', type: 'text'},
    {name: 'Руководитель', type: 'select', options: ['Территория 1 Шутин Д.М.', 'Территория 2 Любавкская М.И.']}
];

// Application constants
const APP_CONFIG = {
    dataRetentionMonths: 6,
    defaultCalendarView: 'week',
    touchTargetSize: 44,
    animationDuration: 300
};

// Export configuration
window.appConfig = {
    WAREHOUSES,
    OPERATIONAL_CATEGORIES, 
    PERSONNEL_CATEGORIES,
    PERSONNEL_OBJECTS: WAREHOUSES,
    APP_CONFIG
};
