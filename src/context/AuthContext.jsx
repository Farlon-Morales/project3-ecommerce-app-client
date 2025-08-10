// ℹ️ React state & effects
import React, { useState, useEffect } from "react";
// ℹ️ HTTP client
import axios from "axios";

// ℹ️ Base URL for your API (Vite env first, then fallback)
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5005";

// ℹ️ Optionally set axios defaults once (nice DX, not required)
axios.defaults.baseURL = API_URL;
// axios.defaults.withCredentials = true; // <— only if you ever switch to cookie-based auth

// ℹ️ Global Auth context
export const AuthContext = React.createContext(null);

function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading]   = useState(true);
  const [user, setUser]             = useState(null);

  // ℹ️ Helpers to persist/remove the token
  const storeToken  = (token) => localStorage.setItem("authToken", token);
  const removeToken = () => localStorage.removeItem("authToken");

  // ℹ️ Verify the stored token with the API and refresh auth state
  const authenticateUser = async () => {
    const storedToken = localStorage.getItem("authToken");
    // 👇 quick sanity log while wiring things up (remove later if you want)
    // console.log("storedToken ->", storedToken);

    if (!storedToken) {
      setIsLoggedIn(false);
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const res = await axios.get(`/auth/verify`, {
        headers: { Authorization: `Bearer ${storedToken}` }, // Bearer <token>
      });
      setIsLoggedIn(true);
      setUser(res.data);
    } catch (err) {
      console.error("Token verification failed:", err);
      // 🔑 If token is invalid/expired, drop it so we don't keep failing
      removeToken();
      setIsLoggedIn(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  // ℹ️ Login → save token → verify → update state
  const loginUser = async ({ email, password }) => {
    try {
      const { data } = await axios.post(`/auth/login`, { email, password });
      // expect { authToken: "..." } from backend
      if (data?.authToken) storeToken(data.authToken);
      await authenticateUser();
      return true;
    } catch (err) {
      console.error("Login failed:", err);
      return false;
    }
  };

  // ℹ️ Signup → (optionally) auto-login if backend returns a token
  const signupUser = async ({ name, email, password }) => {
    try {
      const { data } = await axios.post(`/auth/signup`, { name, email, password });

      // A) If API returns a token at signup
      if (data?.authToken) {
        storeToken(data.authToken);
        await authenticateUser(); // auto-login after signup
      }

      // B) If it doesn't, just resolve true and let the UI redirect to /login
      return true;
    } catch (err) {
      console.error("Signup failed:", err);
      // ℹ️ Optionally surface backend message to the UI
      throw new Error(err?.response?.data?.message || "Signup failed");
    }
  };

  // ℹ️ Logout → remove token → refresh auth state
  const logOutUser = () => {
    removeToken();
    authenticateUser();
  };

  // ℹ️ Run once on mount to hydrate auth state from localStorage
  useEffect(() => {
    authenticateUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        isLoading,
        user,
        storeToken,
        authenticateUser,
        logOutUser,
        loginUser,
        signupUser, // ✅ exposed to consumers
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthProvider };