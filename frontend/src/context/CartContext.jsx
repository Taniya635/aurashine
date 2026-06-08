import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { fetchCart, addToCartAPI, removeFromCartAPI, isLoggedIn } from '../services/api';

const CartContext = createContext();

export function CartProvider({ children }) {
  const location = useLocation();
  const [cartItems, setCartItems] = useState([]);
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(false);

  const showNotification = useCallback((message) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 2500);
  }, []);

  // Load cart from backend
  const loadCart = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchCart();
      // Backend returns array of { _id, product: {...}, quantity }
      const items = data
        .filter((item) => item.product) // skip if product was deleted
        .map((item) => ({
          cartItemId: item._id,
          id: item.product._id,
          name: item.product.name,
          price: item.product.price,
          description: item.product.description,
          image: item.product.image,
          quantity: item.quantity,
        }));
      setCartItems(items);
    } catch (err) {
      console.error('Failed to load cart:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load cart on mount
  useEffect(() => {
    const authPages = ['/login', '/register'];
    if (!authPages.includes(location.pathname) || isLoggedIn()) {
      loadCart();
    }
  }, [loadCart, location.pathname]);

  const addToCart = useCallback(
    async (product) => {
      try {
        // Use product._id (from backend) or product.id
        const productId = product._id || product.id;
        await addToCartAPI(productId, 1);
        showNotification(`${product.name} added to cart`);
        // Reload cart from backend to stay in sync
        await loadCart();
      } catch (err) {
        console.error('Add to cart error:', err);
        showNotification(err.message || 'Failed to add to cart');
      }
    },
    [showNotification, loadCart]
  );

  const removeFromCart = useCallback(
    async (cartItemId) => {
      try {
        await removeFromCartAPI(cartItemId);
        setCartItems((prev) =>
          prev.filter((item) => item.cartItemId !== cartItemId)
        );
        showNotification('Item removed from cart');
      } catch (err) {
        console.error('Remove from cart error:', err);
        showNotification(err.message || 'Failed to remove item');
      }
    },
    [showNotification]
  );

  const updateQuantity = useCallback(
    async (cartItemId, quantity) => {
      if (quantity < 1) {
        await removeFromCart(cartItemId);
        return;
      }
      // Backend doesn't have a PATCH endpoint, so we update locally
      // For a full implementation you'd add a PATCH /api/cart/:id route
      setCartItems((prev) =>
        prev.map((item) =>
          item.cartItemId === cartItemId ? { ...item, quantity } : item
        )
      );
    },
    [removeFromCart]
  );

  const cartTotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        cartTotal,
        cartCount,
        notification,
        loading,
        loadCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
