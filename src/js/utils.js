// Утилиты
export function parseTimeToMin(timeStr) {
    const parts = timeStr.split(':');
    if (parts.length !== 2) return NaN;
    const h = parseInt(parts[0]) || 0;
    const m = parseInt(parts[1]) || 0;
    return h * 60 + m;
}

export function cleanOldReports(reports, months = 6) {
    const cutoffDate = new Date();
    cutoffDate.setMonth(cutoffDate.getMonth() - months);
    const keysToDelete = [];

    Object.keys(reports).forEach(dateStr => {
        try {
            const [day, month, year] = dateStr.split('.').map(Number);
            const reportDate = new Date(year, month - 1, day);
            if (reportDate < cutoffDate) {
                keysToDelete.push(dateStr);
            }
        } catch (e) {
            keysToDelete.push(dateStr);
        }
    });

    keysToDelete.forEach(key => delete reports[key]);
    return reports;
}
