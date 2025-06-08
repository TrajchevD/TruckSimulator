const pool = require('../models/db');

exports.submitFeedback = async (req, res) => {
  const { ProductID, Rating, Comment, TransactionID } = req.body;
  const CustomerID = req.session?.user?.id;

  if (!CustomerID || req.session.user.type !== 'customer') {
    return res.status(403).json({ error: 'Not allowed' });
  }

  try {
    
    const [existing] = await pool.query(
      `SELECT * FROM customerfeedback WHERE CustomerID = ? AND TransactionID = ?`,
      [CustomerID, TransactionID]
    );

    if (existing.length > 0) {
      return res.status(400).json({ error: 'Feedback already submitted for this transaction.' });
    }

    
    const [max] = await pool.query(`SELECT MAX(FeedbackID) + 1 AS NewID FROM customerfeedback`);
    const newID = max[0].NewID || 1;

    
    await pool.query(
      `INSERT INTO customerfeedback (FeedbackID, CustomerID, ProductID, Rating, Comment, FeedbackDate, TransactionID)
       VALUES (?, ?, ?, ?, ?, CURDATE(), ?)`,
      [newID, CustomerID, ProductID, Rating, Comment, TransactionID]
    );

    res.json({ success: true });
  } catch (err) {
    console.error('Feedback submission error:', err);
    res.status(500).json({ error: 'Failed to submit feedback' });
  }
};
