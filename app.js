const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const sequelize = require('./util/database');

const signUpRoutes = require('./routes/signUp');
const signUpControllers = require('./controllers/signUp');

const app = express();

var cors = require('cors');

app.use(cors());

app.use(bodyParser.json({ extended: false }));

app.use('/signUp', signUpRoutes);

sequelize.sync()
    .then(result => {
        //  console.log(result);
        app.listen(3000);
    })
    .catch(err => console.log(err));