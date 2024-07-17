const mongoose = require('mongoose');

const IncomeSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    category: String,
    amount: Number,
    date: { type: Date, default: Date.now },
    description: String,
    received: Boolean,
    recurring: {
        type: Boolean,
        default: false
    },
    recurrenceInterval: String, // e.g., 'daily', 'weekly', 'monthly', 'yearly'
    nextOccurrence: Date
});

module.exports = mongoose.model('Income', IncomeSchema);
