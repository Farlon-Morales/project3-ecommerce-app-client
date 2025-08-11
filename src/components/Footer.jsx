// src/components/Footer.jsx
import React from "react";
import { Link } from "react-router-dom";
import "../App.css"; // You can style .footer in here

function Footer() {
  return (
    <footer className="footer">
      <p>&copy; {new Date().getFullYear()} Your Brand Name. All rights reserved.</p>
      <div className="footer-links">
        <Link to="/about">About</Link>
        <Link to="/products">Products</Link>
        <Link to="/contact">Contact</Link>
      </div>
    </footer>
  );
}

export default Footer;