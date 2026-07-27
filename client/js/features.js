// ========== GLOBAL VARIABLES ==========
let currentKickSessionId = null;

let contractionTimer = {
    isRunning: false,
    startTime: null,
    interval: null
};

const CONTRACTION_RING_MAX_SEC = 180; // 3 minutes - ring fills fully and holds beyond this

// ========== MEDICATION TRACKER ==========

function setupMedicationTracker() {
    const medForm = document.getElementById('medicationForm');
    const uploadArea = document.getElementById('uploadArea');
    const prescriptionFile = document.getElementById('prescriptionFile');

    setupSpeechToText('medNotesMicBtn', 'medNotes');

    uploadArea.addEventListener('click', () => {
        prescriptionFile.click();
    });

    prescriptionFile.addEventListener('change', handlePrescriptionUpload);

    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#ff5287';
    });

    uploadArea.addEventListener('dragleave', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#ff6b9d';
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#ff6b9d';
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handlePrescriptionUpload({ target: { files: files } });
        }
    });

    medForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const payload = {
            name: document.getElementById('medName').value,
            dosage: document.getElementById('medDosage').value,
            frequency: document.getElementById('medFrequency').value,
            time: document.getElementById('medTime').value,
            purpose: document.getElementById('medPurpose').value,
            notes: document.getElementById('medNotes').value,
            reminder: document.getElementById('medReminder').checked
        };

        try {
            const created = await api.post('/medications', payload);
            state.medications.push(created);
            medForm.reset();
            loadMedications();
            updateTodaysMedications();
            showNotification('Medication added! 💊');
        } catch (err) {
            showNotification(err.message || 'Could not add medication');
        }
    });

    loadMedications();
    loadPrescriptions();
}

async function handlePrescriptionUpload(event) {
    const files = event.target.files;
    if (files.length === 0) return;

    const file = files[0];
    const formData = new FormData();
    formData.append('file', file);

    try {
        const created = await api.upload('/prescriptions', formData);
        state.prescriptions.push(created);
        loadPrescriptions();
        loadPrescribedDietSection();
        showNotification('Prescription uploaded! 📄');
    } catch (err) {
        showNotification(err.message || 'Could not upload prescription');
    }
}

function loadPrescriptions() {
    const preview = document.getElementById('prescriptionPreview');

    if (state.prescriptions.length === 0) {
        preview.innerHTML = '';
        return;
    }

    preview.innerHTML = state.prescriptions.map(p => `
        <div class="prescription-item">
            <div>
                ${(p.mimeType || '').includes('image') ?
                    `<img src="${p.url}" alt="Prescription">` :
                    '<span>📄 PDF Document</span>'}
                <strong>${p.filename}</strong>
                <small>${new Date(p.uploadedAt).toLocaleDateString()}</small>
            </div>
            <div>
                <button class="btn-primary" onclick="viewPrescription(${p.id})">View</button>
                <button class="delete-btn" onclick="deletePrescription(${p.id})">Delete</button>
            </div>
        </div>
    `).join('');
}

function viewPrescription(id) {
    const prescription = state.prescriptions.find(p => p.id === id);
    if (!prescription) return;
    window.open(prescription.url, '_blank');
}

async function deletePrescription(id) {
    if (!confirm('Delete this prescription?')) return;
    try {
        await api.delete(`/prescriptions/${id}`);
        state.prescriptions = state.prescriptions.filter(p => p.id !== id);
        loadPrescriptions();
        loadPrescribedDietSection();
    } catch (err) {
        showNotification(err.message || 'Could not delete prescription');
    }
}

