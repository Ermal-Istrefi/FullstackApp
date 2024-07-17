const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    category: String,
    amount: Number,
    date: { type: Date, default: Date.now },
    description: String,
    paid: Boolean,
    recurring: {
        type: Boolean,
        default: false
    },
    recurrenceInterval: String, // p.sh., 'daily', 'weekly', 'monthly', 'yearly'
    nextOccurrence: Date
});

module.exports = mongoose.model('Expense', ExpenseSchema);
