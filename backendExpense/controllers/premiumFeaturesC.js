const User = require('../models/usersM');
const Expense = require('../models/expensesM');
const sequelize = require('../util/database');

const getUserLeaderBoard = async (req, res) => {
    try {

        const users = await User.findAll();
        const expenses = await Expense.findAll();
        const userAggreGatedExpenses = {};
        expenses.forEach(expense => {
            if (userAggreGatedExpenses[expense.newUserId]) {
                userAggreGatedExpenses[expense.newUserId] = userAggreGatedExpenses[expense.newUserId] + expense.amount;
            }
            else {
                userAggreGatedExpenses[expense.newUserId] = expense.amount;
            }

        });
        let userLeaderBoardDeatils = [];
        users.forEach((user) => {
            userLeaderBoardDeatils.push({ name: user.userName, total_cost: userAggreGatedExpenses[user.id] || 0 });
        })
        userLeaderBoardDeatils.sort((a, b) => b.total_cost - a.total_cost);
        console.log("userAggreGatedExpense", userAggreGatedExpenses);
        console.log("userLeaderBoardDeatils", userLeaderBoardDeatils);
        res.status(200).json(userLeaderBoardDeatils);
    }
    catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
}

module.exports = {
    getUserLeaderBoard
}