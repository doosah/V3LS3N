// Telegram Bot API интеграция

import { TELEGRAM_CONFIG, RESPONSIBLE_PERSONS } from './telegram-config.js';

const BOT_API_URL = `https://api.telegram.org/bot${TELEGRAM_CONFIG.BOT_TOKEN}`;

/**
 * Получение chat_id (для настройки)
 * Отправьте боту любое сообщение, затем вызовите эту функцию
 */
export async function getChatId() {
    try {
        const response = await fetch(`${BOT_API_URL}/getUpdates`);
        const data = await response.json();
        
        if (data.ok && data.result.length > 0) {
            const lastUpdate = data.result[data.result.length - 1];
            const chatId = lastUpdate.message?.chat?.id || lastUpdate.channel_post?.chat?.id;
            
            if (chatId) {
                console.log('Chat ID найден:', chatId);
                return chatId.toString();
            }
        }
        
        console.log('Chat ID не найден. Отправьте боту сообщение и повторите попытку.');
        return null;
    } catch (error) {
        console.error('Ошибка получения chat_id:', error);
        return null;
    }
}

/**
 * Отправка сообщения в Telegram
 */
export async function sendTelegramMessage(text, chatId = TELEGRAM_CONFIG.CHAT_ID) {
    try {
        const response = await fetch(`${BOT_API_URL}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: chatId,
                text: text,
                parse_mode: 'HTML'
            })
        });
        
        const data = await response.json();
        return data.ok;
    } catch (error) {
        console.error('Ошибка отправки в Telegram:', error);
        return false;
    }
}

/**
 * Отправка файла в Telegram
 */
export async function sendTelegramDocument(file, caption = '', chatId = TELEGRAM_CONFIG.CHAT_ID) {
    try {
        const formData = new FormData();
        formData.append('chat_id', chatId);
        formData.append('document', file);
        formData.append('caption', caption);
        
        const response = await fetch(`${BOT_API_URL}/sendDocument`, {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        return data.ok;
    } catch (error) {
        console.error('Ошибка отправки файла в Telegram:', error);
        return false;
    }
}

/**
 * Проверка заполненности отчетов за дату
 */
export function checkReportsFilled(reports, warehouses, date, shiftType) {
    const filled = {};
    const missing = {};
    
    warehouses.forEach(warehouse => {
        const hasReport = reports.some(report => 
            report.warehouse === warehouse &&
            report.date === date &&
            report.shiftType === shiftType
        );
        
        if (hasReport) {
            filled[warehouse] = true;
        } else {
            missing[warehouse] = true;
        }
    });
    
    return { filled, missing };
}

/**
 * Формирование списка незаполненных складов для тегания
 */
export function formatMissingWarehouses(missingWarehouses) {
    if (Object.keys(missingWarehouses).length === 0) {
        return '';
    }
    
    const tags = Object.keys(missingWarehouses)
        .map(warehouse => {
            const username = RESPONSIBLE_PERSONS[warehouse];
            return username ? `${username} (${warehouse})` : warehouse;
        })
        .join(' ');
    
    return tags;
}

/**
 * Отправка напоминания о незаполненных отчетах
 */
export async function sendReminder(date, shiftType, reports, warehouses) {
    const { missing } = checkReportsFilled(reports, warehouses, date, shiftType);
    
    if (Object.keys(missing).length === 0) {
        // Все заполнено - не отправляем напоминание
        return false;
    }
    
    const shiftName = shiftType === 'day' ? 'Дневная' : 'Ночная';
    const tags = formatMissingWarehouses(missing);
    
    const message = `⚠️ <b>Напоминание о незаполненных отчетах</b>\n\n` +
                   `📅 Дата: ${date}\n` +
                   `🌓 Смена: ${shiftName}\n\n` +
                   `❌ Не заполнено:\n${tags}\n\n` +
                   `Пожалуйста, заполните отчеты до 08:00`;
    
    return await sendTelegramMessage(message);
}

/**
 * Отправка итогового отчета
 */
export async function sendFinalReport(date, shiftType, reports, warehouses, summaryData) {
    const shiftName = shiftType === 'day' ? 'Дневная' : 'Ночная';
    const { missing } = checkReportsFilled(reports, warehouses, date, shiftType);
    
    let message = `📊 <b>Итоговый отчет</b>\n\n` +
                 `📅 Дата: ${date}\n` +
                 `🌓 Смена: ${shiftName}\n\n`;
    
    if (Object.keys(missing).length > 0) {
        const tags = formatMissingWarehouses(missing);
        message += `⚠️ <b>Не заполнено:</b>\n${tags}\n\n`;
    } else {
        message += `✅ Все отчеты заполнены\n\n`;
    }
    
    // Добавить сводные данные
    if (summaryData) {
        message += `📈 Сводные данные:\n${summaryData}`;
    }
    
    // Здесь можно добавить отправку файла Excel
    // await sendTelegramDocument(excelFile, message);
    
    return await sendTelegramMessage(message);
}

/**
 * Проверка времени и отправка отчетов
 */
export function scheduleReports() {
    const now = new Date();
    const moscowTime = new Date(now.toLocaleString('en-US', { timeZone: 'Europe/Moscow' }));
    const hours = String(moscowTime.getHours()).padStart(2, '0');
    const minutes = String(moscowTime.getMinutes()).padStart(2, '0');
    const currentTime = `${hours}:${minutes}`;
    
    const today = moscowTime.toISOString().split('T')[0];
    
    // Проверка расписания
    if (currentTime === TELEGRAM_CONFIG.SCHEDULE.DAY.REMINDER) {
        // Напоминание дневной смены
        // TODO: Загрузить отчеты и отправить напоминание
        console.log('Отправка напоминания дневной смены');
    } else if (currentTime === TELEGRAM_CONFIG.SCHEDULE.DAY.FINAL) {
        // Финальный отчет дневной смены
        console.log('Отправка финального отчета дневной смены');
    } else if (currentTime === TELEGRAM_CONFIG.SCHEDULE.NIGHT.REMINDER) {
        // Напоминание ночной смены
        console.log('Отправка напоминания ночной смены');
    } else if (currentTime === TELEGRAM_CONFIG.SCHEDULE.NIGHT.FINAL) {
        // Финальный отчет ночной смены
        console.log('Отправка финального отчета ночной смены');
    }
}

// Проверка каждую минуту
setInterval(scheduleReports, 60000);

