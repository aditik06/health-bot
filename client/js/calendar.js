// 'YYYY-MM-DD' from the API parses as UTC midnight, while calendar cells are
// built with new Date(y, m, d) at *local* midnight. Comparing the two mixes
// timezones and shifts every result by a day in either direction depending on
// the user's offset, so parse date-only strings as local dates instead.
function parseLocalDate(value) {
    if (value instanceof Date) return value;
    const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(value));
    if (match) {
        return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
    }
    return new Date(value);
}

// Whole calendar days between two dates, ignoring time-of-day. Comparing the
// Y/M/D triples keeps this correct across DST boundaries, where a naive
// millisecond division can land on 23- or 25-hour days.
function daysBetween(from, to) {
    const a = Date.UTC(from.getFullYear(), from.getMonth(), from.getDate());
    const b = Date.UTC(to.getFullYear(), to.getMonth(), to.getDate());
    return Math.round((b - a) / 86400000);
}

class CycleCalendar {
    constructor(cycleStartDate, cycleLength = 28) {
        this.cycleStartDate = parseLocalDate(cycleStartDate);
        this.cycleLength = cycleLength > 0 ? cycleLength : 28;
        this.currentMonth = new Date();
    }

    // 1-based day within the cycle. Cycles are periodic in both directions, so
    // dates before the start date wrap to the end of a prior cycle rather than
    // going negative - JS % keeps the sign of the dividend, which previously
    // made every earlier date report a negative day and match `day <= 5`.
    cycleDayFor(date) {
        const diffDays = daysBetween(this.cycleStartDate, date);
        const len = this.cycleLength;
        return (((diffDays % len) + len) % len) + 1;
    }

    calculateCycleDay() {
        return this.cycleDayFor(new Date());
    }

    getCyclePhase() {
        const day = this.calculateCycleDay();
        if (day <= 5) return "Menstrual";
        if (day <= 13) return "Follicular";
        if (day <= 16) return "Ovulation";
        return "Luteal";
    }

    getFertilityStatus() {
        const day = this.calculateCycleDay();
        if (day >= 10 && day <= 17) return "High Fertility";
        if (day >= 8 && day <= 19) return "Moderate Fertility";
        return "Low Fertility";
    }

    isPeriodDay(date) {
        return this.cycleDayFor(date) <= 5;
    }

    isFertileDay(date) {
        const cycleDay = this.cycleDayFor(date);
        return cycleDay >= 10 && cycleDay <= 17;
    }

    isOvulationDay(date) {
        const cycleDay = this.cycleDayFor(date);
        return cycleDay >= 13 && cycleDay <= 15;
    }

    renderCalendar(container) {
        const year = this.currentMonth.getFullYear();
        const month = this.currentMonth.getMonth();
        
        // Update header
        const months = ['January', 'February', 'March', 'April', 'May', 'June',
                       'July', 'August', 'September', 'October', 'November', 'December'];
        document.getElementById('currentMonth').textContent = `${months[month]} ${year}`;

        // Clear container
        container.innerHTML = '';

        // Add day headers
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        days.forEach(day => {
            const dayHeader = document.createElement('div');
            dayHeader.className = 'calendar-day header';
            dayHeader.textContent = day;
            container.appendChild(dayHeader);
        });

        // Get first day of month and total days
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        // Add empty cells
        for (let i = 0; i < firstDay; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'calendar-day';
            container.appendChild(emptyDay);
        }

        // Add days
        const today = new Date();
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            dayElement.textContent = day;

            // Check if today
            if (date.toDateString() === today.toDateString()) {
                dayElement.classList.add('today');
            }

            // Check cycle status
            if (this.isPeriodDay(date)) {
                dayElement.classList.add('period');
            } else if (this.isOvulationDay(date)) {
                dayElement.classList.add('ovulation');
            } else if (this.isFertileDay(date)) {
                dayElement.classList.add('fertile');
            }

            container.appendChild(dayElement);
        }
    }

    previousMonth() {
        this.currentMonth.setMonth(this.currentMonth.getMonth() - 1);
    }

    nextMonth() {
        this.currentMonth.setMonth(this.currentMonth.getMonth() + 1);
    }
}