
// Интеграция Supabase
import { supabase, fetchWarehouses } from './supabase-client.js';

async function initSupabase() {
  try {
    const warehouses = await fetchWarehouses();
    console.log('Warehouses from Supabase:', warehouses);
    // Здесь обновите UI с данными
  } catch (error) {
    console.error('Supabase init error:', error);
  }
}

initSupabase();

// Функция для рендеринга складов в UI
function renderWarehouses(warehouses) {
  const listContainer = document.getElementById('warehouseList'); // Замените на реальный ID вашего контейнера
  if (!listContainer) return console.error('Warehouse list container not found');

  listContainer.innerHTML = ''; // Очистка
  warehouses.forEach(warehouse => {
    const item = document.createElement('div');
    item.textContent = warehouse.name; // Предполагаем поле 'name' в DB
    item.classList.add('warehouse-item'); // Добавьте класс для стилей
    listContainer.appendChild(item);
  });
  console.log('Warehouses rendered in UI');
}

// Обновляем initSupabase для вызова render
async function initSupabase() {
  try {
    const warehouses = await fetchWarehouses();
    console.log('Warehouses from Supabase:', warehouses);
    renderWarehouses(warehouses); // Рендерим в UI
  } catch (error) {
    console.error('Supabase init error:', error);
  }
}

initSupabase();
