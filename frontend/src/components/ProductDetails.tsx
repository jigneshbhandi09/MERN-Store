import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";
import { useCart } from "../context/CartContext";
import "./ProductDetail.css";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const { addToCart } = useCart();

  const BACKEND_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => setProduct(data))
      .catch((err) => console.error("Error fetching product:", err));
  }, [id, BACKEND_URL]);

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (rating >= i) stars.push(<FaStar key={i} className="star filled" />);
      else if (rating >= i - 0.5)
        stars.push(<FaStarHalfAlt key={i} className="star half" />);
      else stars.push(<FaRegStar key={i} className="star" />);
    }
    return stars;
  };

  if (!product) return <div className="loading">Loading product...</div>;

  return (
    <div className="product-details-container">
      <div className="product-details-card">
        <div className="image-section">
          <img src={product.image} alt={product.name} className="detail-image" />
        </div>

        <div className="info-section">
          <Link to="/" className="back-button">
            ← Back to Products
          </Link>
          <h1 className="detail-title">{product.name}</h1>
          <div className="rating">{renderStars(product.rating || 4.5)}</div>
          <p className="detail-price">${product.price}</p>
          <p className="detail-category">
            <strong>Category:</strong> {product.category}
          </p>
          <p className="detail-description">
            {product.description ||
              "This is a premium quality product made with high attention to detail."}
          </p>

          <div className="product-buttons">
            <button className="add-cart-btn" onClick={() => addToCart(product)}>
              Add to Cart
            </button>
            <button className="add-cart-btn">Buy Now</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
