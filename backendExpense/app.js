
require('dotenv').config();
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./util/database');
const signUpRoutes = require('./routes/users');
const authenticate = require('./middleware/auth');
const expenseRoutes = require('./routes/expense');
const purchase = require('./routes/purchase');
const app = express();
var cors = require('cors');
const Expense = require('./models/expense');
const signUp = require('./models/users');
const user = require('./models/users');
const Order = require('./models/orders');
app.use(cors());
app.use(express.json());
app.use(bodyParser.json({ extended: false }));
app.use('/users', signUpRoutes);
//app.use(authenticate);
app.use('/usersExpenses', expenseRoutes);
app.use('/purchase', purchase);
user.hasMany(Expense);
Expense.belongsTo(user);

user.hasMany(Order);
Order.belongsTo(user);



sequelize.sync()
    .then(result => {
        app.listen(4000);
    })
    .catch(err => console.log(err));
