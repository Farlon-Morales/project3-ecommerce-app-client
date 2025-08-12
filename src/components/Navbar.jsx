// src/components/Navbar.jsx
import { Link, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function Navbar() {
  const { isLoggedIn, user, logOutUser } = useContext(AuthContext);
  const { pathname } = useLocation();

  // Normalize (remove trailing slash)
  const cleanPath = pathname.replace(/\/+$/, "");

  // Page checks
  const onProductsListPage = cleanPath === "/products";
  const onCreateProductPage = cleanPath === "/create-product";
  const onAboutPage = cleanPath === "/about"; // 👈 check for About page

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary w-100 sticky-top">
      <div className="container">
        <Link className="navbar-brand" to="/">Home</Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNav"
          aria-controls="mainNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div id="mainNav" className="collapse navbar-collapse">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {/* Hide Products link when already on the products list page */}
            {!onProductsListPage && (
              <li className="nav-item">
                <Link className="nav-link" to="/products">Products</Link>
              </li>
            )}

            {/* Hide About link when already on the About page */}
            {!onAboutPage && (
              <li className="nav-item">
                <Link className="nav-link" to="/about">About</Link>
              </li>
            )}

            {/* Hide Create Product link on both the create page and the products list page */}
            {isLoggedIn && !onCreateProductPage && !onProductsListPage && (
              <li className="nav-item">
                <Link className="nav-link" to="/create-product">Create Product</Link>
              </li>
            )}
          </ul>

          <div className="d-flex align-items-center gap-2">
            {isLoggedIn ? (
              <>
                <span className="navbar-text">{user?.name}</span>
                <button
                  className="btn btn-outline-light btn-sm"
                  onClick={logOutUser}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link className="btn btn-outline-light btn-sm" to="/signup">Sign Up</Link>
                <Link className="btn btn-light btn-sm" to="/login">Login</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;