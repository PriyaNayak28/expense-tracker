const Sequelize = require('sequelize');

const sequelize = new Sequelize('expenseTracker', 'root', '#@focus28', {
    dialect: 'mysql',
    host: 'localhost'
});

module.exports = sequelize;