document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('userName');

    // Fetch user data from the server
    try {
        const response = await fetch(`http://localhost:3002/api/user/${username}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const userData = await response.json();

            // Update the HTML with the user's name and budget
            document.getElementById('user-name').textContent = `Welcome, ${userData.name}!`;
            document.getElementById('user-budget').textContent = `Budget Limit: ₹${userData.budgetLimit}`;
        } else {
            console.error("Failed to fetch user data.");
        }
    } catch (error) {
        console.error("Error fetching user data:", error);
    }
});

let date = document.getElementById("date");
let d = new Date();
let day = d.getDate();
let month = d.getMonth() + 1;
let year = d.getFullYear();

let fullDate = `Date : ${day}-${month}-${year}`;
date.innerHTML = fullDate;


window.jsPDF = window.jspdf.jsPDF;

function downloadPDF() {
    var docPDF = new jsPDF();
    var elementHTML = document.querySelector(".container");

    // Temporarily hide the download and logout buttons
    const downloadBtn = document.getElementById("btn");
    const logoutBtn = document.getElementById("logoutBtn");
    downloadBtn.style.display = "none";
    logoutBtn.style.display = "none";

    docPDF.html(elementHTML, {
        callback: function (docPDF) {
            docPDF.save(`expense${day}-${month}-${year}.pdf`);
        },
        x: 15,
        y: 15,
        width: 170,
        windowWidth: 650
    });
}

   /* // Restore the buttons after PDF generation
    downloadBtn.style.display = "block";
    logoutBtn.style.display = "block";*/

async function addExpense(event) {
    event.preventDefault();

    const expenseNameInput = document.getElementById("expense-name");
    const expenseAmountInput = document.getElementById("expense-amount");
    const expenseName = expenseNameInput.value;
    const expenseAmount = parseFloat(expenseAmountInput.value);

    expenseNameInput.value = "";
    expenseAmountInput.value = "";

    const token = localStorage.getItem('token');
    const username = localStorage.getItem('userName');

    // Fetch the user's current total expenses
    const response = await fetch(`http://localhost:3002/api/user/expenses/${username}`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    const expenses = await response.json();
    const currentTotal = expenses.reduce((sum, expense) => sum + expense.amount, 0);

    // Check if adding this expense exceeds the budget
    const userResponse = await fetch(`http://localhost:3002/api/user/${username}`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!userResponse.ok) {
        console.error("Failed to fetch user data");
        return;
    }

    const userData = await userResponse.json();
    const budgetLimit = userData.budgetLimit;

    if (currentTotal + expenseAmount > budgetLimit) {
        alert("Over budget! Expense not added.");
        return;
    }

    // Add expense to the backend
    try {
        const addExpenseResponse = await fetch('http://localhost:3002/api/user/expenses', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, name: expenseName, amount: expenseAmount })
        });

        if (!addExpenseResponse.ok) {
            throw new Error("Failed to add expense.");
        }

        renderExpenses(); // Call to render the updated expense list
    } catch (error) {
        console.error("Error adding expense:", error);
        alert("An error occurred while adding the expense.");
    }
}

async function deleteExpense(expenseId) {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('userName');

    try {
        const response = await fetch(`http://localhost:3002/api/user/expenses/${username}/${expenseId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        });

        if (response.ok) {
            renderExpenses(); // Refresh the expense list
        } else {
            alert("Failed to delete expense. Please try again.");
        }
    } catch (error) {
        console.error("Error deleting expense:", error);
        alert("An error occurred while deleting the expense.");
    }
}

// Function to clear all expenses for the current user
async function clearAllExpenses() {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('userName');

    try {
        const response = await fetch(`http://localhost:3002/api/user/expenses/${username}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            // Clear expense list on the frontend
            document.getElementById("expense-list").innerHTML = "";
            document.getElementById("total-amount").textContent = "0.00";
            alert("All expenses cleared successfully.");
        } else {
            console.error("Failed to clear expenses.");
            alert("Failed to clear expenses. Please try again.");
        }
    } catch (error) {
        console.error("Error clearing expenses:", error);
        alert("An error occurred while clearing expenses.");
    }
}

async function renderExpenses() {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('userName');
    const response = await fetch(`http://localhost:3002/api/user/expenses/${username}`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    const expenses = await response.json();

    const expenseList = document.getElementById("expense-list");
    expenseList.innerHTML = ""; // Clear the list

    let totalAmount = 0;

    expenses.forEach(expense => {
        const listItem = document.createElement("tr");
        listItem.innerHTML = `
            <td>${expense.name}</td>
            <td>₹${expense.amount.toFixed(2)}</td>
            <td><button onclick="deleteExpense('${expense._id}')">Delete</button></td>
        `;
        expenseList.appendChild(listItem);
        totalAmount += expense.amount;
    });

    // Update total amount displayed
    document.getElementById("total-amount").textContent = totalAmount.toFixed(2);
}

function logout() {
    // Clear the stored user data from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    
    // Redirect to the login page
    window.location.href = 'login.html'; // Change 'login.html' to your actual login page
}

// Mark as done and generate summary
async function markAsDone() {
    const token = localStorage.getItem('token');
    //const username = localStorage.getItem('userName');
    try {
        const response = await fetch('http://localhost:3002/api/markAsDone', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            window.location.href = 'summary.html';
        } else {
            console.error("Failed to mark as done.");
        }
    } catch (error) {
        console.error("Error marking as done:", error);
    }
}


// Call renderExpenses on page load
document.addEventListener("DOMContentLoaded", renderExpenses);





/*function markAsDone() {
    const budgetLimit = parseFloat(localStorage.getItem("budgetLimit")) || 0;
    const totalExpenses = parseFloat(document.getElementById("total-amount").innerText) || 0;
    const savings = budgetLimit - totalExpenses;

    // Prepare summary data
    const summaryData = {
        budgetLimit: budgetLimit,
        savings: savings,
        expenses: [],  // Populate with the expenses added (date-wise)
    };

    // Collect expense data (date-wise) from the table rows
    document.querySelectorAll('#expense-list tr').forEach((row) => {
        const expenseName = row.querySelector('td:nth-child(1)').innerText;
        const expenseAmount = row.querySelector('td:nth-child(2)').innerText;
        const date = new Date().toLocaleDateString();
        summaryData.expenses.push({ name: expenseName, amount: expenseAmount, date: date });
    });

    // Send summary data to the backend to save it and clear the user’s expenses and budget
    fetch('/api/markAsDone', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(summaryData),
    }).then(response => {
        if (response.ok) {
            // Redirect to the summary page
            window.location.href = 'summary.html';
        } else {
            alert("Failed to save summary. Please try again.");
        }
    });
}*/