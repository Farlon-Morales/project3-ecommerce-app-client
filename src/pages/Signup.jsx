// src/pages/Signup.jsx
import React, { useState, useContext } from "react";
import { useNavigate, Navigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Signup() {
  const { signupUser, isLoggedIn, isLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");

  if (!isLoading && isLoggedIn) return <Navigate to="/" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // optional quick check
    if (!name.trim()) return setError("Name is required.");

    try {
      await signupUser({ name, email, password });
      navigate("/login"); // or navigate("/") if you auto-login on signup
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Something went wrong");
    }
  };

  return (
    <main className="container py-5" style={{ maxWidth: 560 }}>
      <h1 className="mb-4">Sign up</h1>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit} className="card p-4 shadow-sm">
        <div className="mb-3">
          <label className="form-label" htmlFor="name">Name</label>
          <input
            id="name"
            className="form-control"
            type="text"
            value={name}
            onChange={(e)=>setName(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>

        <div className="mb-3">
          <label className="form-label" htmlFor="email">Email</label>
          <input
            id="email"
            className="form-control"
            type="email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            required
            autoComplete="username"
            disabled={isLoading}
          />
        </div>

        <div className="mb-4">
          <label className="form-label" htmlFor="password">Password</label>
          <input
            id="password"
            className="form-control"
            type="password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            required
            autoComplete="new-password"
            disabled={isLoading}
          />
        </div>

        <button type="submit" className="btn btn-primary w-100" disabled={isLoading}>
          {isLoading ? "Creating account…" : "Create account"}
        </button>
      </form>

      <p className="mt-3 text-muted">
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </main>
  );
}

export default Signup;