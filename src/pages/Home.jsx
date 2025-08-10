import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../components/ProductCard";
import "../App.css"; 

// ℹ️ Base URL for your API (Vite env first, then fallback)
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5005";

function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // ℹ️ Fetch products on mount
    axios
      .get(`${API_URL}/products`)
      .then((response) => {
        setProducts(response.data);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
      });
  }, []);

  // ℹ️ Remove the product from UI right after a successful delete
  const handleDeleted = (id) => {
    setProducts((prev) => prev.filter((p) => p._id !== id));
  };

  return (
    <div>
      <h1 className="products-title">Our Products</h1>
      <div className="products-list">
        {products.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            onDeleted={handleDeleted} // ✅ important: update local state after delete
          />
        ))}
      </div>
    </div>
  );
}

export default Home;