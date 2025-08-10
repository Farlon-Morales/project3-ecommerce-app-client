import React, { useContext, useState } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

// ℹ️ Base URL for your API (Vite env first, then fallback)
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5005";

function ProductCard({ product, onDeleted }) {
  // ℹ️ Get the logged-in user from context to check ownership
  const { user } = useContext(AuthContext);

  const [error, setError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false); // ℹ️ prevent double clicks

  // ℹ️ product.owner may be an ObjectId string or a populated object
  const productOwnerId =
    typeof product.owner === "string" ? product.owner : product.owner?._id;

  // ℹ️ Only the owner can manage (delete/edit) the product
  const canManage = user && productOwnerId && user._id === productOwnerId;

  const handleDelete = async () => {
    setError("");

    // ℹ️ Defensive: make sure we actually have a Mongo _id to call the route
    if (!product?._id) {
      setError("Missing product id.");
      return;
    }

    try {
      setIsDeleting(true);

      const token = localStorage.getItem("authToken");

      // ℹ️ Build and log the exact URL to catch mismatches (/products vs /api/products)
      const url = `${API_URL}/products/${product._id}`;
      console.log("DELETE ->", url);

      // ℹ️ validateStatus lets us inspect non-2xx without throwing,
      //     so we can show a clearer error message (like 404 Not Found).
      const res = await axios.delete(url, {
        headers: { Authorization: `Bearer ${token}` },
        validateStatus: () => true,
      });

      console.log("DELETE status:", res.status, res.data);

      // ℹ️ success: 200 or 204 depending on your backend
      if (res.status === 200 || res.status === 204) {
        // ℹ️ Let parent list remove this card from UI
        onDeleted?.(product._id);
        return;
      }

      // ❗ Common cause of 404 here:
      //    - server mounts routes at /products but client calls /api/products (or vice versa)
      //    - server not restarted after adding DELETE route
      //    - wrong id (e.g., using product.id instead of product._id)
      const msg =
        res?.data?.message ||
        (res.status === 404
          ? "Delete route not found. Check the URL matches your server mount (e.g. app.use('/products', ...))."
          : `Delete failed (${res.status}).`);
      throw new Error(msg);
    } catch (err) {
      console.error("Delete failed:", err);
      setError(err.message || "Failed to delete product");
    } finally {
      setIsDeleting(false);
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

        <div className="product-meta">
          <span className="product-category">{product.category}</span>
          <span className="product-rating">⭐ {product.rating}</span>
        </div>

        {/* ℹ️ Optional: show owner name if populated */}
        {product.owner && (
          <small style={{ display: "block", marginTop: 6, opacity: 0.8 }}>
            By{" "}
            {typeof product.owner === "object"
              ? product.owner.name
              : productOwnerId}
          </small>
        )}

        {/* ℹ️ Show Delete only if current user owns this product */}
        {canManage && (
          <button
            className="delete-button"
            onClick={handleDelete}
            style={{ marginTop: 8 }}
            disabled={isDeleting} // ℹ️ avoid duplicate requests
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        )}

        {error && (
          <div style={{ color: "crimson", marginTop: 6 }}>{error}</div>
        )}
      </div>

      <button className="buy-button">Buy now</button>
    </div>
  );
}

export default ProductCard;