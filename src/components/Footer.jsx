// src/components/Footer.jsx
import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-dark text-muted border-top mt-auto w-100">
      {/* container-fluid => content padding without max-width limit */}
      <div className="container-fluid py-4">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-2">
          <small className="mb-0">
            &copy; {new Date().getFullYear()} Your Brand Name. All rights reserved.
          </small>
          <nav className="d-flex gap-3">
            <Link className="link-light text-decoration-none" to="/about">About</Link>
            <Link className="link-light text-decoration-none" to="/products">Products</Link>
            <Link className="link-light text-decoration-none" to="/contact">Contact</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}

export default Footer;