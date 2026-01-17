// Custom Availability Calendar Component
// Fetches availability from API and displays in a custom calendar

class AvailabilityCalendar {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.bookedDates = new Set();
        this.currentMonth = new Date().getMonth();
        this.currentYear = new Date().getFullYear();
        this.monthsToShow = 3; // Show 3 months at a time
        
        if (!this.container) {
            console.error('Calendar container not found');
            return;
        }
        
        this.init();
    }

    async init() {
        await this.fetchAvailability();
        this.renderCalendar();
    }

    async fetchAvailability() {
        const placeholder = document.getElementById('availability-placeholder');
        if (placeholder) {
            placeholder.style.display = 'block';
        }

        try {
            const apiUrl = window.location.hostname === 'localhost' 
                ? 'http://localhost:3000/api/availability'
                : '/api/availability';
            
            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const data = await response.json();
            
            if (data.success && data.bookedDates) {
                // Convert booked dates to Set for easy lookup
                data.bookedDates.forEach(date => {
                    this.bookedDates.add(this.formatDateForSet(date));
                });
            }

            if (placeholder) {
                placeholder.style.display = 'none';
            }

        } catch (error) {
            console.error('Error fetching availability:', error);
            if (placeholder) {
                placeholder.innerHTML = '<p style="color: #dc2626;">Unable to load availability. Please try again later or contact us directly.</p>';
            }
        }
    }

    formatDateForSet(dateString) {
        // Format date as YYYY-MM-DD for consistent comparison
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
    }

    isDateBooked(date) {
        return this.bookedDates.has(this.formatDateForSet(date));
    }

    isDateInPast(date) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date < today;
    }

    renderCalendar() {
        const calendarEl = document.getElementById('custom-calendar');
        if (!calendarEl) return;

        calendarEl.innerHTML = '';
        calendarEl.style.display = 'block';

        // Create calendar for next few months
        for (let i = 0; i < this.monthsToShow; i++) {
            const monthDate = new Date(this.currentYear, this.currentMonth + i, 1);
            const monthEl = this.createMonthCalendar(monthDate);
            calendarEl.appendChild(monthEl);
        }

        // Add navigation buttons
        const nav = document.createElement('div');
        nav.className = 'calendar-navigation';
        nav.innerHTML = `
            <button class="calendar-nav-btn" id="calendar-prev">← Previous</button>
            <button class="calendar-nav-btn" id="calendar-next">Next →</button>
        `;
        calendarEl.insertBefore(nav, calendarEl.firstChild);

        // Event listeners for navigation
        document.getElementById('calendar-prev')?.addEventListener('click', () => {
            this.currentMonth--;
            if (this.currentMonth < 0) {
                this.currentMonth = 11;
                this.currentYear--;
            }
            this.renderCalendar();
        });

        document.getElementById('calendar-next')?.addEventListener('click', () => {
            this.currentMonth++;
            if (this.currentMonth > 11) {
                this.currentMonth = 0;
                this.currentYear++;
            }
            this.renderCalendar();
        });
    }

    createMonthCalendar(date) {
        const month = date.getMonth();
        const year = date.getFullYear();
        const monthName = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const today = new Date();

        const monthEl = document.createElement('div');
        monthEl.className = 'calendar-month';

        const monthHeader = document.createElement('h3');
        monthHeader.className = 'calendar-month-header';
        monthHeader.textContent = monthName;
        monthEl.appendChild(monthHeader);

        const calendarGrid = document.createElement('div');
        calendarGrid.className = 'calendar-grid';

        // Day headers
        const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        dayHeaders.forEach(day => {
            const dayHeader = document.createElement('div');
            dayHeader.className = 'calendar-day-header';
            dayHeader.textContent = day;
            calendarGrid.appendChild(dayHeader);
        });

        // Empty cells for days before month starts
        for (let i = 0; i < firstDay; i++) {
            const emptyCell = document.createElement('div');
            emptyCell.className = 'calendar-day empty';
            calendarGrid.appendChild(emptyCell);
        }

        // Days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const dayDate = new Date(year, month, day);
            const dayEl = document.createElement('div');
            dayEl.className = 'calendar-day';
            dayEl.textContent = day;

            const dateString = dayDate.toISOString().split('T')[0];
            dayEl.setAttribute('data-date', dateString);

            // Add classes based on date state
            if (this.isDateInPast(dayDate)) {
                dayEl.classList.add('past');
            } else if (this.isDateBooked(dayDate)) {
                dayEl.classList.add('booked');
                dayEl.title = 'Booked';
            } else {
                dayEl.classList.add('available');
                dayEl.title = 'Available';
            }

            // Highlight today
            if (dayDate.toDateString() === today.toDateString()) {
                dayEl.classList.add('today');
            }

            calendarGrid.appendChild(dayEl);
        }

        monthEl.appendChild(calendarGrid);
        return monthEl;
    }

    getBookedDates() {
        return Array.from(this.bookedDates);
    }
}

// Initialize calendar when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const calendarContainer = document.getElementById('availability-calendar');
    if (calendarContainer) {
        window.availabilityCalendar = new AvailabilityCalendar('availability-calendar');
    }
});
