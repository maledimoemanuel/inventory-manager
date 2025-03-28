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
app.put("/admin/update-product/:id", (req, res) => {
  const { id } = req.params;
  const { name, description, price, category } = req.body;

  console.log("Incoming Data:", { id, name, description, price, category });

  // Validate the ID
  if (isNaN(parseInt(id, 10))) {
    return res.status(400).json({ error: "Invalid product ID" });
  }

  const parsedPrice = parseFloat(price);

  if (!name || !description || !category || isNaN(parsedPrice)) {
    console.log("Validation failed:", { name, description, price, category });
    return res.status(400).json({ error: "Invalid input data" });
  }

  const query = "UPDATE products SET name = ?, description = ?, price = ?, category = ? WHERE product_id = ?";

  db.query(query, [name, description, parsedPrice, category, id], (err, result) => {
    if (err) {
      console.error("Update error:", err);
      return res.status(500).json({ error: "Failed to update product", details: err.message });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({ message: "Product updated successfully" });
  });
});
  
// Delete a product
app.delete("/admin/delete-product/:id", (req, res) => {
  const { id } = req.params;

  console.log("Incoming Product ID for Deletion:", id);

  // Validate the product_id
  if (isNaN(parseInt(id, 10))) {
    return res.status(400).json({ error: "Invalid product ID" });
  }

  const query = "DELETE FROM products WHERE product_id = ?";

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("Delete error:", err);
      return res.status(500).json({ error: "Failed to delete product", details: err.message });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({ message: "Product deleted successfully" });
  });
});

//add stock
app.post("/admin/add-stock", (req, res) => {
  const { product_id, quantity, threshold } = req.body;

  if (!product_id || !quantity || !threshold) {
    return res.status(400).json({ error: "Invalid input data" });
  }

  const query = "INSERT INTO stock (product_id, quantity, threshold) VALUES (?, ?, ?)";
  db.query(query, [product_id, quantity, threshold], (err, result) => {
    if (err) {
      console.error("Stock insert error:", err);
      return res.status(500).json({ error: "Failed to add stock" });
    }
    res.status(201).json({ message: "Stock added", stockId: result.insertId });
  });
});

//get stock
app.get("/admin/stock", (req, res) => {
  const query = "SELECT p.name, s.quantity, s.threshold FROM stock s JOIN products p ON s.product_id = p.product_id";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Stock fetch error:", err);
      return res.status(500).json({ error: "Failed to fetch stock" });
    }
    res.json(results);
  });
});

//update stock
app.put("/admin/update-stock/:id", (req, res) => {
  const { id } = req.params;
  const { quantity, threshold } = req.body;

  if (!quantity || !threshold) {
    return res.status(400).json({ error: "Invalid input data" });
  }

  const query = "UPDATE stock SET quantity = ?, threshold = ? WHERE stock_id = ?";
  db.query(query, [quantity, threshold, id], (err, result) => {
    if (err) {
      console.error("Stock update error:", err);
      return res.status(500).json({ error: "Failed to update stock" });
    }
    res.json({ message: "Stock updated successfully" });
  });
});
//delete stock

app.delete("/admin/delete-stock/:id", (req, res) => {
  const { id } = req.params;

  // Validate the stock_id
  if (isNaN(parseInt(id, 10))) {
    return res.status(400).json({ error: "Invalid stock ID" });
  }

  const query = "DELETE FROM stock WHERE stock_id = ?";

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("Delete error:", err);
      return res.status(500).json({ error: "Failed to delete stock", details: err.message });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Stock not found" });
    }

    res.json({ message: "Stock deleted successfully" });
  });
})

//stock alerts
app.get("/admin/stock-alerts", (req, res) => {
  const query = "SELECT p.name, s.quantity FROM stock s JOIN products p ON s.product_id = p.product_id WHERE s.quantity <= s.threshold";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Stock alert error:", err);
      return res.status(500).json({ error: "Failed to fetch stock alerts" });
    }
    res.json(results);
  });
});
//add into sales
app.post("/admin/add-sale", (req, res) => {
  const { product_id, quantity_sold } = req.body;

  if (!product_id || !quantity_sold) {
    return res.status(400).json({ error: "Invalid input data" });
  }

  const query = "INSERT INTO sales (product_id, quantity_sold) VALUES (?, ?)";
  db.query(query, [product_id, quantity_sold], (err, result) => {
    if (err) {
      console.error("Sale insert error:", err);
      return res.status(500).json({ error: "Failed to record sale" });
    }

    // Reduce stock
    const updateStock = "UPDATE stock SET quantity = quantity - ? WHERE product_id = ?";
    db.query(updateStock, [quantity_sold, product_id], (err, updateResult) => {
      if (err) {
        console.error("Stock update error:", err);
        return res.status(500).json({ error: "Failed to update stock" });
      }
      res.status(201).json({ message: "Sale recorded successfully" });
    });
  });
});

app.get("/admin/sales-report", (req, res) => {
  const query = `
    SELECT p.name, SUM(s.quantity_sold) AS total_sold
    FROM sales s
    JOIN products p ON s.product_id = p.product_id
    WHERE s.sale_date >= NOW() - INTERVAL 30 DAY
    GROUP BY p.name
  `;
  db.query(query, (err, results) => {
    if (err) {
      console.error("Sales report error:", err);
      return res.status(500).json({ error: "Failed to fetch sales report" });
    }
    res.json(results);
  });
});

