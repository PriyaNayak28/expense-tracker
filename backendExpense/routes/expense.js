const express = require('express');

const router = express.Router();

const expenseController = require('../controllers/expense');

router.get('/', expenseController.getAddExpensePage)

router.get('/expense', expenseController.getAllExpense);

router.post('/add', expenseController.postExpense);


module.exports = router;