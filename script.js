// Initialize spending and goals arrays from local storage
let spending = JSON.parse(localStorage.getItem('spending')) || [];
let goals = JSON.parse(localStorage.getItem('goals')) || [];

// Load data on page load
document.addEventListener('DOMContentLoaded', () => {
    updateDashboard();
    updateSpendingHistory();
    updateGoalList();
    setupTabNavigation();
});

// Handle spending form submission
document.getElementById('spending-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const amount = parseFloat(document.getElementById('amount').value);
    const category = document.getElementById('category').value;
    const date = new Date().toLocaleDateString();
    
    spending.push({ amount, category, date });
    localStorage.setItem('spending', JSON.stringify(spending));
    
    updateDashboard();
    updateSpendingHistory();
    document.getElementById('spending-form').reset();
});

// Handle goal form submission
document.getElementById('goal-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('goal-name').value;
    const target = parseFloat(document.getElementById('goal-target').value);
    const saved = parseFloat(document.getElementById('goal-saved').value);
    
    goals.push({ name, target, saved });
    localStorage.setItem('goals', JSON.stringify(goals));
    
    updateGoalList();
    if (saved >= target) {
        triggerConfetti();
    }
    
    document.getElementById('goal-form').reset();
});

// Update dashboard with total spending and vibe check
function updateDashboard() {
    const total = spending.reduce((sum, item) => sum + item.amount, 0).toFixed(2);
    document.getElementById('total-spending').textContent = total;
    
    // Smarter vibe check
    const vibeChecks = [
        { condition: () => total == 0, message: "Let's start stacking! 😎" },
        { condition: () => total > 50 && spending.some(item => item.category === 'Food'), message: "Chill on the takeout, fam! 🍔" },
        { condition: () => total > 50 && spending.some(item => item.category === 'Shopping'), message: "Whoa, ease up on the retail therapy! 🛍️" },
        { condition: () => total > 50 && spending.some(item => item.category === 'Entertainment'), message: "Streaming subs adding up? Try free games! 🎮" },
        { condition: () => total > 50 && spending.some(item => item.category === 'Transport'), message: "Rideshares burning cash? Walk it out! 🚶" },
        { condition: () => total > 50 && spending.some(item => item.category === 'Bills'), message: "Bills piling up? Time to budget! 📱" },
        { condition: () => total > 50 && spending.some(item => item.category === 'Hobbies'), message: "Hobbies costing a vibe? DIY some fun! 🎨" },
        { condition: () => total > 50 && spending.some(item => item.category === 'Travel'), message: "Travel dreams? Save for that trip! ✈️" },
        { condition: () => total > 50 && spending.some(item => item.category === 'Self-Care'), message: "Self-care splurge? Try free workouts! 💪" },
        { condition: () => total <= 50, message: "You're ballin' on a budget! 🔥" }
    ];
    
    const vibe = vibeChecks.find(v => v.condition())?.message || "Keep stacking, legend! 💸";
    document.getElementById('vibe-check').textContent = vibe;
}

// Update spending history table
function updateSpendingHistory() {
    const tbody = document.getElementById('spending-history');
    tbody.innerHTML = '';
    spending.forEach((item, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="p-2">$${item.amount.toFixed(2)}</td>
            <td class="p-2">${item.category}</td>
            <td class="p-2">${item.date}</td>
            <td class="p-2"><button class="delete-btn" data-index="${index}">Delete</button></td>
        `;
        tbody.appendChild(row);
    });
    
    // Add delete button listeners
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const index = btn.getAttribute('data-index');
            spending.splice(index, 1);
            localStorage.setItem('spending', JSON.stringify(spending));
            updateDashboard();
            updateSpendingHistory();
        });
    });
}

// Update goal list with progress bars1
function updateGoalList() {
    const goalList = document.getElementById('goal-list');
    goalList.innerHTML = '';
    goals.forEach((goal, index) => {
        const percentage = Math.min((goal.saved / goal.target) * 100, 100);
        const div = document.createElement('div');
        div.className = 'mb-4';
        div.innerHTML = `
            <p class="text-lg">${goal.name}: $${goal.saved.toFixed(2)} / $${goal.target.toFixed(2)}</p>
            <div class="progress-bar">
                <div class="progress-bar-fill" style="width: ${percentage}%"></div>
            </div>
            <button class="delete-btn mt-2" data-index="${index}">Delete Goal</button>
        `;
        goalList.appendChild(div);
    });
    
    // Add delete button listeners
    document.querySelectorAll('#goal-list .delete-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const index = btn.getAttribute('data-index');
            goals.splice(index, 1);
            localStorage.setItem('goals', JSON.stringify(goals));
            updateGoalList();
        });
    });
}

// GSAP confetti animation
function triggerConfetti() {
    gsap.to('body', {
        duration: 0,
        onStart: () => {
            for (let i = 0; i < 50; i++) {
                const confetti = document.createElement('div');
                confetti.className = 'confetti';
                confetti.style.position = 'absolute';
                confetti.style.width = '10px';
                confetti.style.height = '10px';
                confetti.style.background = ['#ff1493', '#00ff00', '#00b7eb'][Math.floor(Math.random() * 3)];
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

// Tab navigation
function setupTabNavigation() {
    const tabs = document.querySelectorAll('.tab-btn');
    const contents = document.querySelectorAll('.tab-content');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            contents.forEach(content => content.classList.add('hidden'));
            document.getElementById(tab.getAttribute('data-tab')).classList.remove('hidden');
        });
    });
}