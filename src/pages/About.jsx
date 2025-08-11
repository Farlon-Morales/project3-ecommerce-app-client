// src/pages/About.jsx
import React from "react";
import { Link } from "react-router-dom";
import "../App.css";

// ℹ️ Static page: no API calls needed here
function About() {
  return (
    <div className="about">
      <section className="about-hero">
        <h1>About Us</h1>
        <p>
          We help small startups launch and grow their own makeup brands — fast,
          flexible, and built on strong values.
        </p>
        <Link to="/products">
          <button className="btn-primary">See all products</button>
        </Link>
      </section>

      <section className="about-mission">
        <h2>Our Mission</h2>
        <p>
          Make brand-building simple for founders. From first concept to your
          first sale, we provide ready-to-launch formulas, packaging options,
          and guidance designed specifically for early-stage teams.
        </p>
      </section>

      <section className="about-values">
        <h2>What we stand for</h2>
        <ul className="about-list">
          <li>
            <strong>Sustainable by design.</strong> We prioritize recycled or
            recyclable packaging, responsible sourcing, and low-waste ops.
          </li>
          <li>
            <strong>Cruelty-free.</strong> No animal testing — ever.
          </li>
          <li>
            <strong>Founder-friendly.</strong> Low MOQs, transparent pricing,
            and honest lead times for small startups.
          </li>
          <li>
            <strong>Quality-first.</strong> Safe, high-performing formulas you
            can proudly put your brand name on.
          </li>
        </ul>
      </section>

      <section className="about-offer">
        <h2>What we offer</h2>
        <ul className="about-list">
          <li>Private-label makeup with flexible batches</li>
          <li>Customizable shades and finishes</li>
          <li>Packaging choices aligned with sustainability goals</li>
          <li>Guidance on compliance, labeling, and launch</li>
        </ul>
      </section>

      <section className="about-cta">
        <h2>Ready to promote your brand?</h2>
        <div className="about-cta-actions">
          <Link to="/products">
            <button className="btn-secondary">Discover products</button>
          </Link>
          <Link to="/contact">
            <button className="btn-tertiary">Talk to us</button>
          </Link>
        </div>
      </section>
    </div>
  );
}

export default About;