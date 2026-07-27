// ========== GLOBAL STATE ==========
let currentUser = null; // alias for state.user, kept for readability across files
let cycleCalendar = null;
let pregnancyTracker = null;
let notifiedReminderKeys = new Set();

const state = {
    user: null,
    appointments: [],
    medications: [],
    medicationLogsToday: [],
    prescriptions: [],
    diaryEntries: [],
    weightLogs: [],
    kickSessions: [],
    contractions: [],
    cycleLogs: [],
    chatMessages: []
};

// ========== INITIALIZE ON PAGE LOAD ==========
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('dashboard.html')) {
        initDashboard();
    } else {
        initLoginPage();
    }
});

// ========== LOGIN PAGE ==========
function initLoginPage() {
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    const loginForm = document.getElementById('loginForm');
    const registrationForm = document.getElementById('registrationForm');

    // Toggle between login and registration
    loginBtn.addEventListener('click', () => {
        loginBtn.classList.add('active');
        registerBtn.classList.remove('active');
        loginForm.classList.remove('hidden');
        registrationForm.classList.add('hidden');
    });

    registerBtn.addEventListener('click', () => {
        registerBtn.classList.add('active');
        loginBtn.classList.remove('active');
        registrationForm.classList.remove('hidden');
        loginForm.classList.add('hidden');
    });

    // Show pregnancy date field if pregnant
    const pregnancyRadios = document.querySelectorAll('input[name="pregnancyStatus"]');
    pregnancyRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            const pregnancyDateGroup = document.getElementById('pregnancyDateGroup');
            if (e.target.value === 'pregnant') {
                pregnancyDateGroup.classList.remove('hidden');
                document.getElementById('pregnancyStartDate').required = true;
            } else {
                pregnancyDateGroup.classList.add('hidden');
                document.getElementById('pregnancyStartDate').required = false;
            }
        });
    });

    // Handle login
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        try {
            const result = await api.post('/auth/login', { email, password });
            setToken(result.token);
            window.location.href = 'dashboard.html';
        } catch (err) {
            alert(err.message || 'Invalid credentials! Please try again or register.');
        }
    });

    // Handle registration
    registrationForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const payload = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            password: document.getElementById('password').value,
            age: document.getElementById('age').value,
            cycleStartDate: document.getElementById('cycleStartDate').value,
            cycleLength: document.getElementById('cycleLength').value,
            pregnancyStatus: document.querySelector('input[name="pregnancyStatus"]:checked').value,
            pregnancyStartDate: document.getElementById('pregnancyStartDate').value || null,
            doctorName: document.getElementById('doctorName').value,
            doctorPhone: document.getElementById('doctorPhone').value,
            emergencyContact: document.getElementById('emergencyContact').value,
            emergencyPhone: document.getElementById('emergencyPhone').value
        };

        try {
            const result = await api.post('/auth/register', payload);
            setToken(result.token);
            alert('Registration successful! Welcome aboard! 🌸');
            window.location.href = 'dashboard.html';
        } catch (err) {
            alert(err.message || 'Registration failed. Please try again.');
        }
    });
}

// ========== DASHBOARD INITIALIZATION ==========
async function initDashboard() {
    if (!getToken()) {
        window.location.href = 'index.html';
        return;
    }

    try {
        await loadAllData();
    } catch (err) {
        console.error('Failed to load dashboard data', err);
        return; // api.js already redirects to login on 401
    }

    if (currentUser.darkMode) {
        document.body.classList.add('dark-mode');
    }

    // Initialize all components
    loadUserData();
    setupNavigation();
    setupLogout();
    loadDailyQuote();
    loadOverview();
    setupCalendar();
    setupAppointments();
    loadEmergencyContacts();
    loadResources();
    setupSettings();
    setupFormModal();
    setupChat();

    // Feature-specific initializations
    setupMedicationTracker();
    setupDiary();
    loadPregnancyDashboard();
    updateKickDisplay();
    updateContractionDisplay();
    loadDietPlan();
    setupDietaryNotesForm();
    setupWeightForm();

    // Update dashboard widgets
    updateTodaysMedications();
    checkReminders();

    requestNotificationPermission();
}

