import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Navbar from '../components/Navbar';
import { isLoggedIn } from '../services/api';
import './CartPage.css';

export default function CartPage() {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQuantity, cartTotal, cartCount, loading } =
    useCart();

  const handleCheckout = () => {
    if (!isLoggedIn()) {
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }

    navigate('/checkout');
  };

  if (loading) {
    return (
      <div className="cart-page" id="cart-page">
        <Navbar />
        <div className="cart-loading">
          <div className="cart-loading-spinner" />
          <p className="cart-loading-text">Loading cart...</p>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="cart-page" id="cart-page">
        <Navbar />
        <div className="cart-empty" id="cart-empty">
          <div className="empty-icon-wrapper">
            <svg
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--muted)"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
          </div>
          <h1 className="empty-title">Your Cart is Empty</h1>
          <p className="empty-text">
            Looks like you haven't added any products yet
          </p>
          <Link to="/products" className="empty-cta" id="browse-products-btn">
            Browse Products
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page" id="cart-page">
      <Navbar />

      <div className="cart-container">
        <header className="cart-header">
          <h1 className="cart-title">Shopping Cart</h1>
          <span className="cart-item-count">
            {cartCount} {cartCount === 1 ? 'item' : 'items'}
          </span>
        </header>

        <div className="cart-layout">
          {/* Cart Items */}
          <div className="cart-items-section" id="cart-items-list">
            {cartItems.map((item, index) => (
              <div
                className="cart-item"
                key={item.cartItemId}
                id={`cart-item-${item.cartItemId}`}
                style={{ animationDelay: `${index * 0.08}s` }}
              >
                <Link
                  to={`/product/${item.id}`}
                  className="cart-item-image-link"
                >
                  <div className="cart-item-image-wrapper">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="cart-item-image"
                      />
                    ) : (
                      <div className="cart-item-placeholder">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                          <circle cx="8.5" cy="8.5" r="1.5" />
                          <polyline points="21 15 16 10 5 21" />
                        </svg>
                      </div>
                    )}
                  </div>
                </Link>

                <div className="cart-item-details">
                  <div className="cart-item-top">
                    <div>
                      <Link
                        to={`/product/${item.id}`}
                        className="cart-item-name-link"
                      >
                        <h3 className="cart-item-name">{item.name}</h3>
                      </Link>
                    </div>
                    <button
                      className="cart-item-remove"
                      onClick={() => removeFromCart(item.cartItemId)}
                      id={`remove-item-${item.cartItemId}`}
                      aria-label={`Remove ${item.name}`}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  </div>

                  <div className="cart-item-bottom">
                    <div className="quantity-controls" id={`quantity-controls-${item.cartItemId}`}>
                      <button
                        className="qty-btn"
                        onClick={() =>
                          updateQuantity(item.cartItemId, item.quantity - 1)
                        }
                        aria-label="Decrease quantity"
                        id={`qty-decrease-${item.cartItemId}`}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                          <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                      </button>
                      <span className="qty-value" id={`qty-value-${item.cartItemId}`}>
                        {item.quantity}
                      </span>
                      <button
                        className="qty-btn"
                        onClick={() =>
                          updateQuantity(item.cartItemId, item.quantity + 1)
                        }
                        aria-label="Increase quantity"
                        id={`qty-increase-${item.cartItemId}`}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                          <line x1="12" y1="5" x2="12" y2="19" />
                          <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                      </button>
                    </div>
                    <span className="cart-item-price" id={`item-total-${item.cartItemId}`}>
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <aside className="cart-summary" id="cart-summary">
            <div className="summary-card">
              <h2 className="summary-title">Order Summary</h2>

              <div className="summary-rows">
                <div className="summary-row">
                  <span className="summary-label">Subtotal</span>
                  <span className="summary-value" id="cart-subtotal">
                    ${cartTotal.toFixed(2)}
                  </span>
                </div>
                <div className="summary-row">
                  <span className="summary-label">Shipping</span>
                  <span className="summary-value summary-free">Free</span>
                </div>
                <div className="summary-row">
                  <span className="summary-label">Tax (est.)</span>
                  <span className="summary-value" id="cart-tax">
                    ${(cartTotal * 0.08).toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="summary-divider" />

              <div className="summary-total-row">
                <span className="summary-total-label">Total</span>
                <span className="summary-total-value" id="cart-total">
                  ${(cartTotal * 1.08).toFixed(2)}
                </span>
              </div>

              <button className="checkout-btn" id="checkout-btn" onClick={handleCheckout}>
                Proceed to Checkout
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </button>

              <div className="summary-security">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <span>Secure checkout with SSL encryption</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
