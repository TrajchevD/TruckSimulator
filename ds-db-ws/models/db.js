const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '2405',
  database: 'trucksimulator',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
pool.query('SELECT 1 + 1 AS solution')
  .then(([rows]) => console.log('Database connection test successful:', rows[0].solution))
  .catch(err => console.error('Database connection failed:', err));
module.exports = pool;