const express = require('express');
const userAuthenticate = require('../middleware/auth');

const router = express.Router();

const expenseController = require('../controllers/expense');

router.get('/expense', userAuthenticate.authenticate, expenseController.getAllExpense);

router.post('/add', expenseController.postExpense);

module.exports = router;


