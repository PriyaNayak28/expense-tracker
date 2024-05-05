const express = require('express');
const userAuthenticate = require('../middleware/auth');

const router = express.Router();

const expenseController = require('../controllers/expense');

router.post('/add', userAuthenticate.authenticate, expenseController.postExpense);

router.get('/expense', userAuthenticate.authenticate, expenseController.getAllExpense);

router.delete('/expenseDelete/:expenseId', userAuthenticate.authenticate, expenseController.deleteExpense)

module.exports = router;