function loadMedications() {
    const activeMeds = state.medications.filter(m => m.active);
    const medList = document.getElementById('medListContent');

    if (activeMeds.length === 0) {
        medList.innerHTML = '<p class="info-text">No medications added yet.</p>';
        return;
    }

    medList.innerHTML = activeMeds.map(med => `
        <div class="medication-item">
            <div class="med-info">
                <h4>💊 ${med.name}</h4>
                <p><strong>Dosage:</strong> ${med.dosage || '-'}</p>
                <p><strong>Frequency:</strong> ${med.frequency || '-'}</p>
                ${med.purpose ? `<p><strong>Purpose:</strong> ${med.purpose}</p>` : ''}
                <span class="med-time">⏰ ${med.time || '-'}</span>
                ${med.notes ? `<p style="margin-top: 8px; font-size: 0.9rem;">📝 ${med.notes}</p>` : ''}
            </div>
            <div class="med-actions">
                <button class="btn-taken" onclick="markMedicationTaken(${med.id})">✓ Taken</button>
                <button class="delete-btn" onclick="deleteMedication(${med.id})">Delete</button>
            </div>
        </div>
    `).join('');
}

async function markMedicationTaken(id) {
    const med = state.medications.find(m => m.id === id);
    if (!med) return;

    try {
        await api.post(`/medications/${id}/log`);
        state.medicationLogsToday.push({ medicationId: id, takenAt: new Date().toISOString() });
        showNotification(`${med.name} marked as taken! ✓`);
        updateTodaysMedications();
    } catch (err) {
        showNotification(err.message || 'Could not log medication');
    }
}

async function deleteMedication(id) {
    if (!confirm('Delete this medication?')) return;
    try {
        const updated = await api.put(`/medications/${id}`, { active: false });
        const index = state.medications.findIndex(m => m.id === id);
        if (index !== -1) state.medications[index] = updated;
        loadMedications();
        updateTodaysMedications();
    } catch (err) {
        showNotification(err.message || 'Could not delete medication');
    }
}

function updateTodaysMedications() {
    const activeMeds = state.medications.filter(m => m.active);
    const container = document.getElementById('todayMedications');
    if (!container) return;

    if (activeMeds.length === 0) {
        container.innerHTML = '<p class="info-text">No medications scheduled</p>';
        return;
    }

    container.innerHTML = activeMeds.map(med => {
        const taken = state.medicationLogsToday.find(log => log.medicationId === med.id);
        return `
            <div class="list-row-card">
                <div>
                    <strong>${med.name}</strong>
                    <small style="display: block; color: #7f8c8d;">${med.time || '-'}</small>
                </div>
                <span style="font-size: 1.5rem;">${taken ? '✅' : '⏰'}</span>
            </div>
        `;
    }).join('');
}

// ========== MOOD & DIARY ==========

function setupDiary() {
    const diaryForm = document.getElementById('diaryForm');
    const moodButtons = document.querySelectorAll('.mood-btn-inline');
    const energySlider = document.getElementById('energyLevel');
    const energyValue = document.getElementById('energyValue');
    const diaryContent = document.getElementById('diaryContent');
    const charCount = document.getElementById('charCount');

    setupSpeechToText('diaryContentMicBtn', 'diaryContent');

    moodButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            moodButtons.forEach(b => b.classList.remove('selected'));
            this.classList.add('selected');
            document.getElementById('selectedMood').value = this.dataset.mood;
        });
    });

    energySlider.addEventListener('input', (e) => {
        energyValue.textContent = e.target.value;
    });

    diaryContent.addEventListener('input', (e) => {
        const count = e.target.value.length;
        charCount.textContent = count;
        charCount.style.color = count > 1000 ? '#e74c3c' : '#7f8c8d';
    });

    diaryForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const mood = document.getElementById('selectedMood').value;
        if (!mood) {
            alert('Please select your mood');
            return;
        }

        const symptoms = Array.from(document.querySelectorAll('.symptom-tags input:checked'))
            .map(cb => cb.value);

        const payload = {
            mood,
            energy: energySlider.value,
            title: document.getElementById('diaryTitle').value,
            content: document.getElementById('diaryContent').value,
            symptoms,
            tags: document.getElementById('diaryTags').value.split(',').map(t => t.trim()).filter(t => t),
            date: new Date().toISOString()
        };

        try {
            const created = await api.post('/diary', payload);
            state.diaryEntries.unshift(created);

            diaryForm.reset();
            moodButtons.forEach(b => b.classList.remove('selected'));
            document.getElementById('selectedMood').value = '';
            energyValue.textContent = '5';
            charCount.textContent = '0';

            loadDiaryEntries();
            updateWeeklyMoodChart();
            showNotification('Diary entry saved! 📔');
        } catch (err) {
            showNotification(err.message || 'Could not save diary entry');
        }
    });

    loadDiaryEntries();
    updateWeeklyMoodChart();
}

