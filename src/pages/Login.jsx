import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function Login() {
  const { loginUser } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await loginUser({ email, password });
  };

  return (
    <div className="login-page">
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <label>Email:</label>
        <input type="email" value={email}
          onChange={(e) => setEmail(e.target.value)} required />
        <label>Password:</label>
        <input type="password" value={password}
          onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Log In</button>
      </form>
    </div>
  );
}

export default Login;