// src/pages/CreateProduct.jsx
import React, { useState, useContext, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../data/api";
import { AuthContext } from "../context/AuthContext.jsx";

function CreateProduct() {
  const { isLoading, isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    imageUrl: "",
    category: "",
  });

  const [msg, setMsg] = useState("");
  const [saving, setSaving] = useState(false);

  // categories for the dropdown
  const [categories, setCategories] = useState([]);
  const [catsLoading, setCatsLoading] = useState(true);
  const [showNewCat, setShowNewCat] = useState(false);
  const [newCategory, setNewCategory] = useState("");

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const { data } = await api.get("/products/categories");
        if (!ignore) setCategories(Array.isArray(data) ? data : []);
      } catch {
        // ignore; user can still type a custom category
      } finally {
        if (!ignore) setCatsLoading(false);
      }
    })();
    return () => { ignore = true; };
  }, []);

  const onChange = (e) => {
    const { name, value } = e.target;
    // handle select switch to "new"
    if (name === "category") {
      if (value === "__new__") {
        setShowNewCat(true);
        setForm((f) => ({ ...f, category: "" }));
      } else {
        setShowNewCat(false);
        setForm((f) => ({ ...f, category: value }));
      }
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg("");

    const priceNum = Number(form.price);
    const finalCategory = showNewCat ? newCategory.trim() : form.category.trim();

    if (!form.title.trim()) return setMsg("Title is required.");
    if (!Number.isFinite(priceNum) || priceNum <= 0)
      return setMsg("Price must be a positive number.");
    if (!finalCategory) return setMsg("Category is required.");
    if (form.imageUrl && !/^https?:\/\/\S+$/i.test(form.imageUrl.trim()))
      return setMsg("Image URL must start with http:// or https://");

    try {
      setSaving(true);
      const payload = {
        title: form.title.trim(),
        description: form.description,
        price: priceNum,
        imageUrl: form.imageUrl?.trim() || undefined,
        category: finalCategory,
      };
      await api.post("/products", payload);
      navigate("/products");
    } catch (err) {
      setMsg(err.response?.data?.message || "Failed to create product");
    } finally {
      setSaving(false);
    }
  };

  // gate when not logged in
  if (!isLoading && !isLoggedIn) {
    return (
      <main className="container py-5">
        <div className="alert alert-warning mb-0">
          You must be logged in to create products.
        </div>
      </main>
    );
  }

  return (
    <main className="container py-4">
      <h1 className="mb-4">Create Product</h1>

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
            placeholder="Short product description"
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

          {/* If categories are loading or empty, still allow custom */}
          {catsLoading || categories.length === 0 ? (
            <input
              name="category"
              className="form-control"
              placeholder="serum, cream, toner…"
              value={showNewCat ? newCategory : form.category}
              onChange={(e) =>
                showNewCat
                  ? setNewCategory(e.target.value)
                  : onChange({ target: { name: "category", value: e.target.value } })
              }
              required
            />
          ) : (
            <>
              <select
                name="category"
                className="form-select"
                value={showNewCat ? "__new__" : form.category}
                onChange={onChange}
                required
              >
                <option value="">Choose a category…</option>
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
                <option value="__new__">— Add new category…</option>
              </select>

              {showNewCat && (
                <input
                  className="form-control mt-2"
                  placeholder="Type a new category"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  required
                />
              )}
            </>
          )}
        </div>

        <div className="d-flex gap-2">
          <button type="submit" className="btn btn-primary" disabled={saving || isLoading}>
            {saving ? "Saving…" : "Save"}
          </button>
          <Link to="/products" className="btn btn-outline-secondary">
            Cancel
          </Link>
        </div>
      </form>
    </main>
  );
}

export default CreateProduct;