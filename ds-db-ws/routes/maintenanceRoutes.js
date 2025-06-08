const express = require('express');
const router = express.Router();
const maintenanceController = require('../controllers/maintenanceController');

router.get('/', maintenanceController.getAllLogs);
router.post('/start', maintenanceController.startMaintenance);
router.post('/complete/:id', maintenanceController.completeMaintenance);

module.exports = router;
