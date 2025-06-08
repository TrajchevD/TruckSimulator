const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');


router.get('/dashboard', (req, res, next) => {
    if (!req.session.user || req.session.user.type !== 'employee' || req.session.user.department !== 'Admin')
        {
    return res.status(403).send('Forbidden');
  }
  next();
}, adminController.getDashboardStats);

module.exports = router;