// ========== PREGNANCY TRACKING ========== 

class PregnancyTracker {
    constructor(pregnancyStartDate) {
        this.startDate = new Date(pregnancyStartDate);
    }

    getWeeksPregnant() {
        const today = new Date();
        const diffTime = today - this.startDate;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        return Math.floor(diffDays / 7);
    }

    getDaysPregnant() {
        const today = new Date();
        const diffTime = today - this.startDate;
        return Math.floor(diffTime / (1000 * 60 * 60 * 24));
    }

    getTrimester() {
        const weeks = this.getWeeksPregnant();
        if (weeks <= 12) return "First Trimester";
        if (weeks <= 26) return "Second Trimester";
        return "Third Trimester";
    }

    getDueDate() {
        const dueDate = new Date(this.startDate);
        dueDate.setDate(dueDate.getDate() + 280); // 40 weeks
        return dueDate;
    }

    getDaysUntilDue() {
        const today = new Date();
        const dueDate = this.getDueDate();
        const diffTime = dueDate - today;
        return Math.floor(diffTime / (1000 * 60 * 60 * 24));
    }

    getBabySize() {
        const weeks = this.getWeeksPregnant();
        const sizes = {
            4: { size: "Poppy seed", length: "2mm", emoji: "🌱" },
            5: { size: "Sesame seed", length: "3mm", emoji: "🌱" },
            6: { size: "Lentil", length: "5mm", emoji: "🫘" },
            7: { size: "Blueberry", length: "1cm", emoji: "🫐" },
            8: { size: "Kidney bean", length: "1.6cm", emoji: "🫘" },
            9: { size: "Grape", length: "2.3cm", emoji: "🍇" },
            10: { size: "Strawberry", length: "3.1cm", emoji: "🍓" },
            11: { size: "Fig", length: "4.1cm", emoji: "🫒" },
            12: { size: "Lime", length: "5.4cm", emoji: "🍋" },
            13: { size: "Peapod", length: "7.4cm", emoji: "🫛" },
            14: { size: "Lemon", length: "8.7cm", emoji: "🍋" },
            15: { size: "Apple", length: "10.1cm", emoji: "🍎" },
            16: { size: "Avocado", length: "11.6cm", emoji: "🥑" },
            17: { size: "Pear", length: "13cm", emoji: "🍐" },
            18: { size: "Sweet potato", length: "14.2cm", emoji: "🍠" },
            19: { size: "Mango", length: "15.3cm", emoji: "🥭" },
            20: { size: "Banana", length: "25.6cm", emoji: "🍌" },
            21: { size: "Carrot", length: "26.7cm", emoji: "🥕" },
            22: { size: "Papaya", length: "27.8cm", emoji: "🍈" },
            23: { size: "Grapefruit", length: "28.9cm", emoji: "🍊" },
            24: { size: "Corn", length: "30cm", emoji: "🌽" },
            25: { size: "Cauliflower", length: "34.6cm", emoji: "🥦" },
            26: { size: "Lettuce", length: "35.6cm", emoji: "🥬" },
            27: { size: "Cabbage", length: "36.6cm", emoji: "🥬" },
            28: { size: "Eggplant", length: "37.6cm", emoji: "🍆" },
            29: { size: "Butternut squash", length: "38.6cm", emoji: "🎃" },
            30: { size: "Cucumber", length: "39.9cm", emoji: "🥒" },
            31: { size: "Coconut", length: "41.1cm", emoji: "🥥" },
            32: { size: "Jicama", length: "42.4cm", emoji: "🥔" },
            33: { size: "Pineapple", length: "43.7cm", emoji: "🍍" },
            34: { size: "Cantaloupe", length: "45cm", emoji: "🍈" },
            35: { size: "Honeydew", length: "46.2cm", emoji: "🍈" },
            36: { size: "Romaine lettuce", length: "47.4cm", emoji: "🥬" },
            37: { size: "Swiss chard", length: "48.6cm", emoji: "🥬" },
            38: { size: "Leek", length: "49.8cm", emoji: "🧅" },
            39: { size: "Mini watermelon", length: "50.7cm", emoji: "🍉" },
            40: { size: "Pumpkin", length: "51.2cm", emoji: "🎃" }
        };

        return sizes[weeks] || { size: "Baby", length: "Growing!", emoji: "👶" };
    }

