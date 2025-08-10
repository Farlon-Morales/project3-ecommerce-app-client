import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../components/ProductCard"
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

  if (loading) return <div className="products-list">Loading...</div>;
  if (error)   return <div className="products-list">{error}</div>;

  return (
    <div className="products-list">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} onDeleted={handleDeleted} />
      ))}
    </div>
  );
}

export default ProductsList;