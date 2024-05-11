const express = require('express');
const router = express.Router();
const users = require('./users');

const authenticateMiddleware = require('../middleware/auth');
const purchaseController = require('../controllers/purchaseC');

router.get('/premiummembership', authenticateMiddleware.authenticate, purchaseController.purchasepremium);
router.post('/updatetransactionstatus', authenticateMiddleware.authenticate, purchaseController.updateTransactionStatus);

module.exports = router;
