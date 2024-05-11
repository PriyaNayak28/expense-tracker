const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const user = sequelize.define('newUser', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    userName: Sequelize.STRING,
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    password: Sequelize.STRING,
    ispremiumuser: Sequelize.BOOLEAN
});

module.exports = user;