async function loadAllData() {
    const [
        user, appointments, medications, medicationLogsToday,
        prescriptions, diaryEntries, weightLogs, kickSessions,
        contractions, cycleLogs
    ] = await Promise.all([
        api.get('/users/me'),
        api.get('/appointments'),
        api.get('/medications'),
        api.get('/medications/logs/today'),
        api.get('/prescriptions'),
        api.get('/diary'),
        api.get('/weight'),
        api.get('/kicks'),
        api.get('/contractions'),
        api.get('/cycles')
    ]);

    state.user = user;
    state.appointments = appointments;
    state.medications = medications;
    state.medicationLogsToday = medicationLogsToday;
    state.prescriptions = prescriptions;
    state.diaryEntries = diaryEntries;
    state.weightLogs = weightLogs;
    state.kickSessions = kickSessions;
    state.contractions = contractions;
    state.cycleLogs = cycleLogs;

    currentUser = state.user;
}

function loadUserData() {
    document.getElementById('userName').textContent = currentUser.name;
}

function setupNavigation() {
    const menuItems = document.querySelectorAll('.menu-item');

    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            navigateTo(item.getAttribute('data-section'));
        });
    });
}

// Single source of truth for tab switching (also used by quick actions in features.js)
function navigateTo(sectionId) {
    document.querySelectorAll('.menu-item').forEach(mi => {
        mi.classList.toggle('active', mi.getAttribute('data-section') === sectionId);
    });
    document.querySelectorAll('.content-section').forEach(s => {
        s.classList.toggle('active', s.id === sectionId);
    });
    window.scrollTo(0, 0);
    trackEvent(`view_${sectionId}`);
}

function setupLogout() {
    document.getElementById('logoutBtn').addEventListener('click', () => {
        if (confirm('Are you sure you want to logout?')) {
            setToken(null);
            window.location.href = 'index.html';
        }
    });
}

function loadDailyQuote() {
    const quote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
    document.getElementById('dailyQuote').textContent = quote;
}

// ========== OVERVIEW SECTION ==========
function loadOverview() {
    if (currentUser.pregnancyStatus === 'pregnant' && currentUser.pregnancyStartDate) {
        loadPregnancyOverview();
    } else {
        loadCycleOverview();
    }

    loadNextAppointment();
}

function loadPregnancyOverview() {
    pregnancyTracker = new PregnancyTracker(currentUser.pregnancyStartDate);
    const weeks = pregnancyTracker.getWeeksPregnant();
    const days = pregnancyTracker.getDaysPregnant() % 7;

    document.getElementById('currentStatus').textContent = pregnancyTracker.getTrimester();
    document.getElementById('cycleCard').style.display = 'none';
    document.getElementById('pregnancyCard').style.display = 'block';
    document.getElementById('pregnancyWeek').textContent = `${weeks}w ${days}d`;

    loadPregnancyInsights();
}

function loadCycleOverview() {
    cycleCalendar = new CycleCalendar(currentUser.cycleStartDate, getEffectiveCycleLength());

    const cycleDay = cycleCalendar.calculateCycleDay();
    const phase = cycleCalendar.getCyclePhase();

    document.getElementById('currentStatus').textContent = phase;
    document.getElementById('cycleCard').style.display = 'block';
    document.getElementById('pregnancyCard').style.display = 'none';
    document.getElementById('cycleDay').textContent = `Day ${cycleDay}`;

    loadCycleInsights(phase);
}

function loadCycleInsights(phase) {
    const insights = {
        'Menstrual': '🌙 Your body is shedding the uterine lining. Rest, stay hydrated, and be gentle with yourself. Use heating pads for cramps if needed.',
        'Follicular': '🌱 Energy levels are rising! Great time for new projects and intense workouts. Your skin may be glowing and you might feel more confident.',
        'Ovulation': '✨ Peak fertility window! You may feel more social and energetic. Perfect time for important conversations and activities.',
        'Luteal': '🍂 Energy may decrease naturally. Focus on self-care, eat nutritious foods, and prepare for your next cycle. Be kind to yourself.'
    };

    document.getElementById('todayInsights').innerHTML = `<p>${insights[phase]}</p>`;
}

function loadPregnancyInsights() {
    if (!pregnancyTracker) return;

    const trimester = pregnancyTracker.getTrimester();
    const insights = {
        'First Trimester': '🌱 Your baby is developing rapidly! Rest when tired, eat small frequent meals, and take prenatal vitamins. Morning sickness is common and usually improves by week 12-14.',
        'Second Trimester': '💪 Welcome to the "honeymoon phase"! You may feel more energetic. Your baby is growing and you might feel movements soon. Great time for shopping and preparing.',
        'Third Trimester': '🤰 Final stretch! Your baby is preparing for birth. Rest often, practice breathing exercises, and prepare your hospital bag. You\'re doing amazing!'
    };

    document.getElementById('todayInsights').innerHTML = `<p>${insights[trimester]}</p>`;
}

