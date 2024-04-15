const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const sequelize = require('./util/database');

const signUpRoutes = require('./routes/users');

const app = express();

var cors = require('cors');

app.use(cors());

app.use(express.json());

app.use(bodyParser.json({ extended: false }));

app.use('/users', signUpRoutes);

sequelize.sync()
    .then(result => {
        //  console.log(result);
        app.listen(4000);
    })
    .catch(err => console.log(err));