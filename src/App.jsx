import React from "react";
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import CreateProduct from "./pages/CreateProduct";
import ProductsList from "./pages/ProductList";
import ProductDetails from "./pages/ProductDetails";

import Navbar from "./components/Navbar";
import PublicOnlyRoute from "./routes/PublicOnlyRoute";
import ProtectedRoute from "./routes/ProtectedRoute";

import "./App.css";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* Public pages */}
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<ProductsList />} />
        <Route path="/products/:id" element={<ProductDetails />} />

        {/* Public-only pages (hidden if logged in) */}
        <Route
          path="/login"
          element={
            <PublicOnlyRoute>
              <Login />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicOnlyRoute>
              <Signup />
            </PublicOnlyRoute>
          }
        />

        {/* Private page example */}
        <Route
          path="/create-product"
          element={
            <ProtectedRoute>
              <CreateProduct />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;