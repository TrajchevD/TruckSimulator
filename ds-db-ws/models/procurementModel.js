const db = require('./db');

exports.getAll = (cb) => {
  db.query('SELECT * FROM procurement', cb);
};

exports.getDetailedTransactions = (cb) => {
  const query = `
    SELECT p.TransactionID, c.CustomerName, c.CustomerSurName, pr.Model, t.Type, t.Duration, t.MonthlyPay, t.TotalPrice, p.ProcurementDate
    FROM procurement p
    JOIN customer c ON p.CustomerID = c.CustomerID
    JOIN product pr ON p.ProductID = pr.ProductID
    JOIN t_type t ON p.TransactionID = t.TransactionID`;
  db.query(query, cb);
};

exports.add = (data, cb) => {
  const { TransactionID, EmployeeID, CustomerID, ProductID, ProcurementDate, Quantity } = data;
  db.query('INSERT INTO procurement VALUES (?, ?, ?, ?, ?, ?)', [TransactionID, EmployeeID, CustomerID, ProductID, ProcurementDate, Quantity], cb);
};