    getWeeklyDevelopment() {
        const weeks = this.getWeeksPregnant();
        const developments = {
            4: {
                title: "Embryonic Stage Begins",
                developments: [
                    "The neural tube is forming",
                    "Heart begins to develop",
                    "Amniotic sac is forming"
                ]
            },
            8: {
                title: "Major Organs Developing",
                developments: [
                    "All major organs are forming",
                    "Arms and legs are growing",
                    "Facial features are developing",
                    "Heart is beating regularly"
                ]
            },
            12: {
                title: "End of First Trimester",
                developments: [
                    "Baby can make movements",
                    "Vocal cords are forming",
                    "Fingernails and toenails developing",
                    "Sex organs are developing"
                ]
            },
            16: {
                title: "Growing Stronger",
                developments: [
                    "Baby can hear sounds",
                    "Eyes can move",
                    "Bones are hardening",
                    "You might feel first movements"
                ]
            },
            20: {
                title: "Halfway There!",
                developments: [
                    "Baby is very active",
                    "Hair is growing",
                    "Vernix (protective coating) covers skin",
                    "Can hear your voice clearly"
                ]
            },
            24: {
                title: "Viability Milestone",
                developments: [
                    "Lungs are developing",
                    "Skin is still translucent",
                    "Regular sleep cycles",
                    "Taste buds are forming"
                ]
            },
            28: {
                title: "Third Trimester Begins",
                developments: [
                    "Can open and close eyes",
                    "Brain is very active",
                    "Stronger kicks and movements",
                    "Rapid weight gain"
                ]
            },
            32: {
                title: "Getting Ready",
                developments: [
                    "Practicing breathing movements",
                    "Bones fully formed (but soft)",
                    "Baby may be head down",
                    "Fat layers developing"
                ]
            },
            36: {
                title: "Almost Ready to Meet You",
                developments: [
                    "Lungs are nearly mature",
                    "Digestive system ready",
                    "Baby is gaining weight",
                    "Movements may feel different"
                ]
            },
            40: {
                title: "Full Term!",
                developments: [
                    "Baby is ready to be born",
                    "Most organs fully developed",
                    "Waiting for labor to begin",
                    "You could go into labor any day"
                ]
            }
        };

        // Find the closest week
        let closestWeek = 4;
        for (let week in developments) {
            if (weeks >= parseInt(week)) {
                closestWeek = week;
            }
        }

        return developments[closestWeek] || {
            title: "Your baby is growing!",
            developments: ["Baby is developing steadily"]
        };
    }

    getMilestones() {
        const weeks = this.getWeeksPregnant();
        const milestones = [
            { week: 6, icon: "💗", text: "Heartbeat detected", completed: weeks >= 6 },
            { week: 12, icon: "🎉", text: "End of first trimester", completed: weeks >= 12 },
            { week: 16, icon: "👋", text: "Possible gender reveal", completed: weeks >= 16 },
            { week: 20, icon: "📸", text: "Anatomy scan", completed: weeks >= 20 },
            { week: 24, icon: "🎯", text: "Viability milestone", completed: weeks >= 24 },
            { week: 28, icon: "🌟", text: "Third trimester", completed: weeks >= 28 },
            { week: 32, icon: "👶", text: "Baby practices breathing", completed: weeks >= 32 },
            { week: 37, icon: "✅", text: "Full term", completed: weeks >= 37 },
            { week: 40, icon: "🎊", text: "Due date!", completed: weeks >= 40 }
        ];

        return milestones;
    }

    getRecommendedWeightGain() {
        const weeks = this.getWeeksPregnant();
        // Based on normal BMI (18.5-24.9)
        // Recommended total gain: 11.5-16 kg
        
        if (weeks <= 12) {
            return "0.5-2 kg";
        } else if (weeks <= 26) {
            return "5-7 kg";
        } else {
            return "11.5-16 kg";
        }
    }
}

