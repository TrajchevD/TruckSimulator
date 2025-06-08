const Procurement = require('../models/procurementModel');
const pool = require('../models/db');

exports.getAll = (req, res) => {
  Procurement.getAll((err, results) => {
    if (err) return res.status(500).send('Error fetching procurements');
    res.json(results);
  });
};

exports.getDetails = (req, res) => {
  Procurement.getDetailedTransactions((err, results) => {
    if (err) return res.status(500).send('Error fetching transaction details');
    res.json(results);
  });
};

exports.add = (req, res) => {
  Procurement.add(req.body, (err) => {
    if (err) return res.status(500).send('Error adding procurement');
    res.send('Procurement added successfully');
  });
};

exports.delete = (req, res) => {
  const id = req.params.id;
  const db = require('../models/db');
  db.query('DELETE FROM product WHERE ProductID = ?', [id], (err, result) => {
    if (err) return res.status(500).send('Failed to delete product');
    res.send('Product deleted');
  });
};


exports.getMyProcurements = async (req, res) => {
  const customerId = req.session?.user?.id;

  if (!customerId || req.session.user.type !== "customer") {
    return res.status(403).json({ error: "Unauthorized" });
  }

  try {
    const [rows] = await pool.query(`
      SELECT 
        p.TransactionID,
        p.ProductID,
        pr.Model,
        p.Quantity,
        p.ProcurementDate,
        p.Status,
        p.GroupID,
        t.Type,
        t.MonthlyPay,
        t.Duration,
        t.TotalPrice,
        f.Rating AS FeedbackRating,
        f.Comment AS FeedbackComment
      FROM procurement p
      JOIN product pr ON pr.ProductID = p.ProductID
      LEFT JOIN t_type t ON t.TransactionID = p.TransactionID
      LEFT JOIN customerfeedback f ON f.TransactionID = p.TransactionID
      WHERE p.CustomerID = ?
      ORDER BY p.ProcurementDate DESC
    `, [customerId]);

    res.json(rows);
  } catch (err) {
    console.error(" Error fetching my procurements:", err);
    res.status(500).json({ error: "Failed to fetch procurements" });
  }
};



exports.submitCart = async (req, res) => {
  if (!req.session.user || req.session.user.type !== "customer") {
    return res.status(403).json({ error: "Not allowed" });
  }

  const cartItems = req.body.items;
  const customerId = req.session.user.id;

  if (!Array.isArray(cartItems) || cartItems.length === 0) {
    return res.status(400).json({ error: "Empty cart" });
  }

  try {
    const productIds = cartItems.map(p => p.productId);
    const [available] = await pool.query(
      `SELECT * FROM product WHERE ProductID IN (?) AND Status = 'available'`,
      [productIds]
    );

    if (available.length !== cartItems.length) {
      return res.status(400).json({ error: "Some products are unavailable." });
    }

    const [max] = await pool.query("SELECT MAX(TransactionID)+1 AS NewID FROM procurement");
    const transactionId = max[0].NewID || 1;

    for (const item of cartItems) {
      const product = available.find(p => p.ProductID === item.productId);
      const price = parseFloat(product.Price);
      const type = item.type || 'Buy';

      let monthlyPay = null;
      let totalPrice = 0;

      if (type === 'Rent') {
        const dur = parseInt(duration || 24);
        monthlyPay = parseFloat((price / 36).toFixed(2));
        totalPrice = parseFloat((monthlyPay * dur).toFixed(2));
      } else {
        totalPrice = parseFloat(price);
      }

      await pool.query(
        `INSERT INTO procurement (TransactionID, EmployeeID, CustomerID, ProductID, ProcurementDate, Quantity, Status)
         VALUES (?, NULL, ?, ?, NOW(), 1, 'Pending')`,
        [transactionId, customerId, item.productId]
      );

      await pool.query(
        `INSERT INTO t_type (TransactionID, Type, Duration, MonthlyPay, TotalPrice)
         VALUES (?, ?, ?, ?, ?)`,
        [transactionId, type, duration, monthlyPay, totalPrice]
      );
    }

    req.session.cart = [];
    res.json({ success: true, transactionId });
  } catch (err) {
    console.error("Error in submit:", err);
    res.status(500).json({ error: "Server error" });
  }
};