function loadNextAppointment() {
    const upcoming = state.appointments
        .filter(apt => new Date(apt.date) >= new Date())
        .sort((a, b) => new Date(a.date) - new Date(b.date));

    if (upcoming.length > 0) {
        const next = upcoming[0];
        const date = new Date(next.date);
        document.getElementById('nextAppt').textContent = date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        });
    } else {
        document.getElementById('nextAppt').textContent = 'None';
    }
}

// ========== CYCLE PREDICTION HELPERS ==========
// Real prediction based on logged cycle history, falling back to the configured cycle length
function getEffectiveCycleLength() {
    if (state.cycleLogs.length > 0) {
        const lengths = state.cycleLogs.map(c => c.length).filter(l => l && l > 0);
        if (lengths.length > 0) {
            const avg = lengths.reduce((a, b) => a + b, 0) / lengths.length;
            return Math.round(avg);
        }
    }
    return parseInt(currentUser.cycleLength) || 28;
}

function getMostRecentCycleStart() {
    if (state.cycleLogs.length > 0) {
        const sorted = [...state.cycleLogs].sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
        return sorted[0].startDate;
    }
    return currentUser.cycleStartDate;
}

// ========== CALENDAR SECTION ==========
function setupCalendar() {
    if (!currentUser.cycleStartDate) {
        document.getElementById('calendarGrid').innerHTML = '<p class="info-text">Add your last period start date in Settings to see your calendar.</p>';
        return;
    }

    cycleCalendar = new CycleCalendar(getMostRecentCycleStart(), getEffectiveCycleLength());
    const calendarGrid = document.getElementById('calendarGrid');
    renderCalendarWithPredictions(calendarGrid);

    document.getElementById('prevMonth').addEventListener('click', () => {
        cycleCalendar.previousMonth();
        renderCalendarWithPredictions(calendarGrid);
    });

    document.getElementById('nextMonth').addEventListener('click', () => {
        cycleCalendar.nextMonth();
        renderCalendarWithPredictions(calendarGrid);
    });

    updateCycleStats();
    updateCycleLengthChart();
}

// Renders the calendar, then marks future period days beyond the immediate
// next cycle as "predicted" (using the historical-average cycle length) so the
// legend's Predicted swatch actually means something.
function renderCalendarWithPredictions(calendarGrid) {
    cycleCalendar.renderCalendar(calendarGrid);

    const today = new Date();
    const nextPeriodStart = new Date(getMostRecentCycleStart());
    nextPeriodStart.setDate(nextPeriodStart.getDate() + getEffectiveCycleLength());

    calendarGrid.querySelectorAll('.calendar-day.period').forEach(dayEl => {
        const dayNum = parseInt(dayEl.textContent);
        if (!dayNum) return;
        const date = new Date(cycleCalendar.currentMonth.getFullYear(), cycleCalendar.currentMonth.getMonth(), dayNum);
        if (date >= nextPeriodStart && date > today) {
            dayEl.classList.add('predicted');
        }
    });
}

