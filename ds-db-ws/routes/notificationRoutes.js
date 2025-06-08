const express = require("express");
const router = express.Router();
const pool = require("../models/db");

router.get("/", async (req, res) => {
  if (!req.session.user || req.session.user.type !== "customer") {
    return res.status(403).json({ error: "Not allowed" });
  }

  const customerId = req.session.user.id;

  try {
    const [rows] = await pool.query(`
      SELECT DISTINCT p.TransactionID, p.Status
      FROM procurement p
      WHERE p.CustomerID = ?
        AND p.Status IN ('Approved', 'Rejected')
        AND p.Notified = FALSE
    `, [customerId]);

    if (rows.length > 0) {
      const txIds = rows.map(r => r.TransactionID);
      await pool.query(
        `UPDATE procurement SET Notified = TRUE WHERE CustomerID = ? AND TransactionID IN (?)`,
        [customerId, txIds]
      );
    }

    res.json(rows);
  } catch (err) {
    console.error("Notification error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
