import React from "react";
import { FaShoppingCart, FaHome, FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useSearch } from "../context/SearchContext";
import { useCart } from "../context/CartContext";

function Header() {
  const { searchTerm, setSearchTerm } = useSearch();
  const { cartItems } = useCart();

  return (
    <header
      style={{
        padding: "15px 30px",
        backgroundColor: "#0a0a0a",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
        position: "sticky",
        top: 0,
        zIndex: 1000,
        overflowX: "hidden", // ✅ Prevents horizontal scroll
        maxWidth: "100%", // ✅ Ensures header doesn't exceed screen width
      }}
    >
      {/* Left Section - Logo */}
      <div
        style={{
          fontSize: "24px",
          fontWeight: "bold",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          letterSpacing: "1px",
        }}
      >
        🛍️ My Store
      </div>

      {/* Middle Section - Navigation + Search */}
      <nav
        style={{
          display: "flex",
          alignItems: "center",
          gap: "25px",
          flexWrap: "wrap", // ✅ Makes sure elements wrap on small screens
        }}
      >
        <Link
          to="/"
          style={{
            color: "white",
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            fontWeight: 500,
            transition: "color 0.2s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#00c6ff")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "white")}
        >
          <FaHome />
          Home
        </Link>

        {/* Search Bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            backgroundColor: "#1a1a1a",
            borderRadius: "20px",
            padding: "6px 12px",
            transition: "background-color 0.2s ease",
          }}
        >
          <FaSearch style={{ marginRight: "8px", color: "#aaa" }} />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              background: "transparent",
              border: "none",
              outline: "none",
              color: "white",
              width: "180px",
              fontSize: "14px",
            }}
          />
        </div>
      </nav>

      {/* Right Section - Cart */}
      <div style={{ position: "relative", cursor: "pointer" }}>
        <FaShoppingCart size={22} />
        {cartItems?.length > 0 && (
          <span
            style={{
              position: "absolute",
              top: "-8px",
              right: "-10px",
              background: "red",
              color: "white",
              borderRadius: "50%",
              padding: "2px 6px",
              fontSize: "12px",
              fontWeight: "bold",
            }}
          >
            {cartItems.length}
          </span>
        )}
      </div>
    </header>
  );
}

export default Header;
