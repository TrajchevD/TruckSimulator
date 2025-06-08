const { v4: uuidv4 } = require('uuid');
const pool = require('../models/db');

exports.createRequest = async (req, res) => {
  const { items, cardId, cvv } = req.body;
  const customerId = req.session?.user?.id;

  if (!customerId || req.session.user.type !== 'customer') {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Cart is empty' });
  }

  try {
    
    const [cardRows] = await pool.query("SELECT Balance, CVV FROM wallet WHERE WalletID = ?", [cardId]);
    if (cardRows.length === 0) return res.status(400).json({ error: "Invalid card." });
    if (cardRows[0].CVV !== cvv) return res.status(400).json({ error: "Invalid CVV." });

  
    let totalCost = 0;
    const preparedItems = [];

    for (const item of items) {
      const [productRows] = await pool.query("SELECT Price FROM product WHERE ProductID = ?", [item.productId]);
      if (productRows.length === 0) return res.status(400).json({ error: "Invalid product." });

      const price = parseFloat(productRows[0].Price);
      let monthlyPay = null;
      let totalPrice = price;
      let duration = null;

      if (item.type === 'Rent') {
        duration = parseInt(item.duration || 24);
        monthlyPay = parseFloat((price / 36).toFixed(2));
        totalPrice = parseFloat((monthlyPay * duration).toFixed(2));
      }

      totalCost += totalPrice;
      preparedItems.push({ ...item, monthlyPay, totalPrice, duration });
    }

   
    if (cardRows[0].Balance < totalCost) {
      return res.status(400).json({ error: "Insufficient balance." });
    }

    
    await pool.query("UPDATE wallet SET Balance = Balance - ? WHERE WalletID = ?", [totalCost, cardId]);

    
    const groupId = uuidv4();

    for (const item of preparedItems) {
      await pool.query(`
        INSERT INTO procurement_request 
        (CustomerID, ProductID, Quantity, RequestedAt, Status, PaymentStatus, MonthlyPay, TotalPrice, Duration, CardID, TransactionType, PaymentMethod, GroupID)
        VALUES (?, ?, ?, NOW(), 'Pending', 'Reserved', ?, ?, ?, ?, ?, ?, ?)`,
        [
          customerId,
          item.productId,
          item.quantity || 1,
          item.monthlyPay,
          item.totalPrice,
          item.duration,
          cardId,
          item.type || 'Buy',
          'Card',
          groupId
        ]
      );
    }

    res.json({ success: true });
  } catch (err) {
    console.error("Create request error:", err);
    res.status(500).json({ error: 'Failed to create request' });
  }
};




exports.getPendingRequests = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT pr.GroupID, pr.RequestID, c.CustomerName, c.CustomerSurName,
             p.Model, pr.Quantity, pr.TotalPrice, pr.Duration
      FROM procurement_request pr
      JOIN customer c ON c.CustomerID = pr.CustomerID
      JOIN product p ON p.ProductID = pr.ProductID
      WHERE pr.Status = 'Pending'
      ORDER BY pr.GroupID, pr.RequestID
    `);

    
    const grouped = {};
    for (const row of rows) {
      if (!grouped[row.GroupID]) grouped[row.GroupID] = [];
      grouped[row.GroupID].push(row);
    }

    res.json(grouped);
  } catch (err) {
    console.error("Error fetching pending grouped requests:", err);
    res.status(500).json({ error: "Server error" });
  }
};