const MOOD_EMOJIS = {
    amazing: '😄', good: '🙂', okay: '😐', tired: '😴', sad: '😔', anxious: '😰', sick: '🤢'
};

function loadDiaryEntries(entries) {
    const list = entries || state.diaryEntries;
    const diaryList = document.getElementById('diaryList');

    if (list.length === 0) {
        diaryList.innerHTML = '<p class="info-text">No diary entries match your filters.</p>';
        return;
    }

    diaryList.innerHTML = list.map(entry => `
        <div class="diary-entry">
            ${entry.title ? `<h4>${entry.title}</h4>` : ''}
            <div class="diary-date">
                <span class="mood-emoji">${MOOD_EMOJIS[entry.mood] || ''}</span>
                <span>${new Date(entry.date).toLocaleString()}</span>
                <span>⚡ Energy: ${entry.energy || '-'}/10</span>
            </div>
            <p>${entry.content || ''}</p>
            ${entry.symptoms && entry.symptoms.length > 0 ? `
                <div style="margin-top: 10px;">
                    <strong>Symptoms:</strong> ${entry.symptoms.join(', ')}
                </div>
            ` : ''}
            ${entry.tags && entry.tags.length > 0 ? `
                <div class="diary-tags">
                    ${entry.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
            ` : ''}
            <button class="delete-btn" onclick="deleteDiaryEntry(${entry.id})" style="margin-top: 15px;">Delete</button>
        </div>
    `).join('');
}

async function deleteDiaryEntry(id) {
    if (!confirm('Delete this diary entry?')) return;
    try {
        await api.delete(`/diary/${id}`);
        state.diaryEntries = state.diaryEntries.filter(e => e.id !== id);
        loadDiaryEntries();
        updateWeeklyMoodChart();
    } catch (err) {
        showNotification(err.message || 'Could not delete entry');
    }
}

function filterDiary() {
    const moodFilter = document.getElementById('moodFilter').value;
    const searchText = document.getElementById('searchDiary').value.toLowerCase();

    const filtered = state.diaryEntries.filter(entry => {
        const matchesMood = moodFilter === 'all' || entry.mood === moodFilter;
        const matchesSearch = !searchText ||
            (entry.content && entry.content.toLowerCase().includes(searchText)) ||
            (entry.title && entry.title.toLowerCase().includes(searchText));

        return matchesMood && matchesSearch;
    });

    loadDiaryEntries(filtered);
}

function updateWeeklyMoodChart() {
    const canvas = document.getElementById('weeklyMoodChart');
    if (!canvas) return;

    const lastWeek = state.diaryEntries.slice(0, 7).reverse();
    if (lastWeek.length === 0) return;

    const ctx = canvas.getContext('2d');

    if (window.weeklyMoodChartInstance) {
        window.weeklyMoodChartInstance.destroy();
    }

    const moodValues = {
        amazing: 5, good: 4, okay: 3, tired: 2, sad: 1, anxious: 1, sick: 1
    };

    window.weeklyMoodChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: lastWeek.map(e => new Date(e.date).toLocaleDateString('en-US', { weekday: 'short' })),
            datasets: [{
                label: 'Mood',
                data: lastWeek.map(e => moodValues[e.mood] || 3),
                borderColor: '#ff6b9d',
                backgroundColor: 'rgba(255, 107, 157, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: {
                    min: 0,
                    max: 5,
                    ticks: {
                        callback: function(value) {
                            const labels = ['', '😔', '😴', '😐', '🙂', '😄'];
                            return labels[value];
                        }
                    }
                }
            }
        }
    });
}

