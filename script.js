"use strict";

const budgetInput = document.querySelector(".budget_input");
const expensesDescInput = document.querySelector(".Expenses_input");
const expensesAmountInput = document.querySelector(".Expenses_amount");
const expensesCategoryInput = document.querySelector(".Expenses_category");

const btnBudget = document.querySelector("#btn_budget");
const btnExpenses = document.querySelector("#btn_Expenses");
const errorMessage = document.querySelector(".error_message");

const budgetCard = document.querySelector(".budget_card");
const expensesCard = document.querySelector(".expenses_card");
const balanceCard = document.querySelector(".balance_card");
const tableData = document.querySelector(".table_data");

const darkModeToggle = document.getElementById("darkModeToggle");
const darkModeIcon = darkModeToggle.querySelector("i");

let budget = 0;
let expenses = [];
let totalExpenses = 0;

btnBudget.addEventListener("click", function (e) {
    e.preventDefault();
    const value = parseFloat(budgetInput.value);
    if (value > 0) {
        budget = value;
        budgetCard.textContent =  budget.toFixed(2);
        updateBalance();
        errorMessage.classList.remove("error");
        budgetInput.value = "";
    } else {
        errorMessage.textContent = "Please Enter Budget Amount | More Than 0";
        errorMessage.classList.add("error");
    }
});

btnExpenses.addEventListener("click", function (e) {
    e.preventDefault();
    const desc = expensesDescInput.value.trim();
    const amount = parseFloat(expensesAmountInput.value);
    const category = expensesCategoryInput.value.trim();

    if (desc !== "" && !isNaN(amount) && amount > 0 && category !== "") {
        const expense = {
            id: Date.now(),
            description: desc,
            amount: amount,
            category: category,
        };
        expenses.push(expense);
        totalExpenses += amount;
        expensesCard.textContent =  totalExpenses.toFixed(2);
        updateBalance();
        renderExpenses();
        errorMessage.classList.remove("error");

        expensesDescInput.value = "";
        expensesAmountInput.value = "";
        expensesCategoryInput.value = "";
    } else {
        errorMessage.textContent =
            "Please enter valid description, amount (>0), and category";
        errorMessage.classList.add("error");
    }
});

function updateBalance() {
    const balance = budget - totalExpenses;
    balanceCard.textContent =  balance.toFixed(2);
}

function renderExpenses() {
    tableData.innerHTML = "";

    const categoryGroups = {};
    expenses.forEach((expense) => {
        if (!categoryGroups[expense.category]) {
            categoryGroups[expense.category] = [];
        }
        categoryGroups[expense.category].push(expense);
    });

    const isDarkMode = document.body.classList.contains("dark-mode");

    let rowIndex = 0;

    Object.keys(categoryGroups).forEach((category) => {
        const categoryRow = document.createElement("div");
        categoryRow.classList.add("category-row");
        categoryRow.textContent = category;
        categoryRow.style.fontWeight = "bold";
        categoryRow.style.padding = "8px 10px";
        categoryRow.style.marginTop = "20px";
        categoryRow.style.marginBottom = "8px";
        categoryRow.style.borderBottom = "1px solid #ccc";
        categoryRow.style.display = "flex";
        categoryRow.style.justifyContent = "flex-start";

        if (isDarkMode) {
            categoryRow.style.backgroundColor = "#000000";
            categoryRow.style.color = "#90caf9";
        } else {
            categoryRow.style.backgroundColor = "#f5f5f5";
            categoryRow.style.color = "#000000";
        }

        tableData.appendChild(categoryRow);
        rowIndex++;

        categoryGroups[category].forEach((expense) => {
            const expenseRow = document.createElement("div");
            expenseRow.classList.add("expense_row");
            expenseRow.style.display = "grid";
            expenseRow.style.gridTemplateColumns = "1fr 100px auto auto";
            expenseRow.style.alignItems = "center";
            expenseRow.style.gap = "10px";
            expenseRow.style.padding = "5px 10px";
            expenseRow.dataset.id = expense.id;

            if (isDarkMode) {
                expenseRow.style.backgroundColor =
                    rowIndex % 2 === 0 ? "#000000" : "#90caf9";
                expenseRow.style.color = rowIndex % 2 === 0 ? "#90caf9" : "#000000";
            } else {
                expenseRow.style.backgroundColor =
                    rowIndex % 2 === 0 ? "#f5f5f5" : "#90caf9";
                expenseRow.style.color = "#000000";
            }

            const descDiv = document.createElement("div");
            descDiv.textContent = expense.description;
            descDiv.style.overflowWrap = "anywhere";

            const amountDiv = document.createElement("div");
            amountDiv.textContent = expense.amount.toFixed(2);
            amountDiv.style.textAlign = "right";

            const editBtn = document.createElement("button");
            editBtn.textContent = "Edit";
            editBtn.style.backgroundColor = "green";
            editBtn.style.color = "white";
            editBtn.style.border = "none";
            editBtn.style.padding = "3px 7px";
            editBtn.style.borderRadius = "3px";

            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "Delete";
            deleteBtn.style.backgroundColor = "red";
            deleteBtn.style.color = "white";
            deleteBtn.style.border = "none";
            deleteBtn.style.padding = "3px 7px";
            deleteBtn.style.borderRadius = "3px";

            expenseRow.appendChild(descDiv);
            expenseRow.appendChild(amountDiv);
            expenseRow.appendChild(editBtn);
            expenseRow.appendChild(deleteBtn);

            tableData.appendChild(expenseRow);

            rowIndex++;

            editBtn.addEventListener("click", () => {
                expensesDescInput.value = expense.description;
                expensesAmountInput.value = expense.amount;
                expensesCategoryInput.value = expense.category;

                expenses = expenses.filter((e) => e.id !== expense.id);
                totalExpenses -= expense.amount;
                expensesCard.textContent = totalExpenses.toFixed(2);
                updateBalance();
                renderExpenses();
            });

            deleteBtn.addEventListener("click", () => {
                expenses = expenses.filter((e) => e.id !== expense.id);
                totalExpenses -= expense.amount;
                expensesCard.textContent = totalExpenses.toFixed(2);
                updateBalance();
                renderExpenses();
            });
        });
    });
}

darkModeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    if (document.body.classList.contains("dark-mode")) {
        darkModeIcon.classList.replace("bx-moon", "bx-sun");
    } else {
        darkModeIcon.classList.replace("bx-sun", "bx-moon");
    }
    renderExpenses();
});


document.querySelector("#generateReportBtn").addEventListener("click", function () {
    if (!budget && expenses.length === 0) {
        displayMessage("Nothing to save!");
        return;
    }

    let report = "---- Budget Report ----\n";
    report += `Budget: $${(budget || 0).toFixed(2)}\n`;
    report += `Total Expenses: $${(totalExpenses || 0).toFixed(2)}\n`;
    report += `Balance: $${((budget || 0) - (totalExpenses || 0)).toFixed(2)}\n\n`;

    const categoryGroups = {};
    expenses.forEach(expense => {
        if (!categoryGroups[expense.category]) {
            categoryGroups[expense.category] = [];
        }
        categoryGroups[expense.category].push(expense);
    });

    for (const category in categoryGroups) {
        report += `Category: ${category}\n`;
        categoryGroups[category].forEach(expense => {
            report += `  - ${expense.description}: $${expense.amount.toFixed(2)}\n`;
        });
        report += "\n";
    }

    const blob = new Blob([report], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "budget_report.txt";
    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    const today = new Date().toLocaleDateString();
    const timestamp = new Date().toISOString();
    const reportData = {
        date: today,
        timestamp: timestamp,
        budget: budget,
        totalExpenses: totalExpenses,
        balance: budget - totalExpenses,
        expenses: [...expenses],
    };

    let savedReports = JSON.parse(localStorage.getItem("savedReports")) || [];
    savedReports.push(reportData);
    localStorage.setItem("savedReports", JSON.stringify(savedReports));

    displayMessage("Expenses report saved successfully!");
});

document.querySelector("#viewHistoryBtn").addEventListener("click", function () {
    const savedReports = JSON.parse(localStorage.getItem("savedReports")) || [];
    const historyContainer = document.getElementById("historyContainer");
    const historyContent = document.getElementById("historyContent");

    if (savedReports.length === 0) {
        displayMessage("No saved reports found.");
        historyContent.innerHTML = "<p>No saved reports found.</p>";
        historyContainer.style.display = "block";
        return;
    }
    let html = "";
    savedReports.forEach((report, index) => {
        html += `<div style="border:1px solid #ccc; padding:10px; margin-bottom:10px;">`;
        html += `<h4>Report #${index + 1} - Date: ${report.date}</h4>`;
        html += `<p><strong>Budget:</strong> $${report.budget.toFixed(2)}</p>`;
        html += `<p><strong>Total Expenses:</strong> $${report.totalExpenses.toFixed(2)}</p>`;
        html += `<p><strong>Balance:</strong> $${report.balance.toFixed(2)}</p>`;

        const categoryGroups = {};
        report.expenses.forEach(expense => {
            if (!categoryGroups[expense.category]) {
                categoryGroups[expense.category] = [];
            }
            categoryGroups[expense.category].push(expense);
        });

        for (const category in categoryGroups) {
            html += `<p><strong>Category: ${category}</strong></p><ul>`;
            categoryGroups[category].forEach(expense => {
                html += `<li>${expense.description}: $${expense.amount.toFixed(2)}</li>`;
            });
            html += `</ul>`;
        }
        html += `</div>`;
    });
    historyContent.innerHTML = html;
    historyContainer.style.display = "block";
});


function displayMessage(msg) {
    let msgBox = document.getElementById("messageBox");
    if (!msgBox) {
        msgBox = document.createElement("div");
        msgBox.id = "messageBox";
        msgBox.style.position = "fixed";
        msgBox.style.bottom = "20px";
        msgBox.style.right = "20px";
        msgBox.style.backgroundColor = "#333";
        msgBox.style.color = "#fff";
        msgBox.style.padding = "12px 20px";
        msgBox.style.borderRadius = "5px";
        msgBox.style.boxShadow = "0 2px 6px rgba(0,0,0,0.3)";
        msgBox.style.zIndex = "9999";
        document.body.appendChild(msgBox);
    }
    msgBox.textContent = msg;
    msgBox.style.opacity = "1";

    setTimeout(() => {
        msgBox.style.opacity = "0";
    }, 3000);
}
document.querySelector("#closeHistoryBtn").addEventListener("click", function () {
    document.getElementById("historyContainer").style.display = "none";
});
