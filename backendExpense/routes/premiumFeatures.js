const express = require('express');
const router = express.Router();
const authenticateMiddleware = require('../middleware/auth');
const premiumFeatures = require('../controllers/premiumFeaturesC');

router.get('/showLeaderBoard', authenticateMiddleware.authenticate, premiumFeatures.getUserLeaderBoard);

module.exports = router;