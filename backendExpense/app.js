const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./util/database');
const signUpRoutes = require('./routes/users');
const authenticate = require('./middleware/auth');
const expenseRoutes = require('./routes/expense');
const app = express();
var cors = require('cors');
const Expense = require('./models/expense');
const signUp = require('./models/users');
app.use(cors());
app.use(express.json());
app.use(bodyParser.json({ extended: false }));
app.use('/users', signUpRoutes);
//app.use(authenticate);
app.use('/usersExpenses', expenseRoutes);
signUp.hasMany(Expense);
Expense.belongsTo(signUp);
sequelize.sync()
    .then(result => {
        app.listen(3000);
    })
    .catch(err => console.log(err));