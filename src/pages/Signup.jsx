import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Navigate } from "react-router-dom";

function Signup() {
  const { signupUser, isLoggedIn, isLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (!isLoading && isLoggedIn) return <Navigate to="/" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signupUser({ name, email, password });
      navigate("/login"); // or navigate("/") if you auto-login on signup
    } catch (err) {
      setError(err.message || "Something went wrong");
    }
  };

  return (
    <div className="signup-page">
      <h1>Sign Up</h1>
      {error && <p style={{ color: "crimson" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>Name:</label>
        <input type="text" value={name} onChange={(e)=>setName(e.target.value)} required />

        <label>Email:</label>
        <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required />

        <label>Password:</label>
        <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required />

        <button type="submit">Create Account</button>
      </form>
    </div>
  );
}

export default Signup;