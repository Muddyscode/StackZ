let spending = JSON.parse(localStorage.getItem('spending')) || [];
let goals = JSON.parse(localStorage.getItem('goals')) || [];
let paycheck = JSON.parse(localStorage.getItem('paycheck')) || { salary: 0, allocations: {} };
let hustleProgress = JSON.parse(localStorage.getItem('hustleProgress')) || [];
let hustleFilters = JSON.parse(localStorage.getItem('hustleFilters')) || [];
let badges = JSON.parse(localStorage.getItem('badges')) || [];

const sideHustles = [
    { name: "POS Business", category: "QuickCash", description: "Run a mobile payment terminal for cashless transactions 💳", capital: "Medium", time: "Medium", skill: "Basic", link: "https://paystack.com" },
    { name: "Affiliate Marketing", category: "QuickCash", description: "Promote products on social media for commissions 🤑", capital: "Low", time: "Low", skill: "None", link: "https://www.jumia.com.ng/affiliate-program/" },
    { name: "Ride-Sharing Driver", category: "QuickCash", description: "Drive for Uber or Bolt with your vehicle 🚗", capital: "Low", time: "Medium", skill: "Basic", link: "https://www.uber.com/ng/en/drive/" },
    { name: "Home Cleaning", category: "QuickCash", description: "Offer cleaning services to busy pros 🧹", capital: "Low", time: "Medium", skill: "None", link: "#" },
    { name: "Referral Agent", category: "QuickCash", description: "Connect landlords with tenants via social media 🏠", capital: "Low", time: "Low", skill: "None", link: "#" },
    { name: "Social Media Management", category: "QuickCash", description: "Manage Instagram/X accounts for local brands 📱", capital: "Low", time: "Medium", skill: "Basic", link: "https://www.canva.com" },
    { name: "Delivery Services", category: "QuickCash", description: "Deliver packages/food via bike or motorcycle 🚚", capital: "Medium", time: "High", skill: "Basic", link: "https://www.glovoapp.com" },
    { name: "Content Creation", category: "Passionate", description: "Make YouTube/TikTok videos on your passion 🎥", capital: "Low", time: "High", skill: "Basic", link: "https://www.youtube.com" },
    { name: "Freelance Writing", category: "Passionate", description: "Write articles for global clients on Upwork ✍️", capital: "Low", time: "Medium", skill: "Advanced", link: "https://www.upwork.com" },
    { name: "Graphic Design", category: "Passionate", description: "Design logos or graphics using Canva 🎨", capital: "Low", time: "Medium", skill: "Basic", link: "https://www.canva.com" },
    { name: "Online Tutoring", category: "Passionate", description: "Teach English or coding via Zoom 📚", capital: "Low", time: "Medium", skill: "Advanced", link: "https://www.preply.com" },
    { name: "Catering/Small Chops", category: "Passionate", description: "Cook for events from your kitchen 🍴", capital: "Medium", time: "High", skill: "Basic", link: "#" },
    { name: "Photography", category: "Passionate", description: "Shoot events or portraits with phone/camera 📸", capital: "Medium", time: "Medium", skill: "Basic", link: "#" },
    { name: "Fashion Design", category: "Passionate", description: "Create custom outfits or accessories 👗", capital: "Medium", time: "High", skill: "Advanced", link: "#" }
];

document.addEventListener('DOMContentLoaded', () => {
    updateDashboard();
    updateSpendingHistory();
    updateGoalList();
    updateInsights();
    updateHustleList();
    updateHustleProgress();
    updatePaycheckAllocation();
    updateMotivationalMessage();
    updateBadges();
    setupTabNavigation();
    setupMascot();
});

function loadChartJs(callback) {
    if (window.Chart) {
        callback();
        return;
    }
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
    script.onload = callback;
    document.head.appendChild(script);
}

function setupMascot() {
    const mascot = document.querySelectorAll('.mascot');
    const mascotMessages = document.querySelectorAll('.mascot-message');
    const quotes = [
        "Your hustle’s about to pop off! 🚀",
        "Stack that cash, slay the game! 🔥",
        "Big vibes, bigger wins! 💪",
        "Keep grinding, you’re a legend! 🏆",
        "Money moves only, fam! 💸"
    ];
    
    mascot.forEach((m, index) => {
        gsap.from(m, { y: -10, duration: 1, ease: 'bounce' });
        m.addEventListener('click', () => {
            const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
            mascotMessages[index].textContent = randomQuote;
            const audio = document.getElementById('click-sound');
            audio.play();
        });
    });
}

