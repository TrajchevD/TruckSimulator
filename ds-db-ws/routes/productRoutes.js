const express = require('express');
const router = express.Router();
const pool = require('../models/db');
const productController = require('../controllers/productController');

router.get("/", async (req, res) => {
    try {
      const [rows] = await pool.query(`
        SELECT 
          p.ProductID, p.Model, p.Price, p.LicensePlate, p.Status,
          CASE 
            WHEN t.HP IS NOT NULL THEN 'truck'
            WHEN tr.Capacity IS NOT NULL THEN 'trailer'
          END AS type,
          JSON_OBJECT('HP', t.HP, 'Capacity', tr.Capacity) AS specs
        FROM product p
        LEFT JOIN truck t ON p.ProductID = t.ProductID
        LEFT JOIN trailer tr ON p.ProductID = tr.ProductID
      `);
  
      res.json(rows);
    } catch (err) {
      console.error("Error loading products:", err);
      res.status(500).json({ error: "Failed to load products" });
    }
  });
router.post('/', productController.addProduct);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;
