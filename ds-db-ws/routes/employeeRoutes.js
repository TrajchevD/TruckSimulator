const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');

router.get('/', employeeController.getAll);
router.post('/add', employeeController.add);
router.post('/create', employeeController.createEmployee);

module.exports = router;