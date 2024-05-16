const path = require('path');
const Expense = require('../models/expensesM');
const User = require('../models/usersM');


// expense post controller
exports.addExpense = async (req, res) => {
    console.log("expense controller addExpense");
    const { amount, description, category } = req.body;
    try {
        const addExpense = await Expense.create({
            amount,
            description,
            category,
            newUserId: req.user.id
        });
        res.json(addExpense);
    } catch (error) {
        console.error('Error uploading post:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }

}

// expense get controller
exports.getExpense = async (req, res) => {
    console.log("expense controller getExpense");
    try {
        const getExpenses = await Expense.findAll({ where: { newUserId: req.user.id } });
        res.json(getExpenses);
    } catch (error) {
        console.error('Error fetching posts:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }

}

// expense delete controller
exports.deleteExpense = async (req, res) => {
    console.log("expense controller deleteExpense");
    try {
        const expenseId = req.params.expenseId
        if (!expenseId) {
            return res.status(400).json({ error: 'Expense ID is required' });
        }
        const deleteExpense = await Expense.destroy({
            where: {
                id: expenseId,
                newUserId: req.user.id,
            }
        });
        if (!deleteExpense) {
            return res.status(404).json({ error: 'Expense not found' });
        }
        res.status(200).json({ message: 'Expense deleted successfully' });
    } catch (error) {
        console.error('Error deleting expense:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }

}





