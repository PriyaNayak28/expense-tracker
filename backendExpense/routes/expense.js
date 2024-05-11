const express = require('express');
const router = express.Router();
const authenticateMiddleware = require('../middleware/auth');
const expenseController = require('../controllers/expensesC');

router.post('/addExpense', authenticateMiddleware.authenticate, expenseController.addExpense);
router.get('/getExpense', authenticateMiddleware.authenticate, expenseController.getExpense);
router.delete('/expenseDelete/:expenseId', authenticateMiddleware.authenticate, expenseController.deleteExpense)

module.exports = router;


