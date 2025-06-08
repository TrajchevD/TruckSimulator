const db = require('./db');

exports.getAll = (cb) => {
  db.query('SELECT * FROM product', cb);
};

exports.getAvailable = (cb) => {
  db.query("SELECT * FROM product WHERE Status = 'available'", cb);
};

exports.getById = (id, cb) => {
  db.query("SELECT * FROM product WHERE ProductID = ?", [id], cb);
};

exports.addProduct = (data, cb) => {
  const { ProductID, Model, Price, LicensePlate, Status } = data;
  db.query('INSERT INTO product VALUES (?, ?, ?, ?, ?)', [ProductID, Model, Price, LicensePlate, Status], cb);
};

exports.updateStatus = (id, status, cb) => {
  db.query('UPDATE product SET Status = ? WHERE ProductID = ?', [status, id], cb);
};