// src/pages/Home.jsx
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import CategoriesBar from "../components/CategoriesBar";
import { AuthContext } from "../context/AuthContext.jsx";

const HERO_IMAGE =
  "https://static.vecteezy.com/system/resources/thumbnails/015/184/087/small/group-of-white-and-blank-unbranded-cosmetic-cream-jars-and-tubes-on-blue-background-skin-care-product-presentation-elegant-mockup-skincare-beauty-and-spa-banner-with-copy-space-3d-rendering-photo.jpg";
// ↑ Replace with a more general photo when you have one.

function Home() {
  const { isLoggedIn } = useContext(AuthContext);

  return (
    <main className="w-100">
      {/* Full-bleed hero */}
      <section className="container-fluid px-0">
        <div className="position-relative">
          <img
            src={HERO_IMAGE}
            alt="Founders marketplace hero"
            className="w-100"
            style={{ height: 420, objectFit: "cover" }}
          />
          <div
            className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center"
            style={{ background: "rgba(0,0,0,0.35)" }}
          >
            <div className="container text-light">
              <h1 className="display-5 fw-bold mb-2">
                NovaGoods - The marketplace for startup products
              </h1>
              <p className="lead mb-4">
                Discover what makers are building next — or list your own and meet your first customers.
              </p>
              <div className="d-flex flex-wrap gap-2">
                <Link to="/products" className="btn btn-light btn-lg">
                  Browse products
                </Link>
                {/* ⬇️ Keep this visible for everyone */}
                <Link to="/create-product" className="btn btn-outline-light btn-lg">
                  Start selling
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories from API (via component) */}
      <section className="container py-5">
        <CategoriesBar heading="Categories" perRow={6} center limit={12} />
      </section>

      {/* About preview */}
      <section className="container pb-5">
        <div className="bg-dark text-light rounded p-4 p-md-5">
          <h2 className="h3 mb-3">Built for founders</h2>
          <p className="mb-4">
            We’re a founder-first marketplace where early products—from hardware
            and home goods to beauty, fashion, and digital tools—can launch fast.
            Fair fees, transparent policies, and a trusted checkout help you turn
            first customers into fans.
          </p>
          <div className="d-flex flex-wrap gap-2">
            <Link to="/about" className="btn btn-outline-light">
              Learn more
            </Link>
            {/* ⬇️ Hide this when logged in */}
            {!isLoggedIn && (
              <Link to="/create-product" className="btn btn-primary">
                List your product
              </Link>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;