import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function PublicOnlyRoute({ children }) {
  const { isLoggedIn, isLoading } = useContext(AuthContext);
  if (isLoading) return null; // or a spinner
  return isLoggedIn ? <Navigate to="/" replace /> : children;
}

export default PublicOnlyRoute;