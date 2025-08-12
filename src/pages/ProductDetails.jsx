// src/pages/ProductDetails.jsx
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

  if (loading) {
    return (
      <main className="container py-5">
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status" aria-label="Loading product"></div>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="container py-5">
        <div className="alert alert-danger mb-0">{msg || "Product not found."}</div>
      </main>
    );
  }

  const isOwner = user && product.owner && product.owner._id === user._id;
  const imgSrc = product.thumbnail || product.imageUrl;
  const hasStats = typeof product.reviewCount === "number";
  const avgDisplay = product.avgRating != null ? Number(product.avgRating).toFixed(1) : null;

  return (
    <main className="container py-4">
      {/* Title / breadcrumb-ish header */}
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h1 className="h3 mb-0">{product.title}</h1>
        {isOwner && (
          <Link to={`/products/${product._id}/edit`} className="btn btn-secondary btn-sm">
            Edit
          </Link>
        )}
      </div>

      {/* Main card */}
      <section className="card shadow-sm">
        <div className="row g-0">
          {/* Image */}
          {imgSrc && (
            <div className="col-12 col-md-5">
              <img
                src={imgSrc}
                alt={product.title}
                className="img-fluid rounded-start w-100"
                style={{ objectFit: "cover", height: "100%" }}
              />
            </div>
          )}

          {/* Details */}
          <div className={imgSrc ? "col-12 col-md-7" : "col-12"}>
            <div className="card-body d-flex flex-column">
              {/* Rating */}
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

              <p className="card-text">{product.description}</p>

              <div className="d-flex align-items-center justify-content-between mt-auto">
                <div>
                  <div className="fs-4 fw-bold">${product.price}</div>
                  {product.owner?.name && (
                    <small className="text-muted">Seller: {product.owner.name}</small>
                  )}
                </div>

                {!isOwner && (
                  <button className="btn btn-primary">
                    Buy now
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="mt-4">
        {/* ✅ pass the actual Mongo ObjectId, not the URL param */}
        <Review productId={product._id} isOwner={isOwner} />
      </section>
    </main>
  );
}

export default ProductDetails;