exports.getPendingRequests = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        r.GroupID,
        r.CustomerID,
        c.CustomerName, 
        c.CustomerSurName,
        r.Status,
        r.RequestedAt,
        GROUP_CONCAT(p.Model SEPARATOR ', ') AS Products,
        SUM(r.TotalPrice) AS TotalPrice
      FROM procurement_request r
      JOIN customer c ON c.CustomerID = r.CustomerID
      JOIN product p ON p.ProductID = r.ProductID
      WHERE r.Status = 'Pending'
      GROUP BY r.GroupID, r.CustomerID, c.CustomerName, c.CustomerSurName, r.Status, r.RequestedAt
    `);
    res.json(rows);
  } catch (err) {
    console.error("Error fetching pending grouped requests:", err);
    res.status(500).json({ error: "Server error" });
  }
};


exports.approveGroupedRequest = async (req, res) => {
  const groupId = req.params.groupId;
  const employeeId = req.session?.user?.id;

  if (!employeeId || req.session.user.type !== "employee") {
    return res.status(403).json({ error: "Unauthorized" });
  }

  try {
    const [requests] = await pool.query(
      `SELECT * FROM procurement_request WHERE GroupID = ? AND Status = 'Pending'`,
      [groupId]
    );

    if (requests.length === 0) {
      return res.status(400).json({ error: "No pending requests found for this group." });
    }

    for (const reqItem of requests) {
      
      const [[{ maxId }]] = await pool.query(`SELECT MAX(TransactionID) AS maxId FROM procurement`);
      const newTransactionId = (maxId || 0) + 1;

      
      const [[product]] = await pool.query(`SELECT Price FROM product WHERE ProductID = ?`, [reqItem.ProductID]);
      const price = parseFloat(product?.Price || 0);

      
      const isRent = reqItem.TransactionType === "Rent";
      const duration = isRent ? reqItem.Duration : null;
      const monthlyPay = isRent ? (price / 36).toFixed(2) : null;
      const totalPrice = isRent ? parseFloat(monthlyPay) * duration : price;
      const productStatus = isRent ? "rented" : "sold";

      
      await pool.query(
        `INSERT INTO procurement (TransactionID, CustomerID, ProductID, Quantity, ProcurementDate, Status, EmployeeID, GroupID)
         VALUES (?, ?, ?, ?, NOW(), 'Approved', ?, ?)`,
        [newTransactionId, reqItem.CustomerID, reqItem.ProductID, reqItem.Quantity, employeeId, groupId]
      );

      
      await pool.query(
        `INSERT INTO t_type (TransactionID, Type, MonthlyPay, Duration, TotalPrice)
         VALUES (?, ?, ?, ?, ?)`,
        [newTransactionId, reqItem.TransactionType, monthlyPay, duration, totalPrice]
      );

      
      // await pool.query(
      //   `UPDATE product SET Status = ? WHERE ProductID = ?`,
      //   [productStatus, reqItem.ProductID]
      // );
    }

    
    await pool.query(
      `UPDATE procurement_request SET Status = 'Approved' WHERE GroupID = ?`,
      [groupId]
    );

    res.json({ success: true });
  } catch (err) {
    console.error("Approve grouped request error:", err);
    res.status(500).json({ error: "Server error" });
  }
};



exports.rejectGroupedRequest = async (req, res) => {
  const groupId = req.params.groupId;
  const employeeId = req.session?.user?.id;

  if (!employeeId || req.session.user.type !== "employee") {
    return res.status(403).json({ error: "Unauthorized" });
  }

  try {
    const [requests] = await pool.query(
      `SELECT * FROM procurement_request WHERE GroupID = ? AND Status = 'Pending'`,
      [groupId]
    );

    if (requests.length === 0) {
      return res.status(400).json({ error: "No pending requests found for this group." });
    }

    
    // for (const reqItem of requests) {
    //   await pool.query(
    //     `UPDATE wallet SET Balance = Balance + ? WHERE WalletID = ?`,
    //     [reqItem.TotalPrice, reqItem.CardID]
    //   );
    // }

    await pool.query(
      `UPDATE procurement_request SET Status = 'Rejected', PaymentStatus = 'Refunded' WHERE GroupID = ?`,
      [groupId]
    );

    res.json({ success: true });
  } catch (err) {
    console.error("Reject grouped request error:", err);
    res.status(500).json({ error: "Server error" });
  }
};


exports.getGroupedPendingRequests = async (req, res) => {
  try {
    const [groups] = await pool.query(`
      SELECT 
        r.GroupID,
        COUNT(*) AS ItemCount,
        SUM(CASE 
              WHEN r.TransactionType = 'Rent' THEN (pr.Price / 36) * r.Duration
              ELSE pr.Price
            END) AS Total,
        GROUP_CONCAT(p.Model SEPARATOR ', ') AS ProductModels,
        ANY_VALUE(c.CustomerName) AS CustomerName,
        ANY_VALUE(c.CustomerSurName) AS CustomerSurName
      FROM procurement_request r
      JOIN customer c ON r.CustomerID = c.CustomerID
      JOIN product p ON p.ProductID = r.ProductID
      JOIN product pr ON pr.ProductID = r.ProductID
      WHERE r.Status = 'Pending' AND r.GroupID IS NOT NULL
      GROUP BY r.GroupID
      ORDER BY r.GroupID DESC
    `);

    res.json(groups);
  } catch (err) {
    console.error("Error fetching grouped requests:", err);
    res.status(500).json({ error: "Failed to fetch grouped requests" });
  }
};


exports.submitGroupedRequest = async (req, res) => {
  const customerId = req.session?.user?.id;
  const cartItems = req.body.items;
  const cardId = req.body.cardId;
  const cvv = req.body.cvv;

  if (!customerId || req.session.user.type !== "customer") {
    return res.status(403).json({ error: "Unauthorized" });
  }

  if (!Array.isArray(cartItems) || cartItems.length === 0) {
    return res.status(400).json({ error: "Cart is empty" });
  }

  try {
   
    const [walletResult] = await pool.query("SELECT Balance, CVV FROM wallet WHERE WalletID = ?", [cardId]);
    if (walletResult.length === 0 || walletResult[0].CVV !== cvv) {
      return res.status(400).json({ error: "Invalid card or CVV." });
    }

   
    let totalPrice = 0;
    const itemsToInsert = [];

    for (const item of cartItems) {
      const [result] = await pool.query("SELECT Price FROM product WHERE ProductID = ?", [item.productId]);
      if (result.length === 0) return res.status(400).json({ error: "Invalid product." });

      const price = parseFloat(result[0].Price);
      const type = item.type;
      let monthlyPay = null;
      let duration = null;
      let itemTotal = price;

      if (type === "Rent") {
        duration = parseInt(item.duration) || 24;
        monthlyPay = parseFloat((price / 36).toFixed(2));
        itemTotal = parseFloat((monthlyPay * duration).toFixed(2));
      }

      totalPrice += itemTotal;
      itemsToInsert.push({ ...item, monthlyPay, duration, itemTotal });
    }

    if (walletResult[0].Balance < totalPrice) {
      return res.status(400).json({ error: "Insufficient funds." });
    }

    
    await pool.query("UPDATE wallet SET Balance = Balance - ? WHERE WalletID = ?", [totalPrice, cardId]);

    
    const [groupResult] = await pool.query("SELECT MAX(GroupID) AS maxId FROM procurement_request");
    const groupId = (groupResult[0].maxId || 0) + 1;

    
    for (const item of itemsToInsert) {
      await pool.query(
        `INSERT INTO procurement_request 
          (CustomerID, ProductID, Quantity, RequestedAt, Status, PaymentStatus, MonthlyPay, TotalPrice, Duration, CardID, TransactionType, PaymentMethod, GroupID)
         VALUES (?, ?, ?, NOW(), 'Pending', 'Reserved', ?, ?, ?, ?, ?, ?, ?)`,
        [
          customerId,
          item.productId,
          item.quantity || 1,
          item.monthlyPay,
          item.itemTotal,
          item.duration || null,
          cardId,
          item.type,
          'Card', 
          groupId
        ]
      );
    }

    res.json({ success: true, groupId });
  } catch (err) {
    console.error("submitGroupedRequest error:", err);
    res.status(500).json({ error: "Server error" });
  }
};


exports.getPendingProductIds = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT DISTINCT ProductID FROM procurement_request WHERE Status = 'Pending'
    `);
    const ids = rows.map(r => r.ProductID);
    res.json(ids);
  } catch (err) {
    console.error("Failed to fetch pending products", err);
    res.status(500).json({ error: "Server error" });
  }
};
