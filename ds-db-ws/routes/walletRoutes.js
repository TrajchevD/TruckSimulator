const express = require('express');
const router = express.Router();
const pool = require('../models/db');

router.get('/', async (req, res) => {
  if (!req.session.user || req.session.user.type !== 'customer') {
    return res.status(403).json({ error: 'Not allowed' });
  }

  const customerId = req.session.user.id;

  try {
    const [rows] = await pool.query(
      `SELECT WalletID AS CardID, CardNumber, Balance, CardHolderName FROM wallet WHERE CustomerID = ?`,
      [customerId]
    );
    res.json(rows);
  } catch (err) {
    console.error('Wallet fetch error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
