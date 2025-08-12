// src/pages/Login.jsx
import React, { useState, useContext } from "react";
import { useNavigate, useLocation, Navigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Login() {
  const { loginUser, isLoggedIn, isLoading } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (!isLoading && isLoggedIn) return <Navigate to={from} replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const ok = await loginUser({ email, password });
    if (ok) {
      setEmail("");
      setPassword("");
      navigate(from, { replace: true });
    } else {
      setError("Invalid email or password.");
    }
  };

  return (
    <main className="container py-5" style={{ maxWidth: 520 }}>
      <h1 className="mb-4">Log in</h1>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit} className="card p-4 shadow-sm">
        <div className="mb-3">
          <label className="form-label" htmlFor="email">Email</label>
          <input
            id="email"
            className="form-control"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            disabled={isLoading}
          />
        </div>

        <button type="submit" className="btn btn-primary w-100" disabled={isLoading}>
          {isLoading ? "Loading..." : "Log In"}
        </button>
      </form>

      <p className="mt-3 text-muted">
        Don’t have an account? <Link to="/signup">Sign up</Link>
      </p>
    </main>
  );
}

export default Login;