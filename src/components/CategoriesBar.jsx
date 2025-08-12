// src/components/CategoriesBar.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import api from "../data/api";

function CategoriesBar({
  heading = "Categories",
  linkToProducts = true,
  onSelect,
  selected,
  showAll = false,
  limit,
  perRow = 6,
  center = true,
  className = "",
}) {
  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const selectedFromUrl = selected ?? searchParams.get("category") ?? "";

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const { data } = await api.get("/products/categories");
        if (!ignore) setCats(Array.isArray(data) ? data : []);
      } catch {
        if (!ignore) setErr("Failed to load categories");
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => { ignore = true; };
  }, []);

  const list = limit ? cats.slice(0, limit) : cats;

  // chunk into rows (e.g., 12 -> 6 + 6)
  const rows = [];
  for (let i = 0; i < list.length; i += perRow) rows.push(list.slice(i, i + perRow));

  const goToProducts = (cat) => {
    const params = new URLSearchParams();
    if (cat) params.set("category", cat);
    navigate({ pathname: "/products", search: params.toString() });
  };

  // Navbar-like chips (outline light vs solid light when active)
  const ChipLink = ({ cat, active }) => (
    <Link
      to={cat ? `/products?category=${encodeURIComponent(cat)}` : "/products"}
      className={
        "btn rounded-pill px-3 py-2 fs-6 " +
        (active ? "btn-light text-dark" : "btn-outline-light")
      }
      aria-current={active ? "true" : undefined}
    >
      {cat || "All"}
    </Link>
  );

  const ChipButton = ({ cat, active }) => (
    <button
      type="button"
      onClick={() => (onSelect ? onSelect(cat) : goToProducts(cat))}
      className={
        "btn rounded-pill px-3 py-2 fs-6 " +
        (active ? "btn-light text-dark" : "btn-outline-light")
      }
      aria-pressed={active ? "true" : "false"}
    >
      {cat || "All"}
    </button>
  );

  const Row = ({ children }) => (
    <div className={"d-flex flex-wrap gap-2 mb-2 " + (center ? "justify-content-center" : "")}>
      {children}
    </div>
  );

  return (
    <section className={"bg-primary text-light rounded-3 p-3 p-md-4 shadow-sm " + className}>
      <h2 className="h3 mb-3">{heading}</h2>

      {loading ? (
        <div className="d-flex align-items-center gap-2">
          <div className="spinner-border spinner-border-sm" role="status" aria-label="Loading categories" />
          <span className="text-light opacity-75">Loading categories…</span>
        </div>
      ) : err ? (
        <div className="alert alert-light text-dark mb-0">{err}</div>
      ) : list.length === 0 ? (
        <div className="alert alert-light text-dark mb-0">No categories yet.</div>
      ) : (
        <>
          {showAll && (
            <Row>
              {linkToProducts && !onSelect ? (
                <ChipLink cat="" active={selectedFromUrl === ""} />
              ) : (
                <ChipButton cat="" active={selectedFromUrl === ""} />
              )}
            </Row>
          )}

          {rows.map((catsRow, idx) => (
            <Row key={idx}>
              {catsRow.map((cat) => {
                const active = selectedFromUrl === String(cat);
                return linkToProducts && !onSelect ? (
                  <ChipLink key={cat} cat={cat} active={active} />
                ) : (
                  <ChipButton key={cat} cat={cat} active={active} />
                );
              })}
            </Row>
          ))}
        </>
      )}
    </section>
  );
}

export default CategoriesBar;