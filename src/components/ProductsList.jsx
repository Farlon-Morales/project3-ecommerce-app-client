import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "./ProductCard";

function ProductsList() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5005/products")
      .then((response) => setProducts(response.data))
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  return (
    <div className="products-list">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
}

export default ProductsList;