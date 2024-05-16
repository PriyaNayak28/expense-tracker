const path = require('path');
const Expense = require('../models/expensesM');
const User = require('../models/usersM');
const sequelize = require('../util/database');

// expense post controller
exports.addExpense = async (req, res) => {
    console.log("expense controller addExpense");

    const t = await sequelize.transaction();
    try {
        const { amount, description, category } = req.body;

        if (amount == undefined || amount.length === 0) {
            return res.status(400).status({ success: false, message: 'Parameters missing' })
        }
        const addExpense = await Expense.create({
            amount,
            description,
            category,
            newUserId: req.user.id
        }, { transaction: t })
        const totalExpense = Number(req.user.totalExpenses) + Number(amount)
        await User.update({
            totalExpenses: totalExpense
        }, {
            where: { id: req.user.id },
            transaction: t
        })
        await t.commit();
        res.status(200).json(addExpense)

    } catch (error) {
        await t.rollback();
        return res.status(500).json({ success: false, error: error })
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

exports.deleteExpense = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const expenseId = req.params.expenseId;
        if (!expenseId) {
            return res.status(400).json({ error: 'Expense ID is required' });
        }
        const expenseToDelete = await Expense.findOne({ where: { id: expenseId, newUserId: req.user.id }, transaction: t });
        if (!expenseToDelete) {
            return res.status(404).json({ error: 'Expense not found' });
        }
        const amount = expenseToDelete.amount;
        await Expense.destroy({ where: { id: expenseId, newUserId: req.user.id }, transaction: t });
        const updatedTotalExpenses = Number(req.user.totalExpenses) - Number(amount);
        await User.update({ totalExpenses: updatedTotalExpenses }, { where: { id: req.user.id }, transaction: t });
        await t.commit();
        res.status(200).json({ message: 'Expense deleted successfully' });
    } catch (error) {
        await t.rollback();
        console.error('Error deleting expense:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
