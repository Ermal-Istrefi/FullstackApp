const express = require('express');
const Income = require('../Models/Income');
const verifyToken = require('../verifyToken');
const router = express.Router();

// Me shtu nje income
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

// Me i marr krejt income
router.get('/', verifyToken, async (req, res) => {
    console.log('get incomes');

    const { name, amount, amountCondition, received, date, dateCondition} = req.query;
    let query = { user: req.user.id };
    if (name) {
        console.log(name);
        query.category = { $regex: name, $options: 'i'}
    }

    try {
        const incomes = await Income.find(query);
        res.json(incomes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Me marr income nga ID
router.get('/:incomeId', verifyToken, async (req, res) => {
    const { incomeId } = req.params;

    try {
        const income = await Income.findById(incomeId);
        if (!income) {
            return res.status(404).json({ message: 'Income not found' });  // Added check if income is not found
        }
        res.json(income);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Me bo update income nga ID
router.put('/:incomeId', verifyToken, async (req, res) => {
    console.log('update income');
    const { incomeId } = req.params;

    try {
        const updatedIncome = await Income.findByIdAndUpdate(incomeId, req.body, { new: true, runValidators: true });  // Update income
        if (!updatedIncome) {
            return res.status(404).json({ message: 'Income not found' });  // Added check if income is not found
        }
        res.json(updatedIncome);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Me fshi income by ID
router.delete('/:incomeId', verifyToken, async (req, res) => {
    console.log('delete income');
    const { incomeId } = req.params;
    console.log(incomeId);

    try {
        const deletedIncome = await Income.findByIdAndDelete(incomeId);
        if (!deletedIncome) {
            return res.status(404).json({ message: 'Income not found' });  // Added check if income is not found
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
