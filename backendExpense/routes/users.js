const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersC');

router.post('/signUp', usersController.signUp);
router.post('/login', usersController.login);

module.exports = router;