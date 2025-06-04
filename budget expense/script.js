    "use strict";

    const budgetInput = document.querySelector(".budget_input");
    const expensesDescInput = document.querySelector(".Expenses_input");
    const expensesAmountInput = document.querySelector(".Expenses_amount");
    const btnBudget = document.querySelector("#btn_budget");
    const btnExpenses = document.querySelector("#btn_Expenses");
    const errorMessage = document.querySelector(".error_message");

    const budgetCard = document.querySelector(".budget_card");
    const expensesCard = document.querySelector(".expenses_card");
    const balanceCard = document.querySelector(".balance_card");
    const tableData = document.querySelector(".table_data");

    const darkModeToggle = document.getElementById("darkModeToggle");
    const darkModeIcon = darkModeToggle.querySelector("i");

    let budgetAmount = 0;
    let expensesTotal = 0;
    let expensesList = [];
    let editingExpenseId = null;

    function showError(msg) {
        errorMessage.textContent = msg;
        errorMessage.classList.add("error");
        setTimeout(() => {
            errorMessage.classList.remove("error");
        }, 2000);
    }

    darkModeToggle.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");

        if (document.body.classList.contains("dark-mode")) {
            darkModeIcon.classList.remove("bx-moon");
            darkModeIcon.classList.add("bx-sun");
        } else {
            darkModeIcon.classList.remove("bx-sun");
            darkModeIcon.classList.add("bx-moon");
        }
    });

    btnBudget.addEventListener("click", (e) => {
        e.preventDefault();
        const budgetValue = parseFloat(budgetInput.value);

        if (isNaN(budgetValue) || budgetValue <= 0) {
            showError("Please Enter a Valid Budget Amount > 0");
            return;
        }

        budgetAmount = budgetValue;
        updateBudget();
        budgetInput.value = "";
        updateBalance();
    });

    btnExpenses.addEventListener("click", (e) => {
        e.preventDefault();

        const desc = expensesDescInput.value.trim();
        const amount = parseFloat(expensesAmountInput.value);

        if (!desc || isNaN(amount) || amount <= 0) {
            showError("Please Enter Valid Expense Description & Amount > 0");
            return;
        }

        if (editingExpenseId !== null) {
            const expense = expensesList.find(e => e.id === editingExpenseId);
            if (!expense) {
                showError("Expense not found for editing");
                resetExpenseForm();
                return;
            }

            // **Allow updating expense even if total exceeds budget**
            expensesTotal = expensesTotal - expense.amount + amount;

            expense.desc = desc;
            expense.amount = amount;
            
            editingExpenseId = null;
            btnExpenses.textContent = "Add Expenses";
        } else {
            // **Allow adding new expense regardless of budget limit**
            addExpense(desc, amount);
        }

        resetExpenseForm();
        updateBalance();
        renderExpenses();
    });

    function resetExpenseForm() {
        expensesDescInput.value = "";
        expensesAmountInput.value = "";
        editingExpenseId = null;
        btnExpenses.textContent = "Add Expenses";
    }

    function addExpense(desc, amount) {
        const expense = {
            id: Date.now(),
            desc,
            amount,
        };
        expensesList.push(expense);
        expensesTotal += amount;
        updateExpenses();
    }

    function updateBudget() {
        budgetCard.textContent = budgetAmount.toFixed(2);
    }

    function updateExpenses() {
        expensesCard.textContent = expensesTotal.toFixed(2);
    }

    function updateBalance() {
        const balance = budgetAmount - expensesTotal;
        balanceCard.textContent = balance.toFixed(2);

        // Optional: Change balance color if negative
        if (balance < 0) {
            balanceCard.style.color = "red";
        } else {
            balanceCard.style.color = "green";
        }
    }

    function renderExpenses() {
        tableData.innerHTML = "";

        expensesList.forEach((expense) => {
            const row = document.createElement("div");
            row.classList.add("expense_row");
            row.dataset.id = expense.id;

            const descEl = document.createElement("span");
            descEl.classList.add("expense_desc");
            descEl.textContent = expense.desc;

            const amountEl = document.createElement("span");
            amountEl.classList.add("expense_amount");
            amountEl.textContent = `$${expense.amount.toFixed(2)}`;

            const editBtn = document.createElement("button");
            editBtn.classList.add("edit_btn");
            editBtn.innerHTML = "<i class='bx bx-edit'> Edit </i>";
            editBtn.title = "Edit Expense";
            editBtn.style.color = "green";
            editBtn.addEventListener("click", () => editExpense(expense.id));

            const deleteBtn = document.createElement("button");
            deleteBtn.classList.add("delete_btn");
            deleteBtn.innerHTML = "<i class='bx bx-trash'> Delete </i>";
            deleteBtn.title = "Delete Expense";
            deleteBtn.style.color = "red";
            deleteBtn.addEventListener("click", () => deleteExpense(expense.id));

            row.appendChild(descEl);
            row.appendChild(amountEl);
            row.appendChild(editBtn);
            row.appendChild(deleteBtn);

            tableData.appendChild(row);
        });
    }

    function editExpense(id) {
        const expense = expensesList.find(e => e.id === id);
        if (!expense) {
            showError("Expense not found");
            return;
        }
        expensesDescInput.value = expense.desc;
        expensesAmountInput.value = expense.amount;
        editingExpenseId = id;
        btnExpenses.textContent = "Update Expense";
    }

    function deleteExpense(id) {
        const expenseIndex = expensesList.findIndex(e => e.id === id);
        if (expenseIndex === -1) return;

        expensesTotal -= expensesList[expenseIndex].amount;
        expensesList.splice(expenseIndex, 1);

        updateExpenses();
        updateBalance();
        renderExpenses();

        if (editingExpenseId === id) {
            resetExpenseForm();
        }
    }

    // Initialize empty display
    updateBudget();
    updateExpenses();
    updateBalance();
    renderExpenses();
