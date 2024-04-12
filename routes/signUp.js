const express = require('express');

const router = express.Router();

const signUpController = require('../controllers/signUp');

router.get('/add-usersPage', signUpController.getSignUpPage);

//router.post('/add-usersPage/id', signUpController.postlogin);

router.post('/add-users', signUpController.addNewUsers);

module.exports = router;