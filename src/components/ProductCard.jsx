import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

// ℹ️ Base URL for your API
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5005";

function ProductCard({ product, onDeleted }) {
  // ℹ️ Get the logged-in user to check ownership
  const { user } = useContext(AuthContext);

  const [error, setError] = useState("");

  // ℹ️ Determine if the logged-in user owns this product
  const productOwnerId =
    typeof product.owner === "string" ? product.owner : product.owner?._id;
  const canManage = user && productOwnerId && user._id === productOwnerId;

  const handleDelete = async () => {
    setError("");
    try {
      const token = localStorage.getItem("authToken");
      // ℹ️ Call protected delete endpoint
      await axios.delete(`${API_URL}/products/${product._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onDeleted?.(product._id);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to delete product");
    }
  };

  return (
    <div className="product-card">
      <div className="product-info">
        <img
          className="product-image"
          src={product.thumbnail || product.images?.[0]}
          alt={product.title}
        />
        <h3>{product.title}</h3>
        <p>{product.description}</p>
        <strong>${product.price}</strong>

        <div className="product-actions">
          <Link to={`/products/${product._id}`} className="view-button">
            View
          </Link>

          {canManage && (
            <>
              <Link to={`/products/${product._id}/edit`} className="edit-button">
                Edit
              </Link>
              <button onClick={handleDelete} className="delete-button">
                Delete
              </button>
            </>
          )}
        </div>

        {error && <div className="error-message">{error}</div>}
      </div>

      {/* ℹ️ Show Buy now only if not owner */}
      {!canManage && <button className="buy-button">Buy now</button>}
    </div>
  );
}

export default ProductCard;