function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.classList.remove('hidden');
    gsap.fromTo(notification, { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' });
    setTimeout(() => {
        gsap.to(notification, { opacity: 0, y: -20, duration: 0.5, ease: 'power2.in', onComplete: () => {
            notification.classList.add('hidden');
        } });
    }, 3000);
}

function updateBadges() {
    const totalSpending = spending.reduce((sum, item) => sum + item.amount, 0);
    const hasGoalCompleted = goals.some(goal => goal.saved >= goal.target);
    const newBadges = [];
    
    if (totalSpending <= 50 && !badges.includes('Budget Boss')) {
        newBadges.push('Budget Boss');
        showNotification('You earned the Budget Boss badge! Spending under $50! 🤑');
    }
    if (hustleProgress.length >= 3 && !badges.includes('Hustle Starter')) {
        newBadges.push('Hustle Starter');
        showNotification('Hustle Starter badge unlocked! 3+ hustles added! 💼');
    }
    if (hasGoalCompleted && !badges.includes('Goal Slayer')) {
        newBadges.push('Goal Slayer');
        showNotification('Goal Slayer badge earned! You crushed a goal! 🎯');
    }
    
    if (newBadges.length > 0) {
        badges.push(...newBadges);
        localStorage.setItem('badges', JSON.stringify(badges));
    }
    
    const badgesDiv = document.getElementById('badges');
    badgesDiv.innerHTML = badges.length > 0
        ? badges.map(badge => `<span class="badge">${badge}</span>`).join('')
        : '<p>No badges yet! Keep stacking to earn some! 😎</p>';
}

document.getElementById('spending-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const amount = parseFloat(document.getElementById('amount').value);
    const category = document.getElementById('category').value;
    const date = new Date().toLocaleDateString();
    
    spending.push({ amount, category, date });
    localStorage.setItem('spending', JSON.stringify(spending));
    
    gsap.fromTo('#spending-form', { scale: 1 }, { scale: 1.05, duration: 0.2, yoyo: true, repeat: 1 });
    document.getElementById('click-sound').play();
    updateDashboard();
    updateSpendingHistory();
    updateInsights();
    updateBadges();
    document.getElementById('spending-form').reset();
});

document.getElementById('paycheck-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const salary = parseFloat(document.getElementById('salary').value);
    const allocations = {};
    document.querySelectorAll('.allocation-input').forEach(input => {
        const category = input.getAttribute('data-category');
        const value = parseFloat(input.value) || 0;
        allocations[category] = value;
    });
    
    const totalPercent = Object.values(allocations).reduce((sum, val) => sum + val, 0);
    if (totalPercent !== 100) {
        alert('Allocations must add up to 100%!');
        return;
    }
    
    paycheck = { salary, allocations };
    localStorage.setItem('paycheck', JSON.stringify(paycheck));
    document.getElementById('click-sound').play();
    gsap.fromTo('#paycheck-form', { scale: 1 }, { scale: 1.05, duration: 0.2, yoyo: true, repeat: 1 });
    updatePaycheckAllocation();
    document.getElementById('paycheck-form').reset();
});

document.getElementById('goal-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('goal-name').value;
    const target = parseFloat(document.getElementById('goal-target').value);
    const saved = parseFloat(document.getElementById('goal-saved').value);
    const index = parseInt(document.getElementById('goal-index').value);
    
    if (index === -1) {
        goals.push({ name, target, saved });
    } else {
        goals[index] = { name, target, saved };
    }
    
    localStorage.setItem('goals', JSON.stringify(goals));
    document.getElementById('click-sound').play();
    gsap.fromTo('#goal-form', { scale: 1 }, { scale: 1.05, duration: 0.2, yoyo: true, repeat: 1 });
    updateGoalList();
    if (saved >= target) {
        triggerConfetti();
        showNotification('You’re crushing it! Goal completed! 🎉');
    } else if (saved >= target * 0.5) {
        showNotification('Halfway to your goal! Keep it up! 💪');
    }
    
    updateBadges();
    document.getElementById('goal-form').reset();
    document.getElementById('goal-index').value = -1;
    updateMotivationalMessage();
});

document.getElementById('hustle-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const category = document.getElementById('hustle-category').value;
    const time = document.getElementById('time-commitment').value;
    const capital = document.getElementById('capital-needed').value;
    const skill = document.getElementById('skill-level').value;
    
    hustleFilters = { category, time, capital, skill };
    localStorage.setItem('hustleFilters', JSON.stringify(hustleFilters));
    document.getElementById('click-sound').play();
    gsap.fromTo('#hustle-form', { scale: 1 }, { scale: 1.05, duration: 0.2, yoyo: true, repeat: 1 });
    updateHustleList();
});

