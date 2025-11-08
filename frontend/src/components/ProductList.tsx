// src/components/ProductList.tsx
import { useEffect, useState } from "react";
import "./ProductList.css";
import { useSearch } from "../context/SearchContext";
import { Link } from "react-router-dom";

interface Product {
  _id: string;
  name: string;
  price: number;
  image: string;
  category?: string;
}

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<string>("Relevant");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const { searchTerm } = useSearch();

  // ✅ Type-safe environment variable with fallback
  const BACKEND_URL: string = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${BACKEND_URL}/api/products`);
        if (!res.ok) throw new Error(`Failed to fetch products: ${res.status}`);
        const data: Product[] = await res.json();

        setProducts(data);
        setFilteredProducts(data);

        // Extract unique categories
        const uniqueCategories: string[] = Array.from(
          new Set(data.map((item) => item.category).filter(Boolean))
        ) as string[];
        setCategories(uniqueCategories);
      } catch (err: any) {
        setError(err.message || "Unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [BACKEND_URL]);

  // Filter, search, and sort
  useEffect(() => {
    let filtered = [...products];

    if (selectedCategory && selectedCategory !== "All") {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    if (searchTerm.trim()) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (sortOption === "Low to High") filtered.sort((a, b) => a.price - b.price);
    else if (sortOption === "High to Low") filtered.sort((a, b) => b.price - a.price);

    setFilteredProducts(filtered);
  }, [searchTerm, selectedCategory, sortOption, products]);

  // Skeleton loader component
  const SkeletonCard = () => (
    <div className="skeleton-card">
      <div className="skeleton-image" />
      <div className="skeleton-text" />
      <div className="skeleton-text short" />
    </div>
  );

  return (
    <div className="main-container">
      <aside className="sidebar">
        <h2>FILTERS</h2>
        <div className="filter-group">
          <h3>CATEGORIES</h3>
          <label className="category-option">
            <input
              type="radio"
              name="category"
              checked={selectedCategory === "All" || selectedCategory === null}
              onChange={() => setSelectedCategory("All")}
            />
            All
          </label>

          {categories.length > 0 ? (
            categories.map((cat) => (
              <label key={cat} className="category-option">
                <input
                  type="radio"
                  name="category"
                  checked={selectedCategory === cat}
                  onChange={() => setSelectedCategory(cat)}
                />
                {cat}
              </label>
            ))
          ) : (
            <p style={{ color: "#888" }}>No categories found</p>
          )}
        </div>
      </aside>

      <section className="product-section">
        <div className="section-header">
          <h2>
            ALL <span>COLLECTIONS</span>
          </h2>

          <select
            className="sort-select"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="Relevant">Sort by: Relevant</option>
            <option value="Low to High">Price: Low to High</option>
            <option value="High to Low">Price: High to Low</option>
          </select>
        </div>

        {loading ? (
          <div className="product-grid">
            {Array.from({ length: 6 }).map((_, idx) => (
              <SkeletonCard key={idx} />
            ))}
          </div>
        ) : error ? (
          <p style={{ color: "red" }}>Error: {error}</p>
        ) : filteredProducts.length > 0 ? (
          <div className="product-grid">
            {filteredProducts.map((p) => (
              <Link
                to={`/product/${p._id}`}
                key={p._id}
                className="product-card"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <img src={p.image} alt={p.name} loading="lazy" />
                <h3>{p.name}</h3>
                <p className="price">${p.price}</p>
                {p.category && <small>{p.category}</small>}
              </Link>
            ))}
          </div>
        ) : (
          <p>No products found.</p>
        )}
      </section>
    </div>
  );
};

export default ProductList;
