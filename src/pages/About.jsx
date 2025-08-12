// src/pages/About.jsx
import React from "react";
import { Link } from "react-router-dom";

function About() {
  return (
    <main className="w-100">
      {/* Full-bleed hero to match navbar/footer */}
      <section className="container-fluid bg-primary text-light py-5 mb-4">
        <div className="container">
          <h1 className="display-5 fw-bold mb-3">About Our Marketplace</h1>
          <p className="lead mb-4">
            We’re an e-shop built for founders. List, launch, and grow your
            startup products—without the heavy lift of building an online store
            from scratch.
          </p>
          <div className="d-flex flex-wrap gap-2">
            <Link to="/products" className="btn btn-light btn-lg">Browse Products</Link>
            <Link to="/create-product" className="btn btn-outline-light btn-lg">Start Selling</Link>
          </div>
        </div>
      </section>

      {/* Readable-width content */}
      <section className="container">
        <div className="row g-4">
          {/* Purpose / Intention */}
          <div className="col-12">
            <h2 className="h3">Our Intention</h2>
            <p className="mb-0">
              Give early-stage makers a simple, credible place to validate ideas,
              find first customers, and scale. Whether you’re shipping your first
              batch or your first thousand, we focus on the essentials so you can
              focus on your product.
            </p>
          </div>

          {/* Mission */}
          <div className="col-12">
            <h2 className="h3">Our Mission</h2>
            <p className="mb-0">
              Lower the barrier to entrepreneurship by offering a fair, transparent,
              and supportive marketplace for startup products. We connect founders
              with customers who love to discover what’s new.
            </p>
          </div>

          {/* What we offer */}
          <div className="col-12 col-lg-6">
            <h2 className="h3">What We Offer</h2>
            <ul className="list-unstyled mb-0">
              <li className="mb-2"><strong>Instant storefront:</strong> List products in minutes with clean, trustworthy product pages.</li>
              <li className="mb-2"><strong>Built-in discovery:</strong> Categories, search, and reviews help customers find you.</li>
              <li className="mb-2"><strong>Fair fees:</strong> Simple, founder-friendly pricing with no lock-in.</li>
              <li className="mb-2"><strong>Tools that matter:</strong> Inventory basics, order tracking, and lightweight analytics.</li>
              <li className="mb-2"><strong>Secure checkout:</strong> Modern payments and fraud prevention.</li>
              <li className="mb-2"><strong>Launch support:</strong> Guides and templates for packaging, compliance, and go-to-market.</li>
            </ul>
          </div>

          {/* Values */}
          <div className="col-12 col-lg-6">
            <h2 className="h3">Our Values</h2>
            <ul className="list-unstyled mb-0">
              <li className="mb-2"><strong>Founder-first:</strong> We design for momentum and respect your time and margins.</li>
              <li className="mb-2"><strong>Transparency:</strong> Clear policies, clear fees, and clear communication.</li>
              <li className="mb-2"><strong>Quality & safety:</strong> We prioritize accurate listings and a safe buying experience.</li>
              <li className="mb-2"><strong>Sustainability:</strong> We encourage responsible sourcing and low-waste operations.</li>
              <li className="mb-2"><strong>Inclusivity:</strong> A welcoming space for makers from all backgrounds and stages.</li>
              <li className="mb-2"><strong>Community:</strong> Learning, feedback, and shared wins—together.</li>
            </ul>
          </div>

          {/* How it works */}
          <div className="col-12">
            <h2 className="h3">How It Works</h2>
            <ol className="mb-0">
              <li className="mb-2"><strong>Create an account</strong> and set up your seller profile.</li>
              <li className="mb-2"><strong>List your product</strong> with photos, pricing, and fulfillment details.</li>
              <li className="mb-2"><strong>Go live</strong>—share your page, collect orders, and gather reviews.</li>
              <li className="mb-2"><strong>Iterate and grow</strong> with insights and support from our team and community.</li>
            </ol>
          </div>

          {/* CTA */}
          <div className="col-12">
            <div className="bg-dark text-light rounded p-4 p-md-5 my-2">
              <h2 className="h4 mb-3">Ready to launch your product?</h2>
              <p className="mb-4">
                Join a marketplace built for startups. Get visibility, learn fast,
                and turn your first customers into your next fans.
              </p>
              <div className="d-flex flex-wrap gap-2">
                <Link to="/create-product" className="btn btn-primary">Start Selling</Link>
                <Link to="/products" className="btn btn-outline-light">Explore the marketplace</Link>
                <Link to="/contact" className="btn btn-outline-light">Talk to us</Link>
              </div>
            </div>
          </div>

          {/* Policy note (optional) */}
          <div className="col-12">
            <small className="text-muted d-block">
              Note: By listing products, sellers agree to our quality, safety, and community guidelines.
            </small>
          </div>
        </div>
      </section>
    </main>
  );
}

export default About;