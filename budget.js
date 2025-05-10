document.getElementById('budget-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const budgetAmount = parseFloat(document.getElementById('budget-amount').value);
    const username = localStorage.getItem('userName');
    const token = localStorage.getItem('token');

    try {
        const response = await fetch('http://localhost:3002/api/user/budget', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, budgetLimit: budgetAmount })
        });

        if (response.ok) {
            alert('Budget set successfully!');
            window.location.href = 'ET.html'; // Redirect to expense tracker page
        } else {
            const { error } = await response.json();
            alert(error);
        }
    } catch (error) {
        console.error('Error setting budget:', error);
        alert('An error occurred while setting the budget.');
    }
});