// Load Pregnancy Dashboard
function loadPregnancyDashboard() {
    if (currentUser.pregnancyStatus !== 'pregnant' || !currentUser.pregnancyStartDate) {
        document.getElementById('pregnancyDashboard').style.display = 'none';
        document.getElementById('notPregnantMessage').style.display = 'block';
        return;
    }

    document.getElementById('pregnancyDashboard').style.display = 'block';
    document.getElementById('notPregnantMessage').style.display = 'none';

    const tracker = new PregnancyTracker(currentUser.pregnancyStartDate);
    
    // Overview
    const weeks = tracker.getWeeksPregnant();
    const days = tracker.getDaysPregnant() % 7;
    document.getElementById('currentWeek').textContent = `Week ${weeks}+${days}`;
    document.getElementById('currentTrimester').textContent = tracker.getTrimester();
    
    const dueDate = tracker.getDueDate();
    document.getElementById('dueDate').textContent = dueDate.toLocaleDateString();
    
    const daysRemaining = tracker.getDaysUntilDue();
    document.getElementById('daysRemaining').textContent = `${daysRemaining} days to go`;
    
    const babySize = tracker.getBabySize();
    document.getElementById('babySizeEmoji').textContent = babySize.emoji || '👶';
    document.getElementById('babySize').textContent = babySize.size;
    document.getElementById('babySizeCompare').textContent = `~${babySize.length}`;
    
    // Weekly Development
    const development = tracker.getWeeklyDevelopment();
    document.getElementById('weeklyDevelopment').innerHTML = `
        <h4>${development.title}</h4>
        <ul>
            ${development.developments.map(d => `<li>${d}</li>`).join('')}
        </ul>
    `;
    
    // Weight Tracking
    loadWeightTracking();
    
    // Milestones
    const milestones = tracker.getMilestones();
    document.getElementById('milestones').innerHTML = milestones.map(m => `
        <div class="milestone-item ${m.completed ? 'completed' : ''}">
            <span class="milestone-icon">${m.completed ? '✅' : m.icon}</span>
            <div>
                <strong>Week ${m.week}</strong>: ${m.text}
            </div>
        </div>
    `).join('');
    
    document.getElementById('recommendedGain').textContent = tracker.getRecommendedWeightGain();
}

function loadWeightTracking() {
    const weightHistory = state.weightLogs; // ordered oldest -> newest

    if (weightHistory.length > 0) {
        const current = weightHistory[weightHistory.length - 1].weight;
        const starting = weightHistory[0].weight;
        const gained = current - starting;

        document.getElementById('currentWeight').textContent = current.toFixed(1) + ' kg';
        document.getElementById('weightGained').textContent = (gained >= 0 ? '+' : '') + gained.toFixed(1) + ' kg';
    } else {
        document.getElementById('currentWeight').textContent = '-';
        document.getElementById('weightGained').textContent = '-';
    }
}

function setupWeightForm() {
    const weightForm = document.getElementById('weightForm');

    weightForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const weight = parseFloat(document.getElementById('weightValue').value);
        const date = new Date().toISOString().split('T')[0];

        try {
            const created = await api.post('/weight', { date, weight });
            state.weightLogs.push(created);

            document.getElementById('weightValue').value = '';
            loadWeightTracking();
            updateWeightChart();
            showNotification('Weight logged! ⚖️');
            trackEvent('log_weight');
        } catch (err) {
            showNotification(err.message || 'Could not log weight');
        }
    });

    updateWeightChart();
}

function updateWeightChart() {
    const canvas = document.getElementById('weightChart');
    const emptyMessage = document.getElementById('weightChartEmpty');
    if (!canvas) return;

    const weights = state.weightLogs; // already oldest -> newest

    if (weights.length < 2) {
        canvas.style.display = 'none';
        if (emptyMessage) emptyMessage.style.display = 'block';
        return;
    }

    canvas.style.display = 'block';
    if (emptyMessage) emptyMessage.style.display = 'none';

    const ctx = canvas.getContext('2d');

    if (window.weightChartInstance) {
        window.weightChartInstance.destroy();
    }

    window.weightChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: weights.map(w => new Date(w.date).toLocaleDateString()),
            datasets: [{
                label: 'Weight (kg)',
                data: weights.map(w => w.weight),
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
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: false
                }
            }
        }
    });
}