function updateCycleStats() {
    if (!cycleCalendar) return;

    const cycleLength = getEffectiveCycleLength();
    document.getElementById('avgCycle').textContent = `${cycleLength} days`;
    document.getElementById('periodLength').textContent = '5 days'; // Default

    const lastPeriod = new Date(getMostRecentCycleStart());
    const nextPeriod = new Date(lastPeriod);
    nextPeriod.setDate(nextPeriod.getDate() + cycleLength);
    document.getElementById('nextPeriod').textContent = nextPeriod.toLocaleDateString();

    const ovulationDay = Math.floor(cycleLength / 2);
    const fertileStart = new Date(lastPeriod);
    fertileStart.setDate(fertileStart.getDate() + ovulationDay - 3);
    const fertileEnd = new Date(lastPeriod);
    fertileEnd.setDate(fertileEnd.getDate() + ovulationDay + 1);

    document.getElementById('fertileWindow').textContent =
        `${fertileStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${fertileEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
}

function updateCycleLengthChart() {
    const canvas = document.getElementById('cycleLengthChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    if (window.cycleLengthChartInstance) {
        window.cycleLengthChartInstance.destroy();
    }

    const sorted = [...state.cycleLogs].sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
    const hasHistory = sorted.length >= 2;

    const labels = hasHistory
        ? sorted.slice(1).map(c => new Date(c.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }))
        : ['Configured length'];
    const data = hasHistory
        ? sorted.slice(1).map(c => c.length)
        : [parseInt(currentUser.cycleLength) || 28];

    window.cycleLengthChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels,
            datasets: [{
                label: 'Cycle Length (days)',
                data,
                borderColor: '#ff6b9d',
                backgroundColor: 'rgba(255, 107, 157, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: { min: 15, max: 45 }
            }
        }
    });
}

async function addCyclePrediction() {
    const cycleLength = getEffectiveCycleLength();
    const lastStart = new Date(getMostRecentCycleStart());
    const predicted = new Date(lastStart);
    predicted.setDate(predicted.getDate() + cycleLength);

    const basis = state.cycleLogs.length > 0
        ? `based on the average of your last ${state.cycleLogs.length} logged cycle(s)`
        : 'based on your configured cycle length (log a few actual periods for a more accurate prediction)';

    trackEvent('predict_cycle');
    showNotification(`🔮 Next period predicted around ${predicted.toLocaleDateString()} (${basis})`);
    navigateTo('calendar');
}

// Lets the user log an actual period start, building real history for prediction
async function logPeriodStart() {
    const dateStr = new Date().toISOString().split('T')[0];
    const previousStart = getMostRecentCycleStart();
    const length = previousStart
        ? Math.round((new Date(dateStr) - new Date(previousStart)) / (1000 * 60 * 60 * 24))
        : null;

    try {
        const entry = await api.post('/cycles', { startDate: dateStr, length: length && length > 0 ? length : null });
        state.cycleLogs.push(entry);
        setupCalendar();
        showNotification('Period start logged! 📌');
        trackEvent('log_period');
    } catch (err) {
        showNotification(err.message || 'Could not log period start');
    }
}

function exportCalendar() {
    if (!cycleCalendar) {
        alert('Calendar export only available once your cycle start date is set');
        return;
    }

    let text = 'MENSTRUAL CYCLE CALENDAR\n';
    text += `Name: ${currentUser.name}\n`;
    text += `Last Period: ${getMostRecentCycleStart()}\n`;
    text += `Cycle Length: ${getEffectiveCycleLength()} days\n\n`;

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cycle-calendar.txt';
    a.click();

    showNotification('Calendar exported! 📥');
}

// ========== APPOINTMENTS ==========
function setupAppointments() {
    const appointmentForm = document.getElementById('appointmentForm');

    setupSpeechToText('appointmentNotesMicBtn', 'appointmentNotes');

    const today = new Date().toISOString().split('T')[0];
    document.getElementById('appointmentDate').min = today;

    appointmentForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const payload = {
            date: document.getElementById('appointmentDate').value,
            time: document.getElementById('appointmentTime').value,
            type: document.getElementById('appointmentType').value,
            doctor: document.getElementById('appointmentDoctor').value,
            notes: document.getElementById('appointmentNotes').value,
            reminder: document.getElementById('appointmentReminder').checked
        };

        try {
            const created = await api.post('/appointments', payload);
            state.appointments.push(created);
            appointmentForm.reset();
            document.getElementById('appointmentDate').min = today;
            loadAppointments();
            loadNextAppointment();
            showNotification('Appointment added! 🏥');
            trackEvent('add_appointment');
        } catch (err) {
            showNotification(err.message || 'Could not add appointment');
        }
    });

    loadAppointments();
}

function loadAppointments() {
    const appointmentList = document.getElementById('appointmentList');

    if (state.appointments.length === 0) {
        appointmentList.innerHTML = '<p class="info-text">No appointments scheduled.</p>';
        return;
    }

    const sorted = [...state.appointments].sort((a, b) => new Date(a.date) - new Date(b.date));

    appointmentList.innerHTML = sorted.map(apt => {
        const date = new Date(apt.date);
        const isPast = date < new Date();

        return `
            <div class="appointment-item" style="${isPast ? 'opacity: 0.6;' : ''}">
                <div class="appointment-info">
                    <h4>${apt.type}</h4>
                    <p>📅 ${date.toLocaleDateString()} at ${apt.time}</p>
                    ${apt.doctor ? `<p>👨‍⚕️ ${apt.doctor}</p>` : ''}
                    ${apt.notes ? `<p>📝 ${apt.notes}</p>` : ''}
                    ${isPast ? '<span style="color: #7f8c8d;">✓ Past</span>' : '<span style="color: #27ae60;">⏰ Upcoming</span>'}
                </div>
                <button class="delete-btn" onclick="deleteAppointment(${apt.id})">Delete</button>
            </div>
        `;
    }).join('');
}

async function deleteAppointment(id) {
    if (!confirm('Delete this appointment?')) return;
    try {
        await api.delete(`/appointments/${id}`);
        state.appointments = state.appointments.filter(apt => apt.id !== id);
        loadAppointments();
        loadNextAppointment();
    } catch (err) {
        showNotification(err.message || 'Could not delete appointment');
    }
}

// ========== EMERGENCY CONTACTS ==========
function loadEmergencyContacts() {
    const doctorInfo = currentUser.doctorName && currentUser.doctorPhone
        ? `<strong>${currentUser.doctorName}</strong><br>📞 <a href="tel:${currentUser.doctorPhone}">${currentUser.doctorPhone}</a>`
        : '<p class="info-text">Not set</p>';

    const hospitalInfo = currentUser.hospitalName && currentUser.hospitalPhone
        ? `<strong>${currentUser.hospitalName}</strong><br>📞 <a href="tel:${currentUser.hospitalPhone}">${currentUser.hospitalPhone}</a>`
        : '<p class="info-text">Not set</p>';

    const emergencyInfo = currentUser.emergencyContact && currentUser.emergencyPhone
        ? `<strong>${currentUser.emergencyContact}</strong><br>📞 <a href="tel:${currentUser.emergencyPhone}">${currentUser.emergencyPhone}</a>`
        : '<p class="info-text">Not set</p>';

    document.getElementById('doctorInfo').innerHTML = doctorInfo;
    document.getElementById('hospitalInfo').innerHTML = hospitalInfo;
    document.getElementById('emergencyInfo').innerHTML = emergencyInfo;
}

function callDoctor() {
    if (currentUser.doctorPhone) {
        window.location.href = `tel:${currentUser.doctorPhone}`;
    } else {
        alert('Doctor phone number not set. Please update in settings.');
    }
}

function callHospital() {
    if (currentUser.hospitalPhone) {
        window.location.href = `tel:${currentUser.hospitalPhone}`;
    } else {
        alert('Hospital phone number not set. Please update in settings.');
    }
}

function callEmergency() {
    if (currentUser.emergencyPhone) {
        window.location.href = `tel:${currentUser.emergencyPhone}`;
    } else {
        alert('Emergency contact not set. Please update in settings.');
    }
}

function editContacts() {
    const fieldsHtml = `
        <div class="form-group">
            <label for="fmDoctorName">Doctor Name</label>
            <input type="text" id="fmDoctorName" value="${currentUser.doctorName || ''}">
        </div>
        <div class="form-group">
            <label for="fmDoctorPhone">Doctor Phone</label>
            <input type="tel" id="fmDoctorPhone" value="${currentUser.doctorPhone || ''}">
        </div>
        <div class="form-group">
            <label for="fmHospitalName">Hospital/Clinic Name</label>
            <input type="text" id="fmHospitalName" value="${currentUser.hospitalName || ''}">
        </div>
        <div class="form-group">
            <label for="fmHospitalPhone">Hospital Phone</label>
            <input type="tel" id="fmHospitalPhone" value="${currentUser.hospitalPhone || ''}">
        </div>
        <div class="form-group">
            <label for="fmEmergencyContact">Emergency Contact Name</label>
            <input type="text" id="fmEmergencyContact" value="${currentUser.emergencyContact || ''}">
        </div>
        <div class="form-group">
            <label for="fmEmergencyPhone">Emergency Contact Phone</label>
            <input type="tel" id="fmEmergencyPhone" value="${currentUser.emergencyPhone || ''}">
        </div>
    `;

    openFormModal('✏️ Edit Contacts', fieldsHtml, async () => {
        const updates = {
            doctorName: document.getElementById('fmDoctorName').value,
            doctorPhone: document.getElementById('fmDoctorPhone').value,
            hospitalName: document.getElementById('fmHospitalName').value,
            hospitalPhone: document.getElementById('fmHospitalPhone').value,
            emergencyContact: document.getElementById('fmEmergencyContact').value,
            emergencyPhone: document.getElementById('fmEmergencyPhone').value
        };
        await patchProfile(updates);
        loadEmergencyContacts();
        closeFormModal();
        showNotification('Contacts updated! 📞');
    });
}

// ========== DIET PLAN ==========
function loadDietPlan() {
    let dietKey, exerciseKey;

    if (currentUser.pregnancyStatus === 'pregnant' && currentUser.pregnancyStartDate) {
        pregnancyTracker = new PregnancyTracker(currentUser.pregnancyStartDate);
        const weeks = pregnancyTracker.getWeeksPregnant();

        if (weeks <= 12) {
            dietKey = 'pregnancy_first';
            exerciseKey = 'pregnancy_first';
        } else if (weeks <= 26) {
            dietKey = 'pregnancy_second';
            exerciseKey = 'pregnancy_second';
        } else {
            dietKey = 'pregnancy_third';
            exerciseKey = 'pregnancy_third';
        }
    } else if (cycleCalendar) {
        const phase = cycleCalendar.getCyclePhase().toLowerCase();
        dietKey = phase;
        exerciseKey = phase;
    } else {
        dietKey = 'follicular';
        exerciseKey = 'follicular';
    }

    const recommended = dietPlans[dietKey] || dietPlans.follicular;
    const avoid = foodsToAvoid[dietKey] || [];
    const nutrients = essentialNutrients[dietKey] || [];
    const exercise = exercisePlans[exerciseKey] || exercisePlans.follicular;

    document.getElementById('recommendedFoods').innerHTML = '<ul>' +
        recommended.map(item => `<li>${item}</li>`).join('') + '</ul>';

    document.getElementById('avoidFoods').innerHTML = avoid.length > 0 ?
        '<ul>' + avoid.map(item => `<li>${item}</li>`).join('') + '</ul>' :
        '<p>No specific restrictions</p>';

    document.getElementById('essentialNutrients').innerHTML = '<ul>' +
        nutrients.map(item => `<li>${item}</li>`).join('') + '</ul>';

    document.getElementById('exercisePlan').innerHTML = '<ul>' +
        exercise.map(item => `<li>${item}</li>`).join('') + '</ul>';

    loadSampleMealPlan(dietKey);
    loadPrescribedDietSection();
}

function loadPrescribedDietSection() {
    const container = document.getElementById('prescribedDiet');
    const parts = [];

    if (state.prescriptions.length > 0) {
        parts.push('<p><strong>📄 Uploaded prescriptions:</strong></p><ul>' +
            state.prescriptions.map(p => `<li><a href="${p.url}" target="_blank" rel="noopener">${p.filename}</a></li>`).join('') +
            '</ul>');
    }

    if (currentUser.dietaryNotes) {
        parts.push(`<p><strong>📝 Notes from your doctor:</strong> ${currentUser.dietaryNotes}</p>`);
    }

    if (parts.length === 0) {
        container.innerHTML = '<p class="info-text">Upload your prescription in the Medications section, or add dietary notes below, to personalize this plan.</p>';
    } else {
        container.innerHTML = parts.join('');
    }

    const notesField = document.getElementById('dietaryNotes');
    if (notesField) notesField.value = currentUser.dietaryNotes || '';
}

function setupDietaryNotesForm() {
    const form = document.getElementById('dietaryNotesForm');

    setupSpeechToText('dietaryNotesMicBtn', 'dietaryNotes');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const dietaryNotes = document.getElementById('dietaryNotes').value;
        try {
            await patchProfile({ dietaryNotes });
            loadPrescribedDietSection();
            showNotification('Dietary notes saved! 🥗');
        } catch (err) {
            showNotification(err.message || 'Could not save notes');
        }
    });
}

function loadSampleMealPlan(key) {
    const mealPlans = sampleMealPlans[key] || sampleMealPlans.follicular;

    document.getElementById('sampleMealPlan').innerHTML = Object.keys(mealPlans).map(meal => `
        <div class="meal-card">
            <h4>${meal}</h4>
            <p>${mealPlans[meal]}</p>
        </div>
    `).join('');
}

// ========== RESOURCES ==========
function loadResources() {
    loadBooks();
    loadSupportGroups();
}

function loadBooks() {
    const bookList = document.getElementById('bookList');
    bookList.innerHTML = parentingBooks.map(book => `
        <div class="book-card">
            <h4>${book.title}</h4>
            <p class="author">by ${book.author}</p>
            <p>${book.description}</p>
            <p>${book.rating}</p>
        </div>
    `).join('');
}

function loadSupportGroups() {
    const groupList = document.getElementById('groupList');
    groupList.innerHTML = supportGroups.map(group => `
        <div class="group-card">
            <h4>${group.name}</h4>
            <p>${group.description}</p>
            ${group.phone ? `<p>📞 <a href="tel:${group.phone.replace(/[^0-9+]/g, '')}">${group.phone}</a></p>` : ''}
            <a class="resource-link" href="${group.url}" target="_blank" rel="noopener">🔗 Visit site</a>
        </div>
    `).join('');
}

// ========== SETTINGS ==========
function setupSettings() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    darkModeToggle.checked = !!currentUser.darkMode;

    darkModeToggle.addEventListener('change', async (e) => {
        const darkMode = e.target.checked;
        document.body.classList.toggle('dark-mode', darkMode);
        trackEvent('toggle_dark_mode');
        try {
            await patchProfile({ darkMode });
        } catch (err) {
            showNotification(err.message || 'Could not save appearance setting');
        }
    });
}

// ========== GENERIC EDIT MODAL ==========
function setupFormModal() {
    // Clicking outside the modal content closes it
    document.getElementById('formModal').addEventListener('click', (e) => {
        if (e.target.id === 'formModal') closeFormModal();
    });
}

function openFormModal(title, fieldsHtml, onSubmit) {
    document.getElementById('formModalTitle').textContent = title;
    document.getElementById('formModalFields').innerHTML = fieldsHtml;
    const form = document.getElementById('formModalForm');
    form.onsubmit = async (e) => {
        e.preventDefault();
        await onSubmit();
    };
    document.getElementById('formModal').style.display = 'flex';
}

function closeFormModal() {
    document.getElementById('formModal').style.display = 'none';
}

async function patchProfile(updates) {
    const updated = await api.put('/users/me', updates);
    state.user = updated;
    currentUser = state.user;
    return updated;
}

function editProfile() {
    const fieldsHtml = `
        <div class="form-group">
            <label for="fmName">Full Name</label>
            <input type="text" id="fmName" value="${currentUser.name || ''}" required>
        </div>
        <div class="form-group">
            <label for="fmAge">Age</label>
            <input type="number" id="fmAge" min="18" max="60" value="${currentUser.age || ''}">
        </div>
    `;

    openFormModal('👤 Edit Profile', fieldsHtml, async () => {
        await patchProfile({
            name: document.getElementById('fmName').value,
            age: document.getElementById('fmAge').value
        });
        loadUserData();
        closeFormModal();
        showNotification('Profile updated! 👤');
    });
}

function updatePregnancyStatus() {
    const fieldsHtml = `
        <div class="form-group">
            <label for="fmPregnancyStatus">Pregnancy Status</label>
            <select id="fmPregnancyStatus">
                <option value="not-pregnant" ${currentUser.pregnancyStatus === 'not-pregnant' ? 'selected' : ''}>Not Pregnant</option>
                <option value="pregnant" ${currentUser.pregnancyStatus === 'pregnant' ? 'selected' : ''}>Pregnant</option>
                <option value="trying" ${currentUser.pregnancyStatus === 'trying' ? 'selected' : ''}>Trying to Conceive</option>
            </select>
        </div>
        <div class="form-group" id="fmPregnancyDateGroup" style="${currentUser.pregnancyStatus === 'pregnant' ? '' : 'display:none;'}">
            <label for="fmPregnancyStartDate">Pregnancy Start Date (First day of last period)</label>
            <input type="date" id="fmPregnancyStartDate" value="${currentUser.pregnancyStartDate || ''}">
        </div>
    `;

    openFormModal('🤰 Update Pregnancy Status', fieldsHtml, async () => {
        const status = document.getElementById('fmPregnancyStatus').value;
        const startDate = document.getElementById('fmPregnancyStartDate').value || null;

        await patchProfile({
            pregnancyStatus: status,
            pregnancyStartDate: status === 'pregnant' ? startDate : currentUser.pregnancyStartDate
        });

        closeFormModal();
        showNotification('Pregnancy status updated! 🤰');

        // Refresh every section that depends on pregnancy status
        loadOverview();
        loadDietPlan();
        loadPregnancyDashboard();
        setupCalendar();
    });

    document.getElementById('fmPregnancyStatus').addEventListener('change', (e) => {
        document.getElementById('fmPregnancyDateGroup').style.display = e.target.value === 'pregnant' ? '' : 'none';
    });
}

function exportAllData() {
    const dataStr = JSON.stringify(state, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `health-data-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();

    trackEvent('export_data');
    showNotification('All data exported! 📥');
}

