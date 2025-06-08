const express = require('express');
const session = require('express-session');
const path = require('path');
const app = express();
const port = 3000;
const pool = require('./models/db');
const notificationRoutes = require('./routes/notificationRoutes');
const procurementRequestRoutes = require('./routes/procurementRequestRoutes');
const walletRoutes = require('./routes/walletRoutes');
const procurementRoutes = require('./routes/procurementRoutes');

const authController = require('./controllers/authController');
const adminRoutes = require('./routes/adminRoutes');




app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false, 
}));

app.use((req, res, next) => {
  if (!req.session?.user && (req.path === "/" || req.path === "/index.html")) {
    return res.redirect("/login.html");
  }
  next();
});

app.use(express.static(path.join(__dirname, 'public')));


app.post('/signup', authController.signup);
app.post('/login', authController.login);
app.post('/logout', authController.logout);

app.get('/api/me', (req, res) => {
  if (!req.session.user) return res.status(401).json({ error: 'Not logged in' });
  res.json(req.session.user);
});


app.use('/api/products', require('./routes/productRoutes'));
app.use("/api/procurement", require("./routes/procurementRoutes"));
app.use('/api/procurements', require('./routes/procurementRoutes'));
app.use('/api/maintenance', require('./routes/maintenanceRoutes'));
app.use('/api/employees', require('./routes/employeeRoutes'));
app.use('/api/cart', require('./routes/procurementRoutes'));
app.use('/api/feedback', require('./routes/feedbackRoutes'));
app.use('/api/my-notifications', notificationRoutes);
app.use('/api/procurement-request', procurementRequestRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/requests', procurementRequestRoutes);
app.use('/procurements', procurementRoutes);
app.use('/api', procurementRoutes);
app.use('/api/admin', adminRoutes);



app.get('/', (req, res) => {
  if (!req.session.user) return res.redirect('/login.html');
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'login.html'));
});
app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'register.html'));
});


app.listen(port, () => {
  console.log(` Server running: http://localhost:${port}`);
});

app.get('/api/my-notifications', async (req, res) => {
  if (!req.session.user || req.session.user.type !== 'customer') {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const customerId = req.session.user.id;
    const [rows] = await pool.query(`
      SELECT TransactionID, Status
      FROM procurement
      WHERE CustomerID = ?
      ORDER BY ProcurementDate DESC
    `, [customerId]);

    res.json(rows);
  } catch (err) {
    console.error('Notifications fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});



app.get('/admin/overview', (req, res) => {
  if (req.session?.user?.type !== 'admin') return res.redirect('/login');
  res.sendFile(path.join(__dirname, 'views/admin-overview.html'));
});



