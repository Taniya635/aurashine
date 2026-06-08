import mockProducts from '../data/products';

const API_URL = import.meta.env.VITE_API_URL;
const USE_REMOTE_API = import.meta.env.VITE_USE_REMOTE_API === 'true';
const MOCK_CART_KEY = 'aura-mock-cart';
const MOCK_TOKEN_KEY = 'aura-mock-token';
const AUTH_USER_KEY = 'aura-auth-user';

function isMockMode() {
  return !USE_REMOTE_API || !API_URL;
}

function toMockProduct(product) {
  return {
    ...product,
    _id: String(product.id),
  };
}

function getMockProducts() {
  return mockProducts.map(toMockProduct);
}

function getMockCart() {
  try {
    return JSON.parse(localStorage.getItem(MOCK_CART_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveMockCart(items) {
  localStorage.setItem(MOCK_CART_KEY, JSON.stringify(items));
}

function makeMockCartResponse(cartItems) {
  return cartItems.map((item) => {
    const product = getMockProducts().find((entry) => String(entry._id) === String(item.productId));
    return {
      _id: item.cartItemId,
      product,
      quantity: item.quantity,
    };
  });
}

function filterMockProducts(params = {}) {
  const products = getMockProducts();
  const query = String(params.q || '').trim().toLowerCase();
  const minPrice = params.minPrice ? Number(params.minPrice) : null;
  const maxPrice = params.maxPrice ? Number(params.maxPrice) : null;

  return products.filter((product) => {
    const matchesQuery =
      !query ||
      product.name.toLowerCase().includes(query) ||
      String(product.description || '').toLowerCase().includes(query);
    const price = Number(product.price);
    const matchesMin = minPrice === null || Number.isNaN(minPrice) || price >= minPrice;
    const matchesMax = maxPrice === null || Number.isNaN(maxPrice) || price <= maxPrice;
    return matchesQuery && matchesMin && matchesMax;
  });
}

async function readJsonResponse(res) {
  const text = await res.text();
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
}

async function tryRequest(url, options, fallback) {
  if (isMockMode()) return fallback();

  try {
    const res = await fetch(url, options);
    if (!res.ok) {
      const data = await readJsonResponse(res);
      const error = new Error(data.error || data.message || 'Request failed');
      error.status = res.status;
      throw error;
    }
    return await res.json();
  } catch (err) {
    return fallback(err);
  }
}

function getToken() {
  return localStorage.getItem('token') || localStorage.getItem(MOCK_TOKEN_KEY);
}

function saveAuthUser(user) {
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
}

export function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem(AUTH_USER_KEY) || 'null');
  } catch {
    return null;
  }
}

export function getDisplayName() {
  const user = getCurrentUser();
  if (user?.name) return user.name;
  if (user?.email) return user.email.split('@')[0];
  return 'Guest';
}

function authHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// ─── Auth ─────────────────────────────────────────

export async function loginUser(email, password) {
  const data = await tryRequest(
    `${API_URL}/auth/login`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    },
    async () => {
      const token = `mock-${btoa(`${email}:${Date.now()}`)}`;
      localStorage.setItem(MOCK_TOKEN_KEY, token);
      saveAuthUser({ email, name: email.split('@')[0] });
      return { token };
    }
  );

  if (data?.token && !isMockMode()) {
    localStorage.setItem('token', data.token);
    localStorage.removeItem(MOCK_TOKEN_KEY);
    saveAuthUser({ email, name: email.split('@')[0] });
  }

  return data;
}

export async function registerUser(name, email, password) {
  const data = await tryRequest(
    `${API_URL}/auth/register`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    },
    async () => {
      const token = `mock-${btoa(`${email}:${Date.now()}`)}`;
      localStorage.setItem(MOCK_TOKEN_KEY, token);
      saveAuthUser({ name, email });
      return { token };
    }
  );

  if (data?.token && !isMockMode()) {
    localStorage.setItem('token', data.token);
    localStorage.removeItem(MOCK_TOKEN_KEY);
    saveAuthUser({ name, email });
  }

  return data;
}

export function logoutUser() {
  localStorage.removeItem('token');
  localStorage.removeItem(MOCK_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
}

export function isLoggedIn() {
  return !!getToken();
}

// ─── Products ─────────────────────────────────────

export async function fetchProducts(params = {}) {
  const query = new URLSearchParams(params).toString();
  const url = query ? `${API_URL}/products?${query}` : `${API_URL}/products`;

  return tryRequest(
    url,
    {
      headers: { ...authHeaders() },
    },
    async () => {
      const filtered = filterMockProducts(params);
      return {
        data: filtered,
        meta: {
          page: Number(params.page || 1),
          limit: Number(params.limit || filtered.length || 20),
          total: filtered.length,
          totalPages: 1,
        },
      };
    }
  );
}

export async function fetchProductById(id) {
  return tryRequest(
    `${API_URL}/products/${id}`,
    {
      headers: { ...authHeaders() },
    },
    async () => {
      const product = getMockProducts().find((entry) => String(entry._id) === String(id));
      if (!product) throw new Error('Product not found');
      return product;
    }
  );
}

// ─── Cart ─────────────────────────────────────────

export async function fetchCart() {
  return tryRequest(
    `${API_URL}/cart`,
    {
      headers: { ...authHeaders() },
    },
    async () => makeMockCartResponse(getMockCart())
  );
}

export async function addToCartAPI(productId, quantity = 1) {
  return tryRequest(
    `${API_URL}/cart`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify({ productId, quantity }),
    },
    async () => {
      const cart = getMockCart();
      const existing = cart.find((item) => String(item.productId) === String(productId));
      if (existing) {
        existing.quantity += quantity;
      } else {
        cart.push({
          cartItemId: `mock-cart-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          productId: String(productId),
          quantity,
        });
      }
      saveMockCart(cart);
      return { success: true };
    }
  );
}

export async function removeFromCartAPI(cartItemId) {
  return tryRequest(
    `${API_URL}/cart/${cartItemId}`,
    {
      method: 'DELETE',
      headers: { ...authHeaders() },
    },
    async () => {
      const cart = getMockCart().filter((item) => item.cartItemId !== cartItemId);
      saveMockCart(cart);
      return { success: true };
    }
  );
}

// ─── Orders ───────────────────────────────────────

export async function placeOrderAPI(customerName, address, mobile, items) {
  return tryRequest(
    `${API_URL}/orders`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify({ customerName, address, mobile, items }),
    },
    async () => {
      // In mock mode, clear the mock cart after placing order
      saveMockCart([]);
      return {
        _id: `mock-order-${Date.now()}`,
        customerName,
        address,
        mobile,
        items,
        total: items.reduce((sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 1), 0),
        createdAt: new Date().toISOString(),
      };
    }
  );
}

