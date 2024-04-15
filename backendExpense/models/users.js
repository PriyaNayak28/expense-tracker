const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const signUp = sequelize.define('newUser', {
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
});

module.exports = signUp;