import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { fetchProducts } from '../services/api';
import Navbar from '../components/Navbar';
import './ProductsPage.css';

export default function ProductsPage() {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await fetchProducts();
        // Backend returns { data: [...], meta: {...} }
        setProducts(data.data || []);
      } catch (err) {
        setError(err.message || 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="products-page" id="products-page">
      <Navbar />

      <header className="products-hero" id="products-hero">
        <div className="hero-bg-gradient" />
        <div className="hero-content">
          <span className="hero-badge">Curated Collection</span>
          <h1 className="hero-title">Discover Premium</h1>
          <p className="hero-subtitle">
            Handpicked luxury products for the modern connoisseur
          </p>
        </div>
      </header>

      <main className="products-grid-section">
        {loading && (
          <div className="products-loading" id="products-loading">
            <div className="loading-spinner" />
            <p className="loading-text">Loading collection...</p>
          </div>
        )}

        {error && (
          <div className="products-error" id="products-error">
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <div className="products-empty" id="products-empty">
            <p className="empty-text">No products available yet.</p>
          </div>
        )}

        {!loading && !error && products.length > 0 && (
          <div className="products-grid" id="products-grid">
            {products.map((product, index) => (
              <article
                className="product-card"
                key={product._id}
                id={`product-card-${product._id}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <Link
                  to={`/product/${product._id}`}
                  className="product-card-image-link"
                  id={`product-link-${product._id}`}
                >
                  <div className="product-card-image-wrapper">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="product-card-image"
                        loading="lazy"
                      />
                    ) : (
                      <div className="product-card-placeholder">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                          <circle cx="8.5" cy="8.5" r="1.5" />
                          <polyline points="21 15 16 10 5 21" />
                        </svg>
                      </div>
                    )}
                    <div className="product-card-overlay">
                      <span className="view-details-label">View Details</span>
                    </div>
                  </div>
                </Link>
                <div className="product-card-body">
                  <Link to={`/product/${product._id}`} className="product-card-name-link">
                    <h2 className="product-card-name">{product.name}</h2>
                  </Link>
                  {product.description && (
                    <p className="product-card-subtitle">
                      {product.description.length > 80
                        ? product.description.substring(0, 80) + '...'
                        : product.description}
                    </p>
                  )}
                  <div className="product-card-meta">
                    <span className="product-card-price">
                      ${Number(product.price).toFixed(2)}
                    </span>
                  </div>
                  <button
                    className="add-to-cart-btn"
                    onClick={() => addToCart(product)}
                    id={`add-to-cart-${product._id}`}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    Add to Cart
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