function importData(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async function(e) {
        try {
            const data = JSON.parse(e.target.result);
            const importedUser = data.user || data; // supports old localStorage-era exports too

            if (!confirm('⚠️ This will overwrite your current profile fields (name, contacts, cycle/pregnancy info). Logged history (appointments, diary, etc.) is not affected. Continue?')) {
                return;
            }

            const updates = {};
            ['name', 'age', 'cycleStartDate', 'cycleLength', 'pregnancyStatus', 'pregnancyStartDate',
                'doctorName', 'doctorPhone', 'hospitalName', 'hospitalPhone',
                'emergencyContact', 'emergencyPhone', 'dietaryNotes'].forEach(key => {
                if (importedUser[key] !== undefined) updates[key] = importedUser[key];
            });

            await patchProfile(updates);
            showNotification('Profile data imported! Reloading...');
            setTimeout(() => location.reload(), 1200);
        } catch (error) {
            alert('Invalid file format! Please select a valid backup file.');
        }
    };
    reader.readAsText(file);
}

async function clearAllData() {
    if (!confirm('⚠️ This will delete ALL your data permanently. Are you absolutely sure?')) return;
    if (!confirm('⚠️ This action CANNOT be undone. Confirm one more time?')) return;

    try {
        await api.delete('/users/me');
        setToken(null);
        alert('All data has been cleared. You will be redirected to the login page.');
        window.location.href = 'index.html';
    } catch (err) {
        alert(err.message || 'Could not clear data. Please try again.');
    }
}

