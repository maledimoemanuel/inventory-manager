import React, { useState, useEffect } from "react";
import "./stock.css";

function Stock() {
  const [stock, setStock] = useState([]);
  const [products, setProducts] = useState([]);
  const [newStock, setNewStock] = useState({
    product_id: "",
    quantity: "",
    threshold: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingStockId, setEditingStockId] = useState(null);

  // Fetch stock data
  useEffect(() => {
    const fetchStock = async () => {
      try {
        const response = await fetch("http://localhost:5000/admin/stock");
        if (response.ok) {
          const data = await response.json();
          setStock(data);
        } else {
          console.error("Failed to fetch stock");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchStock();
  }, []);

  // Fetch product data
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:5000/admin/products");
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        } else {
          console.error("Failed to fetch products");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchProducts();
  }, []);

  // Handle input changes
  const handleInputChange = (e) => {
    setNewStock({ ...newStock, [e.target.name]: e.target.value });
  };

  // Add stock
  const addStock = async () => {
    try {
      const response = await fetch("http://localhost:5000/admin/add-stock", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newStock),
      });

      if (response.ok) {
        const data = await response.json();
        setStock([...stock, { ...newStock, stockId: data.stockId }]);
        setNewStock({ product_id: "", quantity: "", threshold: "" });
      } else {
        console.error("Failed to add stock");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Update stock
  const updateStock = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/admin/update-stock/${editingStockId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newStock),
        }
      );

      if (response.ok) {
        setStock(
          stock.map((item) =>
            item.stock_id === editingStockId
              ? { ...item, ...newStock }
              : item
          )
        );
        setIsEditing(false);
        setEditingStockId(null);
        setNewStock({ product_id: "", quantity: "", threshold: "" });
      } else {
        console.error("Failed to update stock");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Delete stock
  const deleteStock = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5000/admin/delete-stock/${id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setStock(stock.filter((item) => item.stock_id !== id));
      } else {
        console.error("Failed to delete stock");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Open edit form
  const openEditForm = (item) => {
    setNewStock({
      product_id: item.product_id,
      quantity: item.quantity,
      threshold: item.threshold,
    });
    setIsEditing(true);
    setEditingStockId(item.stock_id);
  };

  return (
    <div className="stock">
      <h1>Stock Management</h1>

      {/* Add/Edit Stock Form */}
      <div className="stock-form">
        <h2>{isEditing ? "Edit Stock" : "Add Stock"}</h2>
        <label>Product:</label>
        <select
          name="product_id"
          value={newStock.product_id}
          onChange={handleInputChange}
          disabled={isEditing}
        >
          <option value="">Select Product</option>
          {products.map((product) => (
            <option key={product.product_id} value={product.product_id}>
              {product.name}
            </option>
          ))}
        </select>
        <label>Quantity:</label>
        <input
          type="number"
          name="quantity"
          value={newStock.quantity}
          onChange={handleInputChange}
        />
        <label>Threshold:</label>
        <input
          type="number"
          name="threshold"
          value={newStock.threshold}
          onChange={handleInputChange}
        />
        <button onClick={isEditing ? updateStock : addStock}>
          {isEditing ? "Update Stock" : "Add Stock"}
        </button>
        {isEditing && (
          <button
            onClick={() => {
              setIsEditing(false);
              setEditingStockId(null);
              setNewStock({ product_id: "", quantity: "", threshold: "" });
            }}
          >
            Cancel
          </button>
        )}
      </div>

      {/* Stock List */}
      <div className="stock-list">
        <h2>Stock List</h2>
        <table>
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Quantity</th>
              <th>Threshold</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {stock.map((item) => (
              <tr key={item.stock_id}>
                <td>{item.name}</td>
                <td>{item.quantity}</td>
                <td>{item.threshold}</td>
                <td>
                  <button onClick={() => openEditForm(item)}>Edit</button>
                  <button onClick={() => deleteStock(item.stock_id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Stock;