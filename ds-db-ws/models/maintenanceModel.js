const db = require('./db');

exports.getAll = async () => {
  const [rows] = await pool.query(`
    SELECT m.MainID, p.Model, m.Description, m.Cost, m.Status, m.MainDate
    FROM maintenance m
    JOIN product p ON m.ProductID = p.ProductID
    ORDER BY m.MainDate DESC
  `);
  return rows;
};


exports.addMaintenance = (data, cb) => {
  const { MainID, EmployeeID, ProductID, MainDate } = data;
  db.query('INSERT INTO maintenance (MainID, EmployeeID, ProductID, MainDate) VALUES (?, ?, ?, ?)', [MainID, EmployeeID, ProductID, MainDate], cb);
};