// ========== KICK COUNTER ==========

function getTodaysKickSession() {
    if (!currentKickSessionId) return null;
    return state.kickSessions.find(s => s.id === currentKickSessionId) || null;
}

async function ensureKickSession() {
    let session = getTodaysKickSession();
    if (session) return session;

    const today = new Date().toDateString();
    session = await api.post('/kicks', { date: today });
    state.kickSessions.unshift(session);
    currentKickSessionId = session.id;
    return session;
}

async function recordKick() {
    try {
        const session = await ensureKickSession();
        const updated = await api.post(`/kicks/${session.id}/kick`);
        const index = state.kickSessions.findIndex(s => s.id === session.id);
        if (index !== -1) state.kickSessions[index] = updated;

        updateKickDisplay();

        const animation = document.getElementById('kickAnimation');
        animation.classList.add('pulse');
        setTimeout(() => animation.classList.remove('pulse'), 600);

        showNotification('Kick recorded! 👶');
    } catch (err) {
        showNotification(err.message || 'Could not record kick');
    }
}

async function startKickSession() {
    try {
        const today = new Date().toDateString();
        const session = await api.post('/kicks', { date: today });
        state.kickSessions.unshift(session);
        currentKickSessionId = session.id;
        updateKickDisplay();
        showNotification('New kick counting session started! ⏱️');
    } catch (err) {
        showNotification(err.message || 'Could not start session');
    }
}

async function resetKicks() {
    const session = getTodaysKickSession();
    if (!session) return;
    if (!confirm('Reset the current kick counting session?')) return;

    try {
        await api.delete(`/kicks/${session.id}`);
        state.kickSessions = state.kickSessions.filter(s => s.id !== session.id);
        currentKickSessionId = null;
        updateKickDisplay();
    } catch (err) {
        showNotification(err.message || 'Could not reset session');
    }
}

function updateKickDisplay() {
    const session = getTodaysKickSession();
    const kicks = session ? session.kicks : [];

    document.getElementById('kickCount').textContent = kicks.length;

    if (session) {
        const startTime = new Date(session.startedAt);
        document.getElementById('kickStartTime').textContent = startTime.toLocaleTimeString();

        const now = new Date();
        const duration = Math.floor((now - startTime) / 1000 / 60);
        document.getElementById('sessionDuration').textContent = duration > 0 ? `${duration} min` : 'Just started';

        const kicksPerHour = duration > 0 ? Math.round((kicks.length / duration) * 60) : 0;
        document.getElementById('kicksPerHour').textContent = kicksPerHour;
    } else {
        document.getElementById('kickStartTime').textContent = '-';
        document.getElementById('sessionDuration').textContent = '-';
        document.getElementById('kicksPerHour').textContent = '-';
    }

    if (kicks.length > 0) {
        document.getElementById('lastKickTime').textContent = new Date(kicks[kicks.length - 1]).toLocaleTimeString();
    } else {
        document.getElementById('lastKickTime').textContent = '-';
    }

    updateKickHistory();
}

function updateKickHistory() {
    const historyDiv = document.getElementById('kickHistoryList');
    const recentSessions = [...state.kickSessions]
        .sort((a, b) => new Date(b.startedAt) - new Date(a.startedAt))
        .slice(0, 7);

    if (recentSessions.length === 0) {
        historyDiv.innerHTML = '<p class="info-text">No kick sessions recorded yet.</p>';
    } else {
        historyDiv.innerHTML = recentSessions.map(session => `
            <div class="history-card">
                <strong>${session.date}</strong><br>
                Total kicks: ${session.count}<br>
                Started: ${new Date(session.startedAt).toLocaleTimeString()}
            </div>
        `).join('');
    }

    updateKickChart();
}

