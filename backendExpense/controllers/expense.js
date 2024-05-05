const path = require('path');

const userExpense = require('../models/expense');
const users = require('../models/users');
const exp = require('constants');

exports.postExpense = async (req, res, next) => {
    const { amount, description, category } = req.body;
    // console.log("id has", req.user.id);
    try {
        const user = await userExpense.create({
            amount,
            description,
            category,
            newUserId: req.user.id


        });
        // console.log("this is user", user);

        res.json(user);
    } catch (error) {
        console.error('Error uploading post:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }

}

exports.getAllExpense = async (req, res, next) => {
    try {
        // console.log(req.user.id)
        const posts = await userExpense.findAll({ where: { newUserId: req.user.id } });
        // console.log("this is post", posts);
        res.json(posts);
    } catch (error) {
        console.error('Error fetching posts:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }

}

exports.deleteExpense = async (req, res) => {
    try {
        const expenseId = req.params.expenseId // Assuming expenseId is passed as a parameter in the URL
        console.log("delteexpenseId", expenseId);
        if (!expenseId) {
            return res.status(400).json({ error: 'Expense ID is required' });
        }

        // Assuming userExpense is your Sequelize model for expenses
        const deletedExpense = await userExpense.destroy({
            where: {
                id: expenseId,
                newUserId: req.user.id,
                // Add user ID constraint to ensure only the user's own expenses are deleted
            }

        });

        if (!deletedExpense) {
            return res.status(404).json({ error: 'Expense not found' });
        }

        res.status(200).json({ message: 'Expense deleted successfully' });
    } catch (error) {
        console.error('Error deleting expense:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}





