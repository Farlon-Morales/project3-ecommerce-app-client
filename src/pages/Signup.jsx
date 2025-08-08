import { useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:5005";

export default function Signup() {
  const [form, setForm] = useState({ name:"", email:"", password:"" });
  const [msg, setMsg] = useState("");

  const onChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/auth/signup`, form);
      setMsg("Signed up! You can now log in.");
    } catch (err) {
      setMsg(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <h2>Sign up</h2>
      <input name="name" placeholder="Name" onChange={onChange} />
      <input name="email" placeholder="Email" onChange={onChange} />
      <input name="password" type="password" placeholder="Password" onChange={onChange} />
      <button type="submit">Create account</button>
      {msg && <p>{msg}</p>}
    </form>
  );
}