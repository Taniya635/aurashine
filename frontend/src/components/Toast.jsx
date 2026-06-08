import { useCart } from '../context/CartContext';
import { useEffect, useState } from 'react';
import './Toast.css';

export default function Toast() {
  const { notification } = useCart();
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (notification) {
      setMessage(notification);
      setVisible(true);
    } else if (visible) {
      // trigger exit animation then hide
      setVisible(false);
      const t = setTimeout(() => setMessage(''), 380);
      return () => clearTimeout(t);
    }
  }, [notification]);

  if (!message) return null;

  return (
    <div className={`toast ${visible ? 'enter' : 'exit'}`} id="cart-toast">
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="20 6 9 17 4 12" />
      </svg>
      <span>{message}</span>
    </div>
  );
}