document.getElementById('hustle-progress-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('hustle-name').value;
    const earningsGoal = parseFloat(document.getElementById('hustle-earnings-goal').value);
    const earnings = parseFloat(document.getElementById('hustle-earnings').value);
    
    hustleProgress.push({ name, earningsGoal, earnings });
    localStorage.setItem('hustleProgress', JSON.stringify(hustleProgress));
    document.getElementById('click-sound').play();
    gsap.fromTo('#hustle-progress-form', { scale: 1 }, { scale: 1.05, duration: 0.2, yoyo: true, repeat: 1 });
    updateHustleProgress();
    if (hustleProgress.length === 1) {
        showNotification('First hustle added! You’re on fire! 🔥');
    }
    updateBadges();
    document.getElementById('hustle-progress-form').reset();
});

function updateDashboard() {
    const total = spending.reduce((sum, item) => sum + item.amount, 0).toFixed(2);
    document.getElementById('total-spending').textContent = total;
    
    const categories = {};
    spending.forEach(item => {
        categories[item.category] = (categories[item.category] || 0) + item.amount;
    });
    const summary = Object.entries(categories)
        .map(([cat, amt]) => `${cat}: $${amt.toFixed(2)}`)
        .join('<br>');
    document.getElementById('category-summary').innerHTML = summary || 'No spending yet!';
    
    const vibeChecks = [
        { condition: () => total == 0, message: "Let's start stacking that cash! 😎" },
        { condition: () => total > 50 && spending.some(item => item.category === 'Food'), message: "Too many boba runs? Brew at home! ☕" },
        { condition: () => total > 50 && spending.some(item => item.category === 'Shopping'), message: "Retail therapy overload? Hit the thrift store! 🛍️" },
        { condition: () => total > 50 && spending.some(item => item.category === 'Entertainment'), message: "Streaming subs stacking up? Try free events! 🎉" },
        { condition: () => total > 50 && spending.some(item => item.category === 'Transport'), message: "Rideshares draining you? Carpool vibes! 🚗" },
        { condition: () => total > 50 && spending.some(item => item.category === 'Bills'), message: "Bills hitting hard? Time to budget! 📱" },
        { condition: () => total > 50 && spending.some(item => item.category === 'Hobbies'), message: "Hobbies costing big? DIY some fun! 🎨" },
        { condition: () => total > 50 && spending.some(item => item.category === 'Travel'), message: "Travel fever? Save for that trip! ✈️" },
        { condition: () => total > 50 && spending.some(item => item.category === 'Self-Care'), message: "Spa day splurge? Try DIY face masks! 😷" },
        { condition: () => total > 50 && spending.some(item => item.category === 'Education'), message: "Learning’s pricey? Check free courses! 📚" },
        { condition: () => total > 50 && spending.some(item => item.category === 'Other'), message: "Random spends adding up? Track that cash! 💸" },
        { condition: () => total > 100 && spending.some(item => item.category === 'Food'), message: "Foodie vibes? Meal prep to save! 🍳" },
        { condition: () => total > 100 && spending.some(item => item.category === 'Shopping'), message: "Shopping spree? Hunt for deals! 🤑" },
        { condition: () => total > 100 && spending.some(item => item.category === 'Entertainment'), message: "Party mode on? Find free fun! 🎶" },
        { condition: () => total > 100 && spending.some(item => item.category === 'Transport'), message: "Uber bills high? Bike it out! 🚲" },
        { condition: () => total > 100 && spending.some(item => item.category === 'Bills'), message: "Bills crushing you? Cut subscriptions! 📺" },
        { condition: () => total > 100 && spending.some(item => item.category === 'Hobbies'), message: "Hobby costs wild? Swap with friends! 🖌️" },
        { condition: () => total > 100 && spending.some(item => item.category === 'Travel'), message: "Wanderlust? Plan budget trips! 🌍" },
        { condition: () => total > 100 && spending.some(item => item.category === 'Self-Care'), message: "Self-care splurge? Free workouts FTW! 💪" },
        { condition: () => total <= 50, message: "You’re slaying the budget game! 🔥" },
        { condition: () => true, message: "Keep stacking, legend! 💰" }
    ];
    
    const vibe = vibeChecks.find(v => v.condition())?.message || "Keep it chill, fam! 😎";
    document.getElementById('vibe-check').textContent = vibe;
}

