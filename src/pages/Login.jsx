import React, { useState, useContext } from "react";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
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
    <div className="login-page">
      <h1>Login</h1>
      {error && <p style={{ color: "crimson" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="username"
        />

        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
        />

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Loading..." : "Log In"}
        </button>
      </form>
    </div>
  );
}

export default Login;