// pages/ProductsList.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../components/ProductCard"; // or "../components/ProductCard"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5005";

function ProductsList() {
  const [products, setProducts] = useState([]);

  // ℹ️ Fetch on mount
  useEffect(() => {
    axios
      .get(`${API_URL}/products`)
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  // ℹ️ Remove the card from UI after successful delete
  const handleDeleted = (id) => {
    setProducts((prev) => prev.filter((p) => p._id !== id));
  };

  return (
    <div className="products-list">
      {products.map((product) => (
        <ProductCard
          key={product._id}
          product={product}
          onDeleted={handleDeleted} // ✅ important
        />
      ))}
    </div>
  );
}

export default ProductsList;