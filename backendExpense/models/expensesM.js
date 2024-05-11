const Sequelize = require('sequelize');
const sequelize = require('../util/database');
const User = require('./usersM');

const Expense = sequelize.define('expenses', {
    amount: Sequelize.FLOAT,
    description: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            len: [1, 50],
        }
    },
    category: {
        type: Sequelize.STRING,
        allowNull: false,
    },
});

module.exports = Expense;


