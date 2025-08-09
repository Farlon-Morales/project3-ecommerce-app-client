import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function ProductDetails() {
  const { id } = useParams(); // get product ID from URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:5005/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching product details:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p>Loading product...</p>;
  if (!product) return <p>Product not found.</p>;

  return (
    <div>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <strong>Price: ${product.price}</strong>
      {/* If your product has an image */}
      {product.image && (
        <div>
          <img src={product.image} alt={product.name} width="300" />
        </div>
      )}
    </div>
  );
}

export default ProductDetails;