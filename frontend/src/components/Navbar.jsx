import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { getCurrentUser, getDisplayName, isLoggedIn, logoutUser } from '../services/api';
import './Navbar.css';

export default function Navbar() {
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [user, setUser] = useState(getCurrentUser());
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const syncUser = () => setUser(getCurrentUser());
    syncUser();
    window.addEventListener('storage', syncUser);
    return () => window.removeEventListener('storage', syncUser);
  }, []);

  const handleLogout = () => {
    logoutUser();
    setUser(null);
    navigate('/login');
  };

  const loggedIn = isLoggedIn() && !!user;
  const displayName = loggedIn ? getDisplayName() : '';
  const avatarLetter = displayName ? displayName.charAt(0).toUpperCase() : 'G';

  return (
    <nav className="navbar" id="main-navbar">
      <div className="navbar-inner">
        <Link to="/products" className="navbar-brand" id="navbar-brand-link">
          <span className="brand-icon">✦</span>
          <span className="brand-text">AuraShine</span>
        </Link>

        <button 
          className="mobile-menu-toggle" 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {isMobileMenuOpen ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </>
            ) : (
              <>
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </>
            )}
          </svg>
        </button>

        <div className={`navbar-links ${isMobileMenuOpen ? 'open' : ''}`}>
          <Link to="/products" className="nav-link" id="nav-products-link">
            Products
          </Link>
          <Link to="/cart" className="nav-link cart-link" id="nav-cart-link">
            <svg
              className="cart-icon"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            Cart
            {cartCount > 0 && (
              <span className="cart-badge" id="cart-count-badge">
                {cartCount}
              </span>
            )}
          </Link>
          {loggedIn && (
            <div className="user-menu" id="navbar-user-menu">
              <div className="user-pill" aria-label={`Logged in as ${displayName}`}>
                <span className="user-avatar" aria-hidden="true">
                  {avatarLetter}
                </span>
                <span className="user-name">{displayName}</span>
              </div>
              <button className="logout-btn" onClick={handleLogout} id="navbar-logout-btn">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M10 17l5-5-5-5" />
                  <path d="M15 12H3" />
                  <path d="M21 3v18" />
                </svg>
                Logout
              </button>
            </div>
          )}
          {!loggedIn && (
            <Link to="/login" className="nav-link auth-link" id="nav-login-link">
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
