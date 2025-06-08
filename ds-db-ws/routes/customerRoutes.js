const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');

router.get('/', customerController.getAll);
router.get('/feedback', customerController.getFeedback);
router.post('/feedback', customerController.addFeedback);

module.exports = router;