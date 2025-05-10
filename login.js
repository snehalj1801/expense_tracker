/*document.getElementById('login-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    try {
        const response = await fetch('http://localhost:3002/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: username, password })
        });

        if (response.ok) {
            const { token, user } = await response.json();
            localStorage.setItem('token', token);
            localStorage.setItem('userName', user.name);
            window.location.href = 'ET.html'; // Redirect to the expense tracker page
        } else {
            const { error } = await response.json();
            alert(error);
        }
    } catch (error) {
        console.error('Error logging in:', error);
        alert('An error occurred while logging in.');
    }
});*/

document.getElementById('login-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    try {
        const response = await fetch('http://localhost:3002/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: username, password })
        });

        if (response.ok) {
            const { token, user } = await response.json();
            localStorage.setItem('token', token);
            localStorage.setItem('userName', user.name);
            
            // Check if budgetLimit is set
            if (user.budgetLimit === 0) {
                window.location.href = 'budget.html'; // Redirect to budget page
            } else {
                window.location.href = 'ET.html'; // Redirect to the expense tracker page
            }
        } else {
            const { error } = await response.json();
            alert(error);
        }
    } catch (error) {
        console.error('Error logging in:', error);
        alert('An error occurred while logging in.');
    }
});

