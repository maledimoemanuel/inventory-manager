import React, { useState, useEffect } from "react";
import "./inventory.css";

const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);

  // Fetch products from the backend
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

  const handleInputChange = (e) => {
    setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
  };

  const addProduct = async () => {
    try {
      const productData = {
        name: newProduct.name,
        description: newProduct.description,
        price: Number(newProduct.price),
        category: newProduct.category,
      };

      const response = await fetch("http://localhost:5000/admin/add-products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        const data = await response.json();

        const updatedProduct = {
          id: data.productId,
          ...productData,
        };

        setProducts([...products, updatedProduct]);
        setShowModal(false);
        setNewProduct({ name: "", description: "", price: "", category: "" });
      } else {
        console.error("Failed to add product");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const updateProduct = async () => {
    console.log("Editing Product ID:", editingProductId);
    try {
      const productData = {
        name: newProduct.name,
        description: newProduct.description,
        price: Number(newProduct.price),
        category: newProduct.category,
      };
  
      const response = await fetch(
        `http://localhost:5000/admin/update-product/${editingProductId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(productData),
        }
      );
  
      if (response.ok) {
        setProducts(
          products.map((product) =>
            product.id === editingProductId
              ? { ...product, ...productData }
              : product
          )
        );
        setShowModal(false);
        setNewProduct({ name: "", description: "", price: "", category: "" });
        setIsEditing(false);
        setEditingProductId(null);
      } else {
        console.error("Failed to update product");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };


  const deleteProduct = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5000/admin/delete-product/${id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setProducts(products.filter((product) => product.product_id !== id));
      } else {
        console.error("Failed to delete product");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const openEditModal = (product) => {
    setNewProduct({
      name: product.name,
      description: product.description || "",
      price: product.price,
      category: product.category || "",
    });
    setIsEditing(true);
    setEditingProductId(product.product_id);
    setShowModal(true);
  };

  return (
    <div className="inventory">
      <h1>Inventory</h1>
      <button className="add-btn" onClick={() => setShowModal(true)}>
        Add Product
      </button>
      <div className="product-list">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <h3>{product.name}</h3>
            <p>Price: R{product.price}</p>
            <p>{product.description}</p>
            <button
              className="update-btn"
              onClick={() => openEditModal(product)}
            >
              Update
            </button>
            <button
              className="delete-btn"
              onClick={() => deleteProduct(product.product_id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>{isEditing ? "Update Product" : "Add New Product"}</h2>
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={newProduct.name}
              onChange={handleInputChange}
            />
            <br></br>

            <label>Description:</label>
            <textarea
              name="description"
              value={newProduct.description}
              onChange={handleInputChange}
            ></textarea>
            <br></br>

            <label>Price:</label>
            <input
              type="number"
              name="price"
              value={newProduct.price}
              onChange={handleInputChange}
            />
            <br></br>

            <label>Category:</label>
            <input
              type="text"
              name="category"
              value={newProduct.category}
              onChange={handleInputChange}
            />
            <br></br>

            <button
              className="save-btn"
              onClick={isEditing ? updateProduct : addProduct}
            >
              {isEditing ? "Update" : "Save"}
            </button>
            <button
              className="close-btn"
              onClick={() => {
                setShowModal(false);
                setIsEditing(false);
                setNewProduct({ name: "", description: "", price: "", category: "" });
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;