// src/pages/ProductsList.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../components/ProductCard";

// ℹ️ Base URL for your API (Vite env first, then fallback)
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5005";

function ProductsList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");

  // ℹ️ Fetch products on mount
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError("");
      try {
        const { data } = await axios.get(`${API_URL}/products`);
        setProducts(data);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // ℹ️ Remove deleted product from state (called by ProductCard)
  const handleDeleted = (id) => {
    setProducts((prev) => prev.filter((p) => p._id !== id));
  };

  // ℹ️ Loading state (centered spinner)
  if (loading) {
    return (
      <main className="container-fluid py-5">
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status" aria-label="Loading products"></div>
        </div>
      </main>
    );
  }

  // ℹ️ Error state
  if (error) {
    return (
      <main className="container-fluid py-4">
        <div className="alert alert-danger mb-0">{error}</div>
      </main>
    );
  }

  return (
    <main className="container-fluid py-4">
      <h1 className="mb-4">Products</h1>

      {products.length === 0 ? (
        <div className="alert alert-info">No products found.</div>
      ) : (
        <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 g-4">
          {products.map((product) => (
            <div className="col" key={product._id}>
              <ProductCard product={product} onDeleted={handleDeleted} />
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

export default ProductsList;