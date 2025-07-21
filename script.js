// Initialize spending array from local storage or empty array
let spending = JSON.parse(localStorage.getItem('spending')) || [];

// Load total spending and vibe check on page load
document.addEventListener('DOMContentLoaded', () => {
    updateDashboard();
});

// Handle form submission
document.getElementById('spending-form').addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent form from reloading the page
    const amount = parseFloat(document.getElementById('amount').value);
    const category = document.getElementById('category').value;
    
    // Add new spending to array
    spending.push({ amount, category });
    
    // Save to local storage
    localStorage.setItem('spending', JSON.stringify(spending));
    
    // Update dashboard
    updateDashboard();
    
    // Reset form
    document.getElementById('spending-form').reset();
});

// Update dashboard with total spending and vibe check
function updateDashboard() {
    const total = spending.reduce((sum, item) => sum + item.amount, 0).toFixed(2);
    document.getElementById('total-spending').textContent = total;
    
    // Vibe check logic
    const vibeCheck = total > 50 ? "Chill on the takeout! 🥐" : "You're ballin'! 😎";
    document.getElementById('vibe-check').textContent = vibeCheck;
}