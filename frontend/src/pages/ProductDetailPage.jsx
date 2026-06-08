import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { fetchProductById } from '../services/api';
import Navbar from '../components/Navbar';
import './ProductDetailPage.css';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await fetchProductById(id);
        setProduct(data);
      } catch (err) {
        setError(err.message || 'Product not found');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="product-detail-page" id="product-detail-page">
        <Navbar />
        <div className="detail-loading">
          <div className="loading-spinner" />
          <p className="loading-text">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-detail-page" id="product-detail-page">
        <Navbar />
        <div className="not-found-container">
          <h1 className="not-found-title">Product Not Found</h1>
          <p className="not-found-text">{error || "The product you're looking for doesn't exist."}</p>
          <Link to="/products" className="back-link">
            ← Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product);
  };

  return (
    <div className="product-detail-page" id="product-detail-page">
      <Navbar />

      <div className="detail-container">
        {/* Breadcrumb */}
        <nav className="breadcrumb" id="breadcrumb">
          <Link to="/products" className="breadcrumb-link">Products</Link>
          <span className="breadcrumb-sep">/</span>
          <span className="breadcrumb-current">{product.name}</span>
        </nav>

        <div className="detail-grid">
          {/* Image Section */}
          <div className="detail-image-section" id="detail-image-section">
            <div className="detail-image-wrapper">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="detail-image"
                  id="product-main-image"
                />
              ) : (
                <div className="detail-image-placeholder">
                  <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                </div>
              )}
              <div className="image-glow" />
            </div>
          </div>

          {/* Info Section */}
          <div className="detail-info-section" id="detail-info-section">
            <h1 className="detail-name" id="product-name">{product.name}</h1>

            <div className="detail-price-section">
              <span className="detail-price" id="product-price">
                ${Number(product.price).toFixed(2)}
              </span>
              <span className="price-note">Free shipping on all orders</span>
            </div>

            <div className="detail-divider" />

            {product.description && (
              <p className="detail-description" id="product-description">
                {product.description}
              </p>
            )}

            <div className="detail-actions">
              <button
                className="detail-add-to-cart-btn"
                onClick={handleAddToCart}
                id="detail-add-to-cart-btn"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
                Add to Cart
              </button>
              <button
                className="detail-back-btn"
                onClick={() => navigate('/products')}
                id="detail-back-btn"
              >
                ← Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
