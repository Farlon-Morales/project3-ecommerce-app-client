// src/components/ProductCard.jsx
import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

// ℹ️ Base URL for your API
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5005";

// Uniform media height + a minimum description height to keep cards equal
const MEDIA_HEIGHT = 180;   // a bit longer image area
const DESC_MIN_HEIGHT = 72; // ~3 lines; tweak as needed

function ProductCard({ product, onDeleted, className = "" }) {
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

  return (
    <div className={`card h-100 shadow-sm w-100 ${className}`}>
      {/* Uniform media area (image or placeholder) */}
      <div
        className="rounded-top bg-body-secondary overflow-hidden d-flex align-items-center justify-content-center"
        style={{ height: MEDIA_HEIGHT }}
      >
        {imgSrc ? (
          <img
            src={imgSrc}
            alt={product.title}
            style={{
              maxHeight: "100%",
              maxWidth: "100%",
              objectFit: "contain", // show full image (no crop)
            }}
          />
        ) : (
          <div className="text-muted" style={{ fontSize: "0.9rem" }}>
            No image
          </div>
        )}
      </div>

      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{product.title}</h5>

        {/* Description only, no reviews. Reserve space but don't cut text */}
        <p
          className="card-text flex-grow-1 mb-3"
          style={{
            minHeight: DESC_MIN_HEIGHT,   // keeps short/no-description cards from shrinking
            whiteSpace: "normal",
            overflow: "visible",
            textOverflow: "unset",
            wordBreak: "break-word",      // handle very long words/URLs
            lineHeight: "1.2rem",
          }}
        >
          {product.description || "\u00A0" /* keep height even if empty */}
        </p>

        <div className="fw-bold mb-3">${product.price}</div>

        <div className="d-flex gap-2 mt-auto">
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