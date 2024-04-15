const express = require('express');

const router = express.Router();

const signUpSignInController = require('../controllers/users');

router.post('/signUp', signUpSignInController.NewUserSignUp);

router.post('/login', signUpSignInController.existingUserLogin);


module.exports = router;