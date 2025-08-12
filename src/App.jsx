// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import CreateProduct from "./pages/CreateProduct";
import EditProduct from "./pages/EditProduct";
import ProductsList from "./pages/ProductList";
import ProductDetails from "./pages/ProductDetails";
import About from "./pages/About";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import PublicOnlyRoute from "./routes/PublicOnlyRoute";
import ProtectedRoute from "./routes/ProtectedRoute";

// ❌ Comment this out for now if it contains width limits on body/nav/footer
// import "./App.css";

function App() {
  return (
    // Full-viewport app shell; ensures footer sits at the bottom
    <div className="d-flex flex-column min-vh-100 w-100">
      {/* Full-width navbar (it has its own container inside) */}
      <Navbar />

      {/* Page content area. Use container or container-fluid as you prefer */}
      <main className="flex-grow-1">
        <div className="container py-4">
          <Routes>
            {/* Public pages */}
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<ProductsList />} />
            <Route path="/products/:id" element={<ProductDetails />} />
            <Route path="/about" element={<About />} />

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

            {/* Private pages */}
            <Route
              path="/create-product"
              element={
                <ProtectedRoute>
                  <CreateProduct />
                </ProtectedRoute>
              }
            />
            <Route
              path="/products/:id/edit"
              element={
                <ProtectedRoute>
                  <EditProduct />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </main>

      {/* Full-width footer (has container-fluid inside) */}
      <Footer />
    </div>
  );
}

export default App;