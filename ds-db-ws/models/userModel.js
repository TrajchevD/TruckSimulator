const db = require('./db');

exports.findCustomerByEmail = (email, cb) => {
  db.query('SELECT * FROM customers WHERE Email = ?', [email], cb);
};

exports.createCustomer = (data, callback) => {
  const { CustomerID, CustomerName, CustomerSurName, Email, Address, CustomerContact, Password } = data;
  db.query('INSERT INTO customer VALUES (?, ?, ?, ?, ?, ?, ?)',
    [CustomerID, CustomerName, CustomerSurName, Email, Address, CustomerContact, Password], callback);
};

exports.findEmployeeByEmail = (email, cb) => {
  db.query('SELECT * FROM employees WHERE Email = ?', [email], cb);
};
