class CycleCalendar {
    constructor(cycleStartDate, cycleLength = 28) {
        this.cycleStartDate = new Date(cycleStartDate);
        this.cycleLength = cycleLength;
        this.currentMonth = new Date();
    }

    calculateCycleDay() {
        const today = new Date();
        const diffTime = today - this.cycleStartDate;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        return (diffDays % this.cycleLength) + 1;
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
        const diffTime = date - this.cycleStartDate;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        const cycleDay = (diffDays % this.cycleLength) + 1;
        return cycleDay <= 5;
    }

    isFertileDay(date) {
        const diffTime = date - this.cycleStartDate;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        const cycleDay = (diffDays % this.cycleLength) + 1;
        return cycleDay >= 10 && cycleDay <= 17;
    }

    isOvulationDay(date) {
        const diffTime = date - this.cycleStartDate;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        const cycleDay = (diffDays % this.cycleLength) + 1;
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