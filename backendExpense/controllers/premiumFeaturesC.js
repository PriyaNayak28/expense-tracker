const User = require('../models/usersM');
const Expense = require('../models/expensesM');
const sequelize = require('../util/database');

const getUserLeaderBoard = async (req, res) => {
    try {

        const leaderBoardOfUsers = await User.findAll({
            order: [['totalExpenses', 'DESC']]
        })
        res.status(200).json(leaderBoardOfUsers)
    }
    catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
}

module.exports = {
    getUserLeaderBoard
}