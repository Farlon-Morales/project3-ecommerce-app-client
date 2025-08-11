import React, { useEffect, useState, useContext } from "react";
import api from "../data/api";
import { AuthContext } from "../context/AuthContext.jsx";
import { useParams, useNavigate } from "react-router-dom";

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isLoading, isLoggedIn } = useContext(AuthContext);

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    imageUrl: "",
    category: "",
  });
  const [msg, setMsg] = useState("");
  const [loadingProduct, setLoadingProduct] = useState(true);

  if (!isLoading && !isLoggedIn) return <p>You must be logged in to edit products.</p>;

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
        setMsg(err.response?.data?.message || "Failed to load product");
      } finally {
        if (!ignore) setLoadingProduct(false);
      }
    })();
    return () => { ignore = true; };
  }, [id]);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      const payload = { ...form, price: Number(form.price) };
      await api.patch(`/products/${id}`, payload);
      navigate(`/products/${id}`);
    } catch (err) {
      setMsg(err.response?.data?.message || "Failed to update product");
    }
  };

  if (loadingProduct) return <p>Loading product…</p>;

  return (
    <form onSubmit={onSubmit}>
      <h2>Edit Product</h2>
      <input
        name="title"
        placeholder="Title"
        value={form.title}
        onChange={onChange}
        required
      />
      <textarea
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={onChange}
      />
      <input
        name="price"
        type="number"
        step="0.01"
        placeholder="Price"
        value={form.price}
        onChange={onChange}
        required
      />
      <input
        name="imageUrl"
        placeholder="Image URL"
        value={form.imageUrl}
        onChange={onChange}
      />
      <input
        name="category"
        placeholder="Category (serum, cream, toner...)"
        value={form.category}
        onChange={onChange}
        required
      />
      <button type="submit" disabled={isLoading}>Save changes</button>
      {msg && <p>{msg}</p>}
    </form>
  );
}

export default EditProduct;