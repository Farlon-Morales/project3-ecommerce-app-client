import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import axios from "axios";
import ProductCard from "../components/ProductCard";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5005";

function ProductsList() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [category, setCategory]   = useState(searchParams.get("category") || "");
  const [q, setQ]                 = useState(searchParams.get("q") || "");
  const [minPrice, setMinPrice]   = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice]   = useState(searchParams.get("maxPrice") || "");
  const [sort, setSort]           = useState(searchParams.get("sort") || "newest");

  const [products, setProducts]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState("");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const { data } = await axios.get(`${API_URL}/products/categories`);
        if (!ignore) setCategories(data);
      } catch {}
    })();
    return () => { ignore = true; };
  }, []);

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
    <main className="solarized">
      {/* Top bar */}
      <section className="py-3 strip border-top border-bottom">
        <div className="container d-flex align-items-center justify-content-between">
          <h1 className="mb-0">Products</h1>
          <Link to="/create-product" className="btn btn-primary d-none d-sm-inline">
            Create product
          </Link>
        </div>
      </section>

      {/* Sidebar Filters + Products Grid */}
      <section className="py-4">
        <div className="container">
          <div className="row g-4">
            {/* Sidebar Filters */}
            <div className="col-12 col-md-3">
              <form onSubmit={applyFilters} className="card p-3 filter-card">
                <div className="mb-3">
                  <label className="form-label">Search</label>
                  <input
                    className="form-control"
                    placeholder="Name or description…"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                  />
                </div>

                <div className="mb-3">
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

                <div className="mb-3">
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

                <div className="mb-3">
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

                <div className="mb-3">
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

                <div className="d-flex gap-2">
                  <button className="btn btn-primary w-100" type="submit">Apply</button>
                  <button className="btn btn-outline-secondary w-100" type="button" onClick={clearFilters}>
                    Clear
                  </button>
                </div>
              </form>
            </div>

            {/* Products */}
            <div className="col-12 col-md-9">
              {loading ? (
                <div className="d-flex justify-content-center py-5">
                  <div className="spinner-border" role="status" aria-label="Loading products"></div>
                </div>
              ) : error ? (
                <div className="alert alert-danger">{error}</div>
              ) : products.length === 0 ? (
                <div className="alert alert-info">No products match your filters.</div>
              ) : (
                <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 g-4 align-items-stretch">
                  {products.map((product) => (
                    <div className="col d-flex" key={product._id}>
                      <ProductCard
                        product={product}
                        onDeleted={handleDeleted}
                        className="card h-100 small-card flex-fill"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default ProductsList;