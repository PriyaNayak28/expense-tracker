
require('dotenv').config();
const path = require('path');
const cors = require('cors');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const sequelize = require('./util/database');

const usersRoutes = require('./routes/users');
const expenseRoutes = require('./routes/expense');
const purchaseRoutes = require('./routes/purchase');
const premiumFeaturesRoutes = require('./routes/premiumFeatures');

const userModel = require('./models/usersM');
const expenseModel = require('./models/expensesM');
const orderModel = require('./models/ordersM');

app.use(cors());
app.use(express.json());
app.use(bodyParser.json({ extended: false }));

app.use('/users', usersRoutes);
app.use('/usersExpenses', expenseRoutes);
app.use('/purchase', purchaseRoutes);
app.use('/premium', premiumFeaturesRoutes);

userModel.hasMany(expenseModel);
expenseModel.belongsTo(userModel);

userModel.hasMany(orderModel);
orderModel.belongsTo(userModel);

app.use((req, res) => {
    if (req.url === '/') {
        res.sendFile(path.join(__dirname, `../frontendExpense/views/login.html`));
    }
    else {
        res.sendFile(path.join(__dirname, `../frontendExpense/views/${req.url}`));
    }
})

sequelize.sync()
    .then(result => {
        app.listen(3000);
    })
    .catch(err => console.log(err));
