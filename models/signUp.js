const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const signUp = sequelize.define('newUser', {
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true
    },
    userName: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    password: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null
    }
});

module.exports = signUp;