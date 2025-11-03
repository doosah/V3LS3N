// Модуль календаря
export function renderCalendar(calendarId, view, onSelect, current) {
    const cal = document.getElementById(calendarId);
    if (!cal) return;
    
    cal.innerHTML = '';
    const days = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
    days.forEach(d => {
        const h = document.createElement('div');
        h.className = 'calendar-header';
        h.textContent = d;
        cal.appendChild(h);
    });

    let dates = [];
    if (view === 'week') {
        const mon = new Date(current);
        mon.setDate(mon.getDate() - ((mon.getDay() || 7) - 1));
        for (let i = 0; i < 7; i++) {
            const d = new Date(mon);
            d.setDate(mon.getDate() + i);
            dates.push({ date: d, day: d.getDate(), empty: false });
        }
    } else {
        const y = current.getFullYear(), m = current.getMonth();
        const first = new Date(y, m, 1), last = new Date(y, m + 1, 0), start = first.getDay() || 7;
        for (let i = 0; i < start - 1; i++) {
            dates.push({ empty: true });
        }
        for (let day = 1; day <= last.getDate(); day++) {
            dates.push({ date: new Date(y, m, day), day, empty: false });
        }
    }

    dates.forEach(o => {
        const b = document.createElement('button');
        b.className = `date-btn ${o.empty ? 'empty' : ''}`;
        b.textContent = o.day || '';
        if (o.empty) b.disabled = true;
        else b.onclick = () => onSelect(o.date);
        cal.appendChild(b);
    });
}

