const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/login-customer', authController.loginCustomer);
router.post('/register-customer', authController.registerCustomer);
router.post('/login-employee', authController.loginEmployee);

module.exports = router;
