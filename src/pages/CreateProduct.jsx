import { useState } from "react";
import api from "../api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function CreateProduct() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "", description: "", price: "", imageUrl: "", category: ""
  });
  const [msg, setMsg] = useState("");

  if (!loading && !user) return <p>You must be logged in to create products.</p>;

  const onChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      // backend maps imageUrl => thumbnail for v1
      const payload = { ...form, price: Number(form.price) };
      const { data } = await api.post("/products", payload);
      setMsg("Created!");
      navigate("/"); // back to list
    } catch (err) {
      setMsg(err.response?.data?.message || "Failed to create product");
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <h2>Create Product</h2>
      <input name="title" placeholder="Title" onChange={onChange} />
      <textarea name="description" placeholder="Description" onChange={onChange} />
      <input name="price" type="number" step="0.01" placeholder="Price" onChange={onChange} />
      <input name="imageUrl" placeholder="Image URL" onChange={onChange} />
      <input name="category" placeholder="Category (serum, cream, toner...)" onChange={onChange} />
      <button type="submit">Save</button>
      {msg && <p>{msg}</p>}
    </form>
  );
}