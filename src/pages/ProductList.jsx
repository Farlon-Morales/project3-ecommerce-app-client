// src/pages/ProductsList.jsx
import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import axios from "axios";
import ProductCard from "../components/ProductCard";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5005";

function ProductsList() {
  const [searchParams, setSearchParams] = useSearchParams();

  // read defaults from the URL (so /products?category=Serum works)
  const [category, setCategory]   = useState(searchParams.get("category") || "");
  const [q, setQ]                 = useState(searchParams.get("q") || "");
  const [minPrice, setMinPrice]   = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice]   = useState(searchParams.get("maxPrice") || "");
  const [sort, setSort]           = useState(searchParams.get("sort") || "newest");

  const [products, setProducts]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState("");
  const [categories, setCategories] = useState([]);

  // (Optional) load categories from API; or keep a static list if you prefer
  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const { data } = await axios.get(`${API_URL}/products/categories`);
        if (!ignore) setCategories(data);
      } catch {
        // fall back silently
      }
    })();
    return () => { ignore = true; };
  }, []);

  // fetch products whenever search params change
  useEffect(() => {
    let ignore = false;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const { data } = await axios.get(`${API_URL}/products`, {
          params: {
            category: searchParams.get("category") || undefined,
            q: searchParams.get("q") || undefined,
            minPrice: searchParams.get("minPrice") || undefined,
            maxPrice: searchParams.get("maxPrice") || undefined,
            sort: searchParams.get("sort") || "newest",
          },
        });
        if (!ignore) setProducts(data);
      } catch (e) {
        if (!ignore) setError("Failed to load products");
        console.error(e);
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => { ignore = true; };
  }, [searchParams]);

  const applyFilters = (e) => {
    e?.preventDefault?.();
    const next = {};
    if (category) next.category = category;
    if (q) next.q = q;
    if (minPrice) next.minPrice = minPrice;
    if (maxPrice) next.maxPrice = maxPrice;
    if (sort && sort !== "newest") next.sort = sort;
    setSearchParams(next, { replace: true });
  };

  const clearFilters = () => {
    setCategory("");
    setQ("");
    setMinPrice("");
    setMaxPrice("");
    setSort("newest");
    setSearchParams({}, { replace: true });
  };

  const handleDeleted = (id) => {
    setProducts((prev) => prev.filter((p) => p._id !== id));
  };

  return (
    <main className="container-fluid py-4">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h1 className="mb-0">Products</h1>
        <Link to="/create-product" className="btn btn-primary d-none d-sm-inline">Start Selling</Link>
      </div>

      {/* Filters */}
      <form onSubmit={applyFilters} className="card p-3 mb-4">
        <div className="row g-3">
          <div className="col-12 col-sm-6 col-lg-3">
            <label className="form-label">Search</label>
            <input
              className="form-control"
              placeholder="Name or description…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>

          <div className="col-12 col-sm-6 col-lg-3">
            <label className="form-label">Category</label>
            <select
              className="form-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">All</option>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="col-6 col-lg-2">
            <label className="form-label">Min price</label>
            <input
              className="form-control"
              type="number"
              min="0"
              step="0.01"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />
          </div>

          <div className="col-6 col-lg-2">
            <label className="form-label">Max price</label>
            <input
              className="form-control"
              type="number"
              min="0"
              step="0.01"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </div>

          <div className="col-12 col-lg-2">
            <label className="form-label">Sort</label>
            <select
              className="form-select"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="newest">Newest</option>
              <option value="price-asc">Price: Low → High</option>
              <option value="price-desc">Price: High → Low</option>
            </select>
          </div>
        </div>

        <div className="d-flex gap-2 mt-3">
          <button className="btn btn-primary" type="submit">Apply</button>
          <button className="btn btn-outline-secondary" type="button" onClick={clearFilters}>
            Clear
          </button>
        </div>
      </form>

      {/* Results */}
      {loading ? (
        <div className="d-flex justify-content-center py-5">
          <div className="spinner-border" role="status" aria-label="Loading products"></div>
        </div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : products.length === 0 ? (
        <div className="alert alert-info">No products match your filters.</div>
      ) : (
        <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 g-4">
          {products.map((product) => (
            <div className="col" key={product._id}>
              <ProductCard product={product} onDeleted={handleDeleted} />
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

export default ProductsList;