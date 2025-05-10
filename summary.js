/*document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('userName');

    // Fetch user data from the server
    try {
        const response = await fetch(`http://localhost:3002/api/user/${username}`, {
        //const response = await fetch(`http://localhost:3002/api/markAsDone`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const userData = await response.json();

            // Update the HTML with the user's budget and savings
            const budgetLimitElement = document.getElementById('budget-limit');
            const savingsElement = document.getElementById('savings');

            if (budgetLimitElement && savingsElement) {
                budgetLimitElement.textContent = userData.budgetLimit;
                savingsElement.textContent = userData.savings || 0;  // Default to 0 if savings is not defined
            } else {
                console.warn("Elements 'budget-limit' and/or 'savings' not found in the HTML.");
            }

            // Populate the expense summary table
            const expenseTableBody = document.getElementById('expense-summary').querySelector('tbody');
            if (userData.expenses && expenseTableBody) {
                userData.expenses.forEach(expense => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${expense.date}</td>
                        <td>${expense.name}</td>
                        <td>₹${expense.amount}</td>
                    `;
                    expenseTableBody.appendChild(row);
                });
            }
        } else {
            console.error("Failed to fetch user data.");
        }
    } catch (error) {
        console.error("Error fetching user data:", error);
    }
});*/


document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');

    try {
        // Fetch the summary data from the server
        const response = await fetch(`http://localhost:3002/api/getSummary`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const summaryData = await response.json();

            // Update HTML with the user's budget and savings
            const budgetLimitElement = document.getElementById('budget-limit');
            const savingsElement = document.getElementById('savings');
            
            if (budgetLimitElement && savingsElement) {
                budgetLimitElement.textContent = summaryData.budgetLimit || 0;
                savingsElement.textContent = summaryData.savings || 0;
            } else {
                console.warn("Elements 'budget-limit' and/or 'savings' not found in the HTML.");
            }

            // Populate the expense summary table
            const expenseTableBody = document.getElementById('expense-summary').querySelector('tbody');
            if (summaryData.expenses && expenseTableBody) {
                summaryData.expenses.forEach(expense => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${expense.date}</td>
                        <td>${expense.name}</td>
                        <td>₹${expense.amount}</td>
                    `;
                    expenseTableBody.appendChild(row);
                });
            }
        } else {
            console.error("Failed to fetch summary data.");
        }
    } catch (error) {
        console.error("Error fetching summary data:", error);
    }
});


// Trigger restart tracking
async function restartTracking() {
    const token = localStorage.getItem('token');

    try {
        const response = await fetch('http://localhost:3002/api/restartTracking', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            alert('Tracking reset. Set a new budget to start fresh.');
            window.location.href = 'budget.html';
        } else {
            console.error("Failed to restart tracking.");
        }
    } catch (error) {
        console.error("Error restarting tracking:", error);
    }
}