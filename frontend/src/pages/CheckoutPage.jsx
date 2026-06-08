import { useMemo, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useCart } from '../context/CartContext';
import { isLoggedIn, getCurrentUser, placeOrderAPI } from '../services/api';
import './CheckoutPage.css';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cartItems, cartTotal, cartCount } = useCart();
  const user = getCurrentUser();
  const [form, setForm] = useState({
    customerName: user?.name || user?.email || '',
    address: '',
    mobile: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const orderItems = useMemo(
    () => cartItems.map((item) => ({ product: item.id, quantity: item.quantity, price: item.price })),
    [cartItems]
  );

  if (!isLoggedIn()) {
    return <Navigate to="/login" replace state={{ from: '/checkout' }} />;
  }

  if (cartCount === 0) {
    return (
      <div className="checkout-page">
        <Navbar />
        <div className="checkout-shell">
          <div className="checkout-empty-card">
            <h1>Your cart is empty</h1>
            <p>Add products before going to checkout.</p>
            <Link to="/products" className="checkout-back-link">Browse Products</Link>
          </div>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.customerName.trim() || !form.address.trim() || !form.mobile.trim()) {
      setError('Please fill out all checkout fields.');
      return;
    }

    setIsSubmitting(true);
    setError('');
    try {
      await placeOrderAPI(form.customerName, form.address, form.mobile, orderItems);
      setSuccess('Order placed successfully.');
      navigate('/products');
    } catch (err) {
      setError(err.message || 'Unable to place order.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="checkout-page">
      <Navbar />
      <div className="checkout-shell">
        <div className="checkout-grid">
          <section className="checkout-card">
            <h1 className="checkout-title">Checkout</h1>
            <p className="checkout-subtitle">Confirm your details to place the order.</p>

            {error && <div className="checkout-message error">{error}</div>}
            {success && <div className="checkout-message success bounce">{success}</div>}

            <form className="checkout-form" onSubmit={handleSubmit}>
              <label>
                Customer name
                <input name="customerName" value={form.customerName} onChange={handleChange} />
              </label>
              <label>
                Delivery address
                <textarea name="address" rows="4" value={form.address} onChange={handleChange} />
              </label>
              <label>
                Mobile number
                <input name="mobile" type="tel" inputMode="tel" pattern="[0-9+ \-()]{7,}" value={form.mobile} onChange={handleChange} />
              </label>
              <button className="checkout-confirm-btn" type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Placing Order...' : 'Place Order'}
              </button>
            </form>
          </section>

          <aside className="checkout-summary-card">
            <h2>Order Summary</h2>
            <div className="checkout-summary-line">
              <span>Items</span>
              <strong>{cartCount}</strong>
            </div>
            <div className="checkout-summary-line">
              <span>Total</span>
              <strong>${(cartTotal * 1.08).toFixed(2)}</strong>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}