const db = require('./db');

exports.getAll = (cb) => {
  db.query('SELECT * FROM customer', cb);
};

exports.getFeedback = (cb) => {
  db.query(`
    SELECT f.FeedbackID, c.CustomerName, p.Model, f.Rating, f.Comment, f.FeedbackDate
    FROM customerfeedback f
    JOIN customer c ON f.CustomerID = c.CustomerID
    JOIN product p ON f.ProductID = p.ProductID`, cb);
};

exports.addFeedback = (data, cb) => {
  const { FeedbackID, CustomerID, ProductID, Rating, Comment, FeedbackDate, TransactionID } = data;
  db.query('INSERT INTO customerfeedback VALUES (?, ?, ?, ?, ?, ?, ?)',
    [FeedbackID, CustomerID, ProductID, Rating, Comment, FeedbackDate, TransactionID], cb);
};