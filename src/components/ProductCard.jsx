// src/components/ProductCard.jsx
import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

// ℹ️ Base URL for your API
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5005";

function ProductCard({ product, onDeleted }) {
  const { user } = useContext(AuthContext);
  const [error, setError] = useState("");

  const productOwnerId =
    typeof product.owner === "string" ? product.owner : product.owner?._id;
  const canManage = user && productOwnerId && user._id === productOwnerId;

  const handleDelete = async () => {
    setError("");
    try {
      const token = localStorage.getItem("authToken");
      await axios.delete(`${API_URL}/products/${product._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onDeleted?.(product._id);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to delete product");
    }
  };

  const imgSrc = product.thumbnail || product.images?.[0];
  const hasStats = typeof product.reviewCount === "number";
  const avgDisplay =
    product.avgRating != null ? Number(product.avgRating).toFixed(1) : null;

  return (
    <div className="card h-100 shadow-sm w-100">
      {imgSrc && (
        <div
          className="rounded-top bg-body-secondary d-flex align-items-center justify-content-center"
          style={{ height: 160, overflow: "hidden" }} // ⬅️ smaller box, no crop
        >
          <img
            src={imgSrc}
            alt={product.title}
            className="img-fluid"
            style={{ maxHeight: "100%", objectFit: "contain" }} // ⬅️ contain prevents cropping
          />
        </div>
      )}

      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{product.title}</h5>

        {hasStats && (
          <div className="text-muted mb-2">
            {product.reviewCount > 0 ? (
              <>
                <span aria-hidden="true">★</span>{" "}
                <strong>{avgDisplay}</strong>{" "}
                <small>({product.reviewCount})</small>
              </>
            ) : (
              <small>No reviews yet</small>
            )}
          </div>
        )}

        <p className="card-text flex-grow-1">{product.description}</p>

        <div className="fw-bold mb-3">${product.price}</div>

        <div className="d-flex gap-2">
          <Link to={`/products/${product._id}`} className="btn btn-primary">
            View
          </Link>

          {canManage ? (
            <>
              <Link
                to={`/products/${product._id}/edit`}
                className="btn btn-secondary"
              >
                Edit
              </Link>
              <button onClick={handleDelete} className="btn btn-danger">
                Delete
              </button>
            </>
          ) : (
            <button className="btn btn-outline-primary">Buy now</button>
          )}
        </div>

        {error && <div className="alert alert-danger mt-3 mb-0">{error}</div>}
      </div>
    </div>
  );
}

export default ProductCard;