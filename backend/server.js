const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

// Create a database connection pool
const db = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "inventory",
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 10000, 
  });

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Test database connection
app.get("/admin/products", (req, res) => {
    const q = "SELECT * FROM PRODUCTS";
    db.query(q, (err, results) => {
      if (err) {
        console.error("Database query error:", err);
        return res.status(500).json({ error: "Database connection issue" });
      }
      res.json(results);
    });
  });
  
// Add a new product
app.post("/admin/add-products", (req, res) => {
    const { name, description, price, category } = req.body;
  
    if (!name || !description || typeof price !== "number" || !category) {
      return res.status(400).json({ error: "Invalid input data" });
    }
  
    const query = "INSERT INTO products (name, description, price, category) VALUES (?, ?, ?, ?)";
  
    db.query(query, [name, description, price, category], (err, result) => {
      if (err) {
        console.error("Insert error:", err);
        return res.status(500).json({ error: "Failed to add product" });
      }
      res.status(201).json({ message: "Product added", productId: result.insertId });
    });
  });

// Update a product
app.put("/update-product/:id", (req, res) => {
  const { id } = req.params; 
  const { name, description, price, stock } = req.body; 

  if (!name || !description || typeof price !== "number" || typeof stock !== "number") {
    return res.status(400).json({ error: "Invalid input data" });
  }

  const query = "UPDATE products SET name = ?, description = ?, price = ?, stock = ? WHERE id = ?";

  db.query(query, [name, description, price, stock, id], (err, result) => {
    if (err) {
      console.error("Update error:", err);
      return res.status(500).json({ error: "Failed to update product" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({ message: "Product updated successfully" });
  });
});

  
// Delete a product
app.delete("/delete-product/:id", (req, res) => {
  const { id } = req.params;

  const query = "DELETE FROM products WHERE id = ?";

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("Delete error:", err);
      return res.status(500).json({ error: "Failed to delete product" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({ message: "Product deleted successfully" });
  });
});
