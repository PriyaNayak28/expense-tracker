const Sequelize = require('sequelize');
const sequelize = require('../util/database');
const User = require('./users');

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

// Define association between User and Expense
Expense.belongsTo(User); // This will add userId as a foreign key in the Expense table

module.exports = Expense;
