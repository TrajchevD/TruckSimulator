const Customer = require('../models/customerModel');

exports.getAll = (req, res) => {
  Customer.getAll((err, results) => {
    if (err) return res.status(500).send('Error fetching customers');
    res.json(results);
  });
};

exports.getFeedback = (req, res) => {
  Customer.getFeedback((err, results) => {
    if (err) return res.status(500).send('Error fetching feedback');
    res.json(results);
  });
};

exports.addFeedback = (req, res) => {
  const Customer = require('../models/customerModel');
  Customer.addFeedback(req.body, (err) => {
    if (err) return res.status(500).send('Error submitting feedback');
    res.send('Feedback submitted');
  });
};