function updateSpendingHistory() {
    const tbody = document.getElementById('spending-history');
    tbody.innerHTML = '';
    spending.forEach((item, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="p-2">$${item.amount.toFixed(2)}</td>
            <td class="p-2">${item.category}</td>
            <td class="p-2">${item.date}</td>
            <td class="p-2"><button class="delete-btn sound-btn" data-index="${index}" tabindex="0">Delete</button></td>
        `;
        tbody.appendChild(row);
    });
    
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const index = btn.getAttribute('data-index');
            spending.splice(index, 1);
            localStorage.setItem('spending', JSON.stringify(spending));
            document.getElementById('click-sound').play();
            updateDashboard();
            updateSpendingHistory();
            updateInsights();
            updateBadges();
        });
    });
}

function updateGoalList() {
    const goalList = document.getElementById('goal-list');
    goalList.innerHTML = '';
    goals.forEach((goal, index) => {
        const percentage = Math.min((goal.saved / goal.target) * 100, 100).toFixed(0);
        const div = document.createElement('div');
        div.className = 'mb-4';
        div.innerHTML = `
            <p class="text-lg">${goal.name}: $${goal.saved.toFixed(2)} / $${goal.target.toFixed(2)} (${percentage}%)</p>
            <div class="progress-bar">
                <div class="progress-bar-fill" style="width: ${percentage}%"></div>
            </div>
            <button class="delete-btn mt-2 sound-btn" data-index="${index}" tabindex="0">Delete</button>
            <button class="edit-btn mt-2 ml-2 bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded sound-btn" data-index="${index}" tabindex="0">Edit</button>
        `;
        goalList.appendChild(div);
    });
    
    document.querySelectorAll('#goal-list .delete-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const index = btn.getAttribute('data-index');
            goals.splice(index, 1);
            localStorage.setItem('goals', JSON.stringify(goals));
            document.getElementById('click-sound').play();
            updateGoalList();
            updateMotivationalMessage();
            updateBadges();
        });
    });
    
    document.querySelectorAll('#goal-list .edit-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const index = btn.getAttribute('data-index');
            const goal = goals[index];
            document.getElementById('goal-name').value = goal.name;
            document.getElementById('goal-target').value = goal.target;
            document.getElementById('goal-saved').value = goal.saved;
            document.getElementById('goal-index').value = index;
            document.getElementById('click-sound').play();
        });
    });
}

function updateHustleList() {
    const hustleList = document.getElementById('hustle-list');
    hustleList.innerHTML = '';
    
    const filteredHustles = sideHustles.filter(hustle => {
        return (
            (hustleFilters.category === 'all' || hustle.category === hustleFilters.category) &&
            (hustleFilters.time === 'all' || hustle.time === hustleFilters.time) &&
            (hustleFilters.capital === 'all' || hustle.capital === hustleFilters.capital) &&
            (hustleFilters.skill === 'all' || hustle.skill === hustleFilters.skill)
        );
    });
    
    filteredHustles.forEach(hustle => {
        const div = document.createElement('div');
        div.className = 'hustle-card';
        div.innerHTML = `
            <h4 class="text-lg font-semibold">${hustle.name}</h4>
            <p>${hustle.description}</p>
            <p>Capital: ${hustle.capital} | Time: ${hustle.time} | Skill: ${hustle.skill}</p>
            <a href="${hustle.link}" target="_blank" class="text-blue-300 hover:underline">Get Started</a>
        `;
        gsap.from(div, { opacity: 0, y: 20, duration: 0.5 });
        hustleList.appendChild(div);
    });
    
    if (filteredHustles.length === 0) {
        hustleList.innerHTML = '<p>No hustles match your filters! Try adjusting them.</p>';
    }
}

function updateHustleProgress() {
    const progressList = document.getElementById('hustle-progress-list');
    progressList.innerHTML = '';
    hustleProgress.forEach((hustle, index) => {
        const percentage = Math.min((hustle.earnings / hustle.earningsGoal) * 100, 100).toFixed(0);
        const div = document.createElement('div');
        div.className = 'mb-4';
        div.innerHTML = `
            <p class="text-lg">${hustle.name}: $${hustle.earnings.toFixed(2)} / $${hustle.earningsGoal.toFixed(2)} (${percentage}%)</p>
            <div class="progress-bar">
                <div class="progress-bar-fill" style="width: ${percentage}%"></div>
            </div>
            <button class="delete-btn mt-2 sound-btn" data-index="${index}" tabindex="0">Delete</button>
        `;
        progressList.appendChild(div);
    });
    
    document.querySelectorAll('#hustle-progress-list .delete-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const index = btn.getAttribute('data-index');
            hustleProgress.splice(index, 1);
            localStorage.setItem('hustleProgress', JSON.stringify(hustleProgress));
            document.getElementById('click-sound').play();
            updateHustleProgress();
            updateBadges();
        });
    });
}

function updatePaycheckAllocation() {
    const result = document.getElementById('allocation-result');
    if (paycheck.salary === 0) {
        result.innerHTML = 'Enter your salary to allocate!';
        return;
    }
    
    const allocations = Object.entries(paycheck.allocations)
        .map(([cat, percent]) => `${cat}: $${((percent / 100) * paycheck.salary).toFixed(2)} (${percent}%)`)
        .join('<br>');
    result.innerHTML = `<p class="text-lg">Salary: $${paycheck.salary.toFixed(2)}</p><p>${allocations}</p>`;
}

function updateMotivationalMessage() {
    const messages = [
        "Keep grinding for that drip! 🔥",
        "Saving for the vibes? You got this! 😎",
        "Stack that cash for your dreams! 💸",
        "Big goals, big wins! Keep it up! 🏆",
        "Your hustle’s paying off! 💪"
    ];
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    document.getElementById('motivational-message').textContent = randomMessage;
}

function triggerConfetti() {
    gsap.to('body', {
        duration: 0,
        onStart: () => {
            for (let i = 0; i < 20; i++) {
                const confetti = document.createElement('div');
                confetti.className = 'confetti';
                confetti.style.position = 'absolute';
                confetti.style.width = '10px';
                confetti.style.height = '10px';
                confetti.style.background = ['#ff1493', '#00b7eb', '#00ff00'][Math.floor(Math.random() * 3)];
                confetti.style.left = Math.random() * 100 + 'vw';
                confetti.style.top = '-10px';
                document.body.appendChild(confetti);
                
                gsap.to(confetti, {
                    y: '100vh',
                    rotation: Math.random() * 360,
                    duration: 2 + Math.random(),
                    ease: 'power1.in',
                    onComplete: () => confetti.remove()
                });
            }
        }
    });
}

function updateInsights() {
    loadChartJs(() => {
        const categories = {};
        spending.forEach(item => {
            categories[item.category] = (categories[item.category] || 0) + item.amount;
        });
        
        const chartData = {
            labels: Object.keys(categories),
            datasets: [{
                data: Object.values(categories),
                backgroundColor: ['#ff1493', '#00b7eb', '#00ff00', '#ff4444', '#ffd700', '#6b7280', '#8b5cf6', '#ec4899', '#3b82f6', '#22c55e']
            }]
        };
        
        const ctx = document.getElementById('spending-chart').getContext('2d');
        if (window.spendingChart) window.spendingChart.destroy();
        window.spendingChart = new Chart(ctx, {
            type: 'pie',
            data: chartData,
            options: {
                responsive: true,
                plugins: {
                    legend: { position: 'bottom', labels: { color: '#fff' } }
                }
            }
        });
        
        const insightsList = document.getElementById('insights-list');
        insightsList.innerHTML = '';
        const topCategories = Object.entries(categories)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([cat, amt]) => {
                const messages = {
                    Food: `Food’s eating $${amt.toFixed(2)}! Try meal prepping 🍳`,
                    Shopping: `$${amt.toFixed(2)} on shopping? Hunt for deals! 🤑`,
                    Entertainment: `$${amt.toFixed(2)} on fun? Check free events! 🎉`,
                    Transport: `$${amt.toFixed(2)} on rides? Carpool vibes! 🚗`,
                    Bills: `$${amt.toFixed(2)} on bills? Cut subscriptions! 📺`,
                    Hobbies: `$${amt.toFixed(2)} on hobbies? DIY some fun! 🖌️`,
                    Travel: `$${amt.toFixed(2)} on travel? Plan budget trips! 🌍`,
                    "Self-Care": `$${amt.toFixed(2)} on self-care? Free workouts FTW! 💪`,
                    Education: `$${amt.toFixed(2)} on learning? Free courses rock! 📚`,
                    Other: `$${amt.toFixed(2)} on random stuff? Track that cash! 💸`
                };
                return `<p class="text-lg">${messages[cat]}</p>`;
            });
        insightsList.innerHTML = insightsList.innerHTML || '<p>No insights yet! Add some spending!</p>';
    });
}

function setupTabNavigation() {
    const tabs = document.querySelectorAll('.tab-btn');
    const contents = document.querySelectorAll('.tab-content');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => {
                t.classList.remove('active');
                t.setAttribute('aria-selected', 'false');
            });
            tab.classList.add('active');
            tab.setAttribute('aria-selected', 'true');
            
            contents.forEach(content => content.classList.add('hidden'));
            document.getElementById(tab.getAttribute('data-tab')).classList.remove('hidden');
            updateMotivationalMessage();
            document.getElementById('click-sound').play();
        });
    });
}