import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:5005";
const AuthCtx = createContext();

export function AuthProvider({ children }) {
  const [user, setUser]     = useState(null);
  const [token, setToken]   = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) { 
      setLoading(false); 
      return; 
    }
    axios.get(`${API}/auth/verify`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(res => { 
      setUser(res.data); 
      setLoading(false); 
    })
    .catch(() => { 
      localStorage.removeItem("token"); 
      setToken(null); 
      setUser(null); 
      setLoading(false); 
    });
  }, [token]);

  const login = (jwt) => {
    localStorage.setItem("token", jwt);
    setToken(jwt);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthCtx.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthCtx.Provider>
  );
}
export const useAuth = () => useContext(AuthCtx);