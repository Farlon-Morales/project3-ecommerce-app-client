import React, { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../data/api";
import { AuthContext } from "../context/AuthContext.jsx";
import Review from "../components/ReviewCard.jsx"; // ✅ correct import

function ProductDetails() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const { data } = await api.get(`/products/${id}`);
        if (!ignore) setProduct(data);
      } catch (err) {
        if (!ignore) setMsg(err.response?.data?.message || "Failed to load product");
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => { ignore = true; };
  }, [id]);

  if (loading) return <p>Loading product...</p>;
  if (!product) return <p>{msg || "Product not found."}</p>;

  const isOwner = user && product.owner && product.owner._id === user._id;
  const imgSrc = product.thumbnail || product.imageUrl;

  return (
    <div>
      <h1>{product.title}</h1>

      {imgSrc && (
        <div>
          <img src={imgSrc} alt={product.title} width="300" />
        </div>
      )}

      <p>{product.description}</p>
      <strong>Price: ${product.price}</strong>
      {product.owner?.name && <p>Seller: {product.owner.name}</p>}

      {isOwner && (
        <p style={{ marginTop: 12 }}>
          <Link to={`/products/${product._id}/edit`}>Edit</Link>
        </p>
      )}

      {/* Reviews */}
      <Review productId={id} isOwner={isOwner} />
    </div>
  );
}

export default ProductDetails;