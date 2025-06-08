const Employee = require('../models/employeeModel');

const pool = require('../models/db');

exports.getAll = (req, res) => {
  Employee.getAll((err, results) => {
    if (err) return res.status(500).send('Error fetching employees');
    res.json(results);
  });
};

exports.add = (req, res) => {
  Employee.add(req.body, (err) => {
    if (err) return res.status(500).send('Error adding employee');
    res.send('Employee added successfully');
  });
};

exports.createEmployee = async (req, res) => {
  const { name, surname, position, department } = req.body;

  if (!req.session.user || req.session.user.type !== "employee" || req.session.user.department !== "Admin") {
    return res.status(403).json({ error: "Forbidden" });
  }

  try {
    const [max] = await pool.query("SELECT MAX(EmployeeID)+1 AS NewID FROM employee");
    const newID = max[0].NewID || 1;

    const email = `${name.toLowerCase()}@example.com`;
    const password = `${name.toLowerCase()}123`;

    await pool.query(
      `INSERT INTO employee (EmployeeID, EmployeeName, EmployeeSurName, Position, Department, Email, Password)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [newID, name, surname, position, department, email, password]
    );

    res.json({ success: true, email, password });
  } catch (err) {
    console.error("Error creating employee:", err);
    res.status(500).json({ error: "Server error" });
  }
};
