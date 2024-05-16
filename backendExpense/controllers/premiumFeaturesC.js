const User = require('../models/usersM');
const Expense = require('../models/expensesM');
const sequelize = require('../util/database');

const getUserLeaderBoard = async (req, res) => {
    try {

        const leaderBoardOfUsers = await User.findAll({
            attributes: ['id', 'userName', [sequelize.fn('sum', sequelize.col('expenses.amount')), 'total_cost']],
            include: [
                {
                    model: Expense,
                    attributes: []
                }
            ],
            group: ['newUser.id'],
            order: [['total_cost', 'DESC']]
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