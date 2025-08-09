import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5005";

export const AuthContext = React.createContext(null);

function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  const storeToken = (token) => localStorage.setItem("authToken", token);
  const removeToken = () => localStorage.removeItem("authToken");

  const authenticateUser = async () => {
    const storedToken = localStorage.getItem("authToken");
    if (!storedToken) {
      setIsLoggedIn(false);
      setIsLoading(false);
      setUser(null);
      return;
    }
    try {
      const res = await axios.get(`${API_URL}/auth/verify`, {
        headers: { Authorization: `Bearer ${storedToken}` },
      });
      setIsLoggedIn(true);
      setUser(res.data);
    } catch (err) {
      console.error("Token verification failed:", err);
      setIsLoggedIn(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const loginUser = async ({ email, password }) => {
    try {
      const { data } = await axios.post(`${API_URL}/auth/login`, { email, password });
      // expect { authToken: "..." } from backend
      storeToken(data.authToken);
      await authenticateUser();
      return true;
    } catch (err) {
      console.error("Login failed:", err);
      return false;
    }
  };

  const logOutUser = () => {
    removeToken();
    authenticateUser();
  };

  useEffect(() => {
    authenticateUser();
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthProvider };