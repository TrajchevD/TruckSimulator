const bcrypt = require('bcryptjs');
const pool = require('../models/db'); 

exports.signup = async (req, res) => {
  const { name, surname, email, address, contact, password } = req.body;

  const [rows] = await pool.query("SELECT * FROM customer WHERE Email = ?", [email]);
  if (rows.length > 0) return res.send("Email already registered.");

  const hashedPassword = await bcrypt.hash(password, 10);
  const [idRow] = await pool.query("SELECT MAX(CustomerID)+1 AS NewID FROM customer");
  const newID = idRow[0].NewID || 1;

  await pool.query(
    `INSERT INTO customer (CustomerID, CustomerName, CustomerSurName, Email, Address, CustomerContact, Password) 
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [newID, name, surname, email, address, contact, hashedPassword]
  );

  res.send("Registration successful. <a href='/login.html'>Login here</a>.");
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const [customers] = await pool.query("SELECT * FROM customer WHERE Email = ?", [email]);
  const customer = customers[0];

  if (customer && await bcrypt.compare(password, customer.Password)) {
    req.session.user = {
      type: "customer",
      id: customer.CustomerID,
      name: customer.CustomerName
    };
    return res.redirect("/index.html");
  }

  const [employees] = await pool.query("SELECT * FROM employee WHERE Email = ?", [email]);
  const employee = employees[0];

  if (employee && password === employee.Password) {
    req.session.user = {
      type: "employee",
      id: employee.EmployeeID,
      name: employee.EmployeeName,
      department: employee.Department
    };
    return res.redirect("/index.html");
  }

  res.send("Invalid credentials.");
};

exports.logout = (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).send("Logout failed.");
    res.clearCookie("connect.sid");
    res.redirect("/login.html");
  });
};
