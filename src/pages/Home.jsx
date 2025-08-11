// src/pages/Home.jsx
import React from "react";
import { Link } from "react-router-dom";
import "../App.css";

// ℹ️ Base URL for your API (in case you use it later)
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5005";
const HERO_IMAGE =
  "https://static.vecteezy.com/system/resources/thumbnails/015/184/087/small/group-of-white-and-blank-unbranded-cosmetic-cream-jars-and-tubes-on-blue-background-skin-care-product-presentation-elegant-mockup-skincare-beauty-and-spa-banner-with-copy-space-3d-rendering-photo.jpg";

function Home() {
  const categories = ["Serum", "Cream", "Toner", "Cleanser", "Mask"];

  return (
    <div className="home">

      {/* Hero */}
      <section className="hero">
        <img src={HERO_IMAGE} alt="Hero" className="hero-image" />
        <div className="hero-content">
          <h1>Discover skincare you’ll love</h1>
          <p>Hand-picked products for every routine.</p>
          <Link to="/products">
            <button className="btn-primary">See all products</button>
          </Link>
        </div>
      </section>

      {/* Categories */}
      <section className="categories">
        <h2>Categories</h2>
        <div className="categories-list">
          {categories.map((cat) => (
            <Link
              key={cat}
              to={`/products?category=${encodeURIComponent(cat)}`}
              className="category-chip"
            >
              {cat}
            </Link>
          ))}
        </div>
      </section>

      {/* About us */}
      <section className="about-preview">
        <h2>About us</h2>
        <p>
          We’re on a mission to make skincare simple, effective, sustainable,
          and cruelty-free. Learn more about our story and values.
        </p>
        <Link to="/about">
          <button className="btn-secondary">Discover more</button>
        </Link>
      </section>

    </div>
  );
}

export default Home;