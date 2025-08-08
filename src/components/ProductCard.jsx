import React from "react";

function ProductCard({ product }) {
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
  </div>

  <button className="buy-button">Buy now</button>
</div>
  );
}

export default ProductCard;