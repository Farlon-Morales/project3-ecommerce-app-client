import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function ProtectedRoute({ children }) {
  const { isLoggedIn, isLoading } = useContext(AuthContext);
  const location = useLocation();

  if (isLoading) return null; // or a spinner

  if (!isLoggedIn) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}

export default ProtectedRoute;