// ========== REMINDERS ==========
function requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
    }
}

function checkReminders() {
    const reminders = [];
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    state.medications.filter(m => m.active && m.reminder && m.time).forEach(med => {
        const [hours, minutes] = med.time.split(':').map(Number);
        const medTime = hours * 60 + minutes;

        if (Math.abs(currentTime - medTime) <= 30) {
            reminders.push({
                key: `med-${med.id}-${now.toDateString()}`,
                type: 'medication',
                message: `Time to take ${med.name}`,
                icon: '💊'
            });
        }
    });

    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);

    state.appointments.filter(apt => apt.reminder).forEach(apt => {
        const aptDate = new Date(apt.date);
        if (aptDate.toDateString() === tomorrow.toDateString()) {
            reminders.push({
                key: `appt-${apt.id}`,
                type: 'appointment',
                message: `Appointment tomorrow: ${apt.type}`,
                icon: '🏥'
            });
        }
    });

    document.getElementById('reminderCount').textContent = reminders.length;
    window.currentReminders = reminders;

    // Fire a native browser notification for anything not yet notified this session
    if ('Notification' in window && Notification.permission === 'granted') {
        reminders.forEach(r => {
            if (!notifiedReminderKeys.has(r.key)) {
                notifiedReminderKeys.add(r.key);
                new Notification(r.message, { icon: undefined, body: r.type === 'medication' ? 'Medication reminder' : 'Appointment reminder' });
            }
        });
    }
}

function showReminders() {
    const reminders = window.currentReminders || [];
    const modal = document.getElementById('reminderModal');
    const reminderList = document.getElementById('reminderList');

    if (reminders.length === 0) {
        reminderList.innerHTML = '<p class="info-text">No reminders for now! 🎉</p>';
    } else {
        reminderList.innerHTML = reminders.map(r => `
            <div style="padding: 15px; background: var(--bg-light); border-radius: 10px; margin-bottom: 10px;">
                <span style="font-size: 2rem; margin-right: 10px;">${r.icon}</span>
                <strong>${r.message}</strong>
            </div>
        `).join('');
    }

    modal.style.display = 'flex';
}

function closeReminders() {
    document.getElementById('reminderModal').style.display = 'none';
}

// Check reminders every 5 minutes
setInterval(checkReminders, 5 * 60 * 1000);
