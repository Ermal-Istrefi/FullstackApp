const express = require('express');
const Income = require('../Models/Income');
const verifyToken = require('../verifyToken');
const router = express.Router();

// Add a new income
router.post('/', verifyToken, async (req, res) => {
    console.log('post income');

    const { category, amount, description, date, received } = req.body; 
    try {
        const newIncome = new Income({
            user: req.user.id,
            category,
            amount,
            description,
            date, 
            received
        });
        await newIncome.save();
        res.status(201).json(newIncome);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get all incomes with pagination and sorting
router.get('/', verifyToken, async (req, res) => {
    console.log('get incomes');

    const { name, amount, amountCondition, received, date, dateCondition, page = 1, limit = 10, sortField, sortOrder} = req.query;
    let query = { user: req.user.id };
    if (name) {
        console.log(name);
        query.category = { $regex: name, $options: 'i'}
    }

    if (amount) {
        const amountValue = parseFloat(amount);
        if (amountCondition === 'equal') {
            query.amount = amountValue;
        }   else if (amountCondition === 'bigger') { 
            query.amount = { $gt: amountValue};  
        }   else if (amountCondition === 'smaller') {
            query.amount = { $lt: amountValue};
        }
    }
    if (received) {
        query.received = received === 'true';
    }

    if (date) {
        const dateValue = new Date(date);
        if (dateCondition === 'equal') {
            query.date = dateValue;
        } else if (dateCondition === 'bigger') {
            query.date = { $gt: dateValue};
        } else if (dateCondition === 'smaller') {
            query.date = { $lt: dateValue};
        }
    }

    const options = {
        skip: (page - 1) * limit,
        limit: parseInt(limit),
    };

    if (sortField && sortOrder) {
        options.sort = { [sortField]: sortOrder === 'asc' ? 1 : -1 };
    }

    try {
        const incomes = await Income.find(query, null, options);
        const total = await Income.countDocuments(query);

        res.json({
            incomes,
            total,
            page: parseInt(page),
            limit: parseInt(limit)
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get an income by ID
router.get('/:incomeId', verifyToken, async (req, res) => {
    const { incomeId } = req.params;

    try {
        const income = await Income.findById(incomeId);
        if (!income) {
            return res.status(404).json({ message: 'Income not found' });
        }
        res.json(income);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update an income by ID
router.put('/:incomeId', verifyToken, async (req, res) => {
    console.log('update income');
    const { incomeId } = req.params;

    try {
        const updatedIncome = await Income.findByIdAndUpdate(incomeId, req.body, { new: true, runValidators: true });
        if (!updatedIncome) {
            return res.status(404).json({ message: 'Income not found' });
        }
        res.json(updatedIncome);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete an income by ID
router.delete('/:incomeId', verifyToken, async (req, res) => {
    console.log('delete income');
    const { incomeId } = req.params;

    try {
        const deletedIncome = await Income.findByIdAndDelete(incomeId);
        if (!deletedIncome) {
            return res.status(404).json({ message: 'Income not found' });
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
