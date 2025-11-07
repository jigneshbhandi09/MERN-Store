import React, { useEffect, useState } from "react";
import "./productlist.css";
import { useSearch } from "../context/SearchContext";
import { Link } from "react-router-dom"; // ✅ Import Link for navigation

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

  // Replace localhost with your Render backend URL
  const BACKEND_URL = "https://mern-store-0w1i.onrender.com";

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/products`);
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();

        setProducts(data);
        setFilteredProducts(data);

        // Extract unique categories dynamically
        const uniqueCategories = Array.from(
          new Set(data.map((item: Product) => item.category).filter(Boolean))
        );
        setCategories(uniqueCategories);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filter + Sort + Search logic
  useEffect(() => {
    let filtered = [...products];

    // Category filter
    if (selectedCategory && selectedCategory !== "All") {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    // Search filter
    if (searchTerm.trim()) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sorting
    if (sortOption === "Low to High") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortOption === "High to Low") {
      filtered.sort((a, b) => b.price - a.price);
    }

    setFilteredProducts(filtered);
  }, [searchTerm, selectedCategory, sortOption, products]);

  return (
    <div className="main-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2>FILTERS</h2>

        <div className="filter-group">
          <h3>CATEGORIES</h3>

          {/* "All" button */}
          <label className="category-option">
            <input
              type="radio"
              name="category"
              checked={selectedCategory === "All" || selectedCategory === null}
              onChange={() => setSelectedCategory("All")}
            />
            All
          </label>

          {/* Dynamic categories */}
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

      {/* Product section */}
      <section className="product-section">
        <div className="section-header">
          <h2>
            ALL <span>COLLECTIONS</span>
          </h2>

          {/* Sort dropdown */}
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
          <p>Loading products...</p>
        ) : error ? (
          <p style={{ color: "red" }}>Error: {error}</p>
        ) : filteredProducts.length > 0 ? (
          <div className="product-grid">
            {filteredProducts.map((p) => (
              // ✅ Each card wrapped in a Link
              <Link
                to={`/product/${p._id}`}
                key={p._id}
                className="product-card"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <img src={p.image} alt={p.name} />
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
