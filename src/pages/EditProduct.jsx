// src/pages/EditProduct.jsx
import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../data/api";
import { AuthContext } from "../context/AuthContext.jsx";

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isLoading, isLoggedIn } = useContext(AuthContext);

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    imageUrl: "",
    category: "",
  });
  const [msg, setMsg] = useState("");
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const { data } = await api.get(`/products/${id}`);
        if (ignore) return;
        setForm({
          title: data.title || "",
          description: data.description || "",
          price: data.price ?? "",
          imageUrl: data.thumbnail || data.imageUrl || "",
          category: data.category?._id || data.category || "",
        });
      } catch (err) {
        if (!ignore) setMsg(err.response?.data?.message || "Failed to load product");
      } finally {
        if (!ignore) setLoadingProduct(false);
      }
    })();
    return () => { ignore = true; };
  }, [id]);

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg("");

    // simple client-side validation
    const priceNum = Number(form.price);
    if (!form.title.trim()) return setMsg("Title is required.");
    if (!Number.isFinite(priceNum) || priceNum <= 0)
      return setMsg("Price must be a positive number.");
    if (!form.category.trim()) return setMsg("Category is required.");
    if (form.imageUrl && !/^https?:\/\/\S+$/i.test(form.imageUrl.trim()))
      return setMsg("Image URL must start with http:// or https://");

    try {
      setSaving(true);
      const payload = { ...form, price: priceNum };
      await api.patch(`/products/${id}`, payload);
      navigate(`/products/${id}`);
    } catch (err) {
      setMsg(err.response?.data?.message || "Failed to update product");
    } finally {
      setSaving(false);
    }
  };

  // Not logged in gate
  if (!isLoading && !isLoggedIn) {
    return (
      <main className="container py-5">
        <div className="alert alert-warning mb-0">
          You must be logged in to edit products.
        </div>
      </main>
    );
  }

  // Loading state
  if (loadingProduct) {
    return (
      <main className="container py-5">
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status" aria-label="Loading product"></div>
        </div>
      </main>
    );
  }

  return (
    <main className="container py-4">
      <h1 className="mb-4">Edit Product</h1>

      {msg && <div className="alert alert-danger">{msg}</div>}

      <form onSubmit={onSubmit} className="card p-4 shadow-sm">
        <div className="mb-3">
          <label className="form-label">Title</label>
          <input
            name="title"
            className="form-control"
            placeholder="e.g., Hydrating Serum"
            value={form.title}
            onChange={onChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            name="description"
            className="form-control"
            placeholder="Update the product description"
            rows={4}
            value={form.description}
            onChange={onChange}
          />
        </div>

        <div className="row g-3">
          <div className="col-12 col-md-4">
            <label className="form-label">Price</label>
            <input
              name="price"
              type="number"
              step="0.01"
              min="0"
              className="form-control"
              placeholder="19.99"
              value={form.price}
              onChange={onChange}
              required
            />
          </div>

          <div className="col-12 col-md-8">
            <label className="form-label">Image URL</label>
            <input
              name="imageUrl"
              className="form-control"
              placeholder="https://example.com/image.jpg"
              value={form.imageUrl}
              onChange={onChange}
            />
          </div>
        </div>

        <div className="mt-3 mb-4">
          <label className="form-label">Category</label>
          <input
            name="category"
            className="form-control"
            placeholder="serum, cream, toner…"
            value={form.category}
            onChange={onChange}
            required
          />
          {/* Swap to <select className="form-select"> if you add predefined categories */}
        </div>

        <div className="d-flex gap-2">
          <button type="submit" className="btn btn-primary" disabled={saving || isLoading}>
            {saving ? "Saving…" : "Save changes"}
          </button>
          <Link to={`/products/${id}`} className="btn btn-outline-secondary">
            Cancel
          </Link>
        </div>
      </form>
    </main>
  );
}

export default EditProduct;