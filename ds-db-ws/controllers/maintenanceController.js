const Maintenance = require('../models/maintenanceModel');

const pool = require('../models/db');

exports.getAllLogs = async (req, res) => {
  if (!req.session.user || req.session.user.department !== 'Maintenance') {
    return res.status(403).json({ error: "Forbidden" });
  }

  try {
    const [rows] = await pool.query(`
      SELECT m.MainID, p.Model, m.Description, m.Cost, m.Status, m.MainDate
      FROM maintenance m
      JOIN product p ON m.ProductID = p.ProductID
      ORDER BY m.MainDate DESC
    `);

    res.json(rows);
  } catch (err) {
    console.error("Fetch maintenance error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.startMaintenance = async (req, res) => {
  const { ProductID, Description, Cost } = req.body;
  const employeeId = req.session.user?.id;

  if (!employeeId || req.session.user.department !== 'Maintenance') {
    return res.status(403).json({ error: "Forbidden" });
  }

  try {
    const [max] = await pool.query("SELECT MAX(MainID)+1 AS NewID FROM maintenance");
    const newId = max[0].NewID || 1;

    await pool.query(
      `INSERT INTO maintenance (MainID, EmployeeID, ProductID, MainDate, Description, Cost, Status)
       VALUES (?, ?, ?, NOW(), ?, ?, 'Pending')`,
      [newId, employeeId, ProductID, Description, Cost]
    );

    await pool.query("UPDATE product SET Status = 'maintenance' WHERE ProductID = ?", [ProductID]);

    res.json({ success: true });
  } catch (err) {
    console.error("Start maintenance error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.completeMaintenance = async (req, res) => {
  const { description, cost } = req.body;
  const mainId = req.params.id;

  if (req.session.user?.department !== 'Maintenance') {
    return res.status(403).json({ error: "Forbidden" });
  }

  try {
    await pool.query(
      `UPDATE maintenance 
       SET Description = ?, Cost = ?, Status = 'Completed', EndTime = NOW() 
       WHERE MainID = ?`,
      [description, cost, mainId]
    );

    const [rows] = await pool.query("SELECT ProductID FROM maintenance WHERE MainID = ?", [mainId]);
    const productId = rows[0]?.ProductID;

    if (productId) {
      await pool.query("UPDATE product SET Status = 'available' WHERE ProductID = ?", [productId]);
    }

    res.json({ success: true });
  } catch (err) {
    console.error("Complete maintenance error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

