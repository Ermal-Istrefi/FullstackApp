const cron = require('node-cron');
const Expense = require('./Models/Expense');
const Income = require('./Models/Income');
const moment = require('moment');

// Function to add recurring expenses
const addRecurringExpenses = async () => {
    const now = new Date();
    const recurringExpenses = await Expense.find({ recurring: true, nextOccurrence: { $lte: now } });

    for (const expense of recurringExpenses) {
        const newExpense = new Expense({
            user: expense.user,
            category: expense.category,
            amount: expense.amount,
            description: expense.description,
            date: now,
            paid: false,
            recurring: false
        });

        await newExpense.save();
        expense.nextOccurrence = calculateNextOccurrence(expense.nextOccurrence, expense.recurrenceInterval);
        await expense.save();
    }
};

// Function to add recurring incomes
const addRecurringIncomes = async () => {
    const now = new Date();
    const recurringIncomes = await Income.find({ recurring: true, nextOccurrence: { $lte: now } });

    for (const income of recurringIncomes) {
        const newIncome = new Income({
            user: income.user,
            category: income.category,
            amount: income.amount,
            description: income.description,
            date: now,
            received: false,
            recurring: false
        });

        await newIncome.save();
        income.nextOccurrence = calculateNextOccurrence(income.nextOccurrence, income.recurrenceInterval);
        await income.save();
    }
};

// Calculate the next occurrence date based on the interval
const calculateNextOccurrence = (currentDate, interval) => {
    switch (interval) {
        case 'daily':
            return moment(currentDate).add(1, 'days').toDate();
        case 'weekly':
            return moment(currentDate).add(1, 'weeks').toDate();
        case 'monthly':
            return moment(currentDate).add(1, 'months').toDate();
        case 'yearly':
            return moment(currentDate).add(1, 'years').toDate();
        default:
            return currentDate;
    }
};

// Schedule the cron jobs to run every day at midnight
cron.schedule('0 0 * * *', () => {
    addRecurringExpenses();
    addRecurringIncomes();
});