function updateKickChart() {
    const canvas = document.getElementById('kickChart');
    if (!canvas) return;

    // Sum kicks per calendar date across (possibly multiple) sessions
    const byDate = {};
    state.kickSessions.forEach(session => {
        byDate[session.date] = (byDate[session.date] || 0) + session.count;
    });

    const dates = Object.keys(byDate)
        .sort((a, b) => new Date(a) - new Date(b))
        .slice(-7);

    if (dates.length === 0) return;

    const ctx = canvas.getContext('2d');

    if (window.kickChartInstance) {
        window.kickChartInstance.destroy();
    }

    window.kickChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: dates.map(d => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
            datasets: [{
                label: 'Kicks per Day',
                data: dates.map(d => byDate[d]),
                backgroundColor: '#ff6b9d'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } }
        }
    });
}

// ========== CONTRACTION TIMER ==========

function startContraction() {
    contractionTimer.isRunning = true;
    contractionTimer.startTime = new Date();

    document.getElementById('startContractionBtn').disabled = true;
    document.getElementById('stopContractionBtn').disabled = false;

    contractionTimer.interval = setInterval(() => {
        const now = new Date();
        const diff = now - contractionTimer.startTime;
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;

        document.getElementById('contractionDuration').textContent =
            `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;

        const progress = document.getElementById('timerProgress');
        const circumference = 2 * Math.PI * 90;
        const cappedSeconds = Math.min(seconds, CONTRACTION_RING_MAX_SEC);
        const offset = circumference - (cappedSeconds / CONTRACTION_RING_MAX_SEC) * circumference;
        progress.style.strokeDashoffset = Math.max(0, offset);
    }, 100);
}

async function stopContraction() {
    clearInterval(contractionTimer.interval);

    const startTime = contractionTimer.startTime;
    const endTime = new Date();
    const duration = Math.floor((endTime - startTime) / 1000);

    document.getElementById('startContractionBtn').disabled = false;
    document.getElementById('stopContractionBtn').disabled = true;
    document.getElementById('contractionDuration').textContent = '00:00';
    document.getElementById('timerProgress').style.strokeDashoffset = 565;

    contractionTimer.isRunning = false;

    try {
        const created = await api.post('/contractions', {
            startTime: startTime.toISOString(),
            endTime: endTime.toISOString(),
            durationSec: duration
        });
        state.contractions.unshift(created);
        updateContractionDisplay();
        checkContractionPattern();
    } catch (err) {
        showNotification(err.message || 'Could not save contraction');
    }
}

async function resetContractions() {
    if (!confirm('Clear all contraction records?')) return;
    try {
        await api.delete('/contractions');
        state.contractions = [];
        updateContractionDisplay();
        document.getElementById('contractionAlert').style.display = 'none';
        document.getElementById('earlyLaborAlert').style.display = 'none';
    } catch (err) {
        showNotification(err.message || 'Could not clear contractions');
    }
}

function updateContractionDisplay() {
    const todayContractions = state.contractions.filter(c => {
        const cDate = new Date(c.startTime);
        return cDate.toDateString() === new Date().toDateString();
    });

    document.getElementById('totalContractions').textContent = todayContractions.length;

    if (todayContractions.length >= 2) {
        let totalInterval = 0;
        for (let i = 0; i < todayContractions.length - 1; i++) {
            const interval = (new Date(todayContractions[i].startTime) - new Date(todayContractions[i + 1].startTime)) / 1000 / 60;
            totalInterval += interval;
        }
        const avgInterval = Math.round(Math.abs(totalInterval) / (todayContractions.length - 1));
        document.getElementById('avgInterval').textContent = avgInterval + ' min';
        document.getElementById('contractionInterval').textContent = avgInterval + ' min';

        const avgDuration = Math.round(
            todayContractions.reduce((sum, c) => sum + (c.durationSec || 0), 0) / todayContractions.length
        );
        document.getElementById('avgDuration').textContent = avgDuration + 's';
    } else {
        document.getElementById('avgInterval').textContent = '-';
        document.getElementById('avgDuration').textContent = '-';
        document.getElementById('contractionInterval').textContent = '-';
    }

    const oneHourAgo = Date.now() - (60 * 60 * 1000);
    const lastHourCount = state.contractions.filter(c =>
        new Date(c.startTime).getTime() > oneHourAgo
    ).length;
    document.getElementById('contractionsLastHour').textContent = lastHourCount;

    let pattern = 'Irregular';
    if (todayContractions.length >= 3) {
        const intervals = [];
        for (let i = 0; i < Math.min(3, todayContractions.length - 1); i++) {
            intervals.push(Math.abs(new Date(todayContractions[i].startTime) - new Date(todayContractions[i + 1].startTime)) / 1000 / 60);
        }
        const avgInt = intervals.reduce((a, b) => a + b, 0) / intervals.length;
        if (avgInt <= 5) pattern = 'Active Labor';
        else if (avgInt <= 10) pattern = 'Early Labor';
        else pattern = 'Irregular';
    }
    document.getElementById('pattern').textContent = pattern;

    const contractionList = document.getElementById('contractionList');
    if (todayContractions.length === 0) {
        contractionList.innerHTML = '<p class="info-text">No contractions recorded today.</p>';
        return;
    }

    contractionList.innerHTML = todayContractions.map((c, index) => {
        const time = new Date(c.startTime).toLocaleTimeString();
        const interval = index < todayContractions.length - 1 ?
            Math.round(Math.abs(new Date(c.startTime) - new Date(todayContractions[index + 1].startTime)) / 1000 / 60) : null;

        return `
            <div class="contraction-entry">
                <strong>${time}</strong> - Duration: ${c.durationSec}s
                ${interval !== null ? ` | Interval: ${interval} min` : ''}
            </div>
        `;
    }).join('');
}

function checkContractionPattern() {
    if (state.contractions.length < 3) return;

    const recent = state.contractions.slice(0, 3);
    const intervals = [];

    for (let i = 0; i < 2; i++) {
        const interval = Math.abs(new Date(recent[i].startTime) - new Date(recent[i + 1].startTime)) / 1000 / 60;
        intervals.push(interval);
    }

    const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;

    if (avgInterval <= 5) {
        document.getElementById('contractionAlert').style.display = 'flex';
        document.getElementById('earlyLaborAlert').style.display = 'none';
    } else if (avgInterval <= 10) {
        document.getElementById('earlyLaborAlert').style.display = 'flex';
        document.getElementById('contractionAlert').style.display = 'none';
    } else {
        document.getElementById('contractionAlert').style.display = 'none';
        document.getElementById('earlyLaborAlert').style.display = 'none';
    }
}

function exportContractions() {
    if (state.contractions.length === 0) {
        alert('No contractions to export');
        return;
    }

    let text = 'CONTRACTION RECORD\n';
    text += `Patient: ${currentUser.name}\n`;
    text += `Date: ${new Date().toLocaleDateString()}\n\n`;
    text += 'Time\t\tDuration\tInterval\n';
    text += '='.repeat(50) + '\n';

    state.contractions.forEach((c, index) => {
        const time = new Date(c.startTime).toLocaleTimeString();
        const interval = index < state.contractions.length - 1 ?
            Math.round(Math.abs(new Date(c.startTime) - new Date(state.contractions[index + 1].startTime)) / 1000 / 60) + ' min' : '-';
        text += `${time}\t${c.durationSec}s\t\t${interval}\n`;
    });

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `contractions-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();

    showNotification('Contraction record exported! 📥');
}

// ========== HELPER FUNCTIONS ==========

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('notification-hide');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Quick actions from dashboard
function quickLogMood() {
    navigateTo('diary');
}

function quickAddMed() {
    navigateTo('medication');
}
