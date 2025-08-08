import axios from "axios";

// Create an Axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5005", // you can put this in .env
  withCredentials: true, // if your backend uses cookies for auth
});

// Add token automatically to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken"); // or from context if you prefer
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;