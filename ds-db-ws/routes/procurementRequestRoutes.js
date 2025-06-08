const express = require('express');
const router = express.Router();
const controller = require('../controllers/procurementRequestController');

router.post('/', controller.createRequest);
router.get('/pending', controller.getPendingRequests);

module.exports = router;
