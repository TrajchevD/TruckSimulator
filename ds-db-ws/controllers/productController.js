const productModel = require('../models/productModel');
const pool = require('../models/db');

exports.getAll = async (req, res) => {
  try {
    const products = await productModel.getAll();
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};
exports.getAllProducts = async (req, res) => {
  try {
    console.log("Session user:", req.session.user);

    let query = `
      SELECT 
        p.ProductID, p.Model, p.Price, p.LicensePlate, p.Status,
        CASE 
          WHEN t.ProductID IS NOT NULL THEN 'truck'
          WHEN tr.ProductID IS NOT NULL THEN 'trailer'
          ELSE 'unknown'
        END AS type,
        JSON_OBJECT('HP', t.HP, 'Capacity', tr.Capacity) AS specs
      FROM product p
      LEFT JOIN truck t ON p.ProductID = t.ProductID
      LEFT JOIN trailer tr ON p.ProductID = tr.ProductID
    `;

    if (!req.session.user || req.session.user.type !== "employee") {
      query += " WHERE p.Status = 'available'";
    }

    const [products] = await pool.query(query);

    const parsed = products.map(p => ({
      ...p,
      specs: JSON.parse(p.specs)
    }));

    res.json(parsed);
  } catch (err) {
    console.error("Error loading products:", err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
};



exports.getAvailable = (req, res) => {
  Product.getAvailable((err, results) => {
    if (err) return res.status(500).send('Error fetching available products');
    res.json(results);
  });
};

exports.getById = (req, res) => {
  Product.getById(req.params.id, (err, result) => {
    if (err) return res.status(500).send('Error fetching product');
    res.json(result);
  });
};

exports.addProduct = async (req, res) => {
  const { Type, Model, Price, LicensePlate, Status, HP, Capacity } = req.body;

  try {
    const [idRow] = await pool.query("SELECT MAX(ProductID) + 1 AS NewID FROM product");
    const newID = idRow[0].NewID || 1;

    await pool.query(
      `INSERT INTO product (ProductID, Model, Price, LicensePlate, Status)
       VALUES (?, ?, ?, ?, ?)`,
      [newID, Model, Price, LicensePlate, Status]
    );

    if (Type === "truck") {
      await pool.query("INSERT INTO truck (ProductID, HP) VALUES (?, ?)", [newID, HP]);
    } else if (Type === "trailer") {
      await pool.query("INSERT INTO trailer (ProductID, Capacity) VALUES (?, ?)", [newID, Capacity]);
    }

    res.json({ message: "Product added", id: newID });
  } catch (err) {
    console.error("Add product error:", err);
    res.status(500).send("Error adding product");
  }
};
exports.updateProduct = async (req, res) => {
  const { Model, Price, LicensePlate, Status } = req.body;
  const id = req.params.id;

  try {
    await pool.query(
      `UPDATE product SET Model=?, Price=?, LicensePlate=?, Status=? WHERE ProductID=?`,
      [Model, Price, LicensePlate, Status, id]
    );
    res.json({ message: "Product updated" });
  } catch (err) {
    console.error("Error updating product:", err);
    res.status(500).send("Error updating product");
  }
};

exports.deleteProduct = async (req, res) => {
  const id = req.params.id;

  try {
    await pool.query("DELETE FROM product WHERE ProductID = ?", [id]);
    res.json({ message: "Product deleted" });
  } catch (err) {
    console.error("Error deleting product:", err);
    res.status(500).send("Error deleting product");
  }
};
