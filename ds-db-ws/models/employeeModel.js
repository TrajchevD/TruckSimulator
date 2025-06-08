const db = require('./db');

exports.getAll = (cb) => {
  db.query('SELECT * FROM employee', cb);
};

exports.add = (data, cb) => {
  const { EmployeeID, EmployeeName, EmployeeSurName, Position, Department, Email, Password } = data;
  db.query('INSERT INTO employee VALUES (?, ?, ?, ?, ?, ?, ?)',
    [EmployeeID, EmployeeName, EmployeeSurName, Position, Department, Email, Password], cb);
};

exports.findByEmail = (email, cb) => {
  db.query('SELECT * FROM employee WHERE Email = ?', [email], cb);
};