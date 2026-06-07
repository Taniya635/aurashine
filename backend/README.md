# Aura Backend (minimal)

Simple Express + MongoDB API implementing the Product, Cart, and Order endpoints.

Available endpoints (as requested):

- GET /api/products — Retrieve all products
- GET /api/products/:id — Get specific product details
	- Supports search/filtering via query params (see below)
- POST /api/cart — Add item to cart (body: { productId, quantity })
- GET /api/cart — Retrieve cart items
- DELETE /api/cart/:id — Remove item from cart
- POST /api/orders — Create new order (body: { customerName, address, mobile, items })
- GET /api/orders — Retrieve all orders

Product search & filtering

The `GET /api/products` endpoint supports the following optional query parameters:

- `q` — full-text search over `name` and `description`.
- `minPrice` / `maxPrice` — numeric price range filters.
- `sort` — one of: `price_asc`, `price_desc`, `name_asc`, `name_desc`, `relevance` (default when `q` is used).
- `page` / `limit` — pagination (defaults: `page=1`, `limit=20`).

Example:

```bash
curl "http://localhost:4000/api/products?q=lamp&minPrice=10&maxPrice=100&sort=price_asc&page=1&limit=10"
```

Authentication (JWT)

Endpoints:

- `POST /api/auth/register` — body: `{ name, email, password }` -> returns `{ token }`
- `POST /api/auth/login` — body: `{ email, password }` -> returns `{ token }`

Use the returned token in the `Authorization` header for protected endpoints:

```
Authorization: Bearer <token>
```

The `POST /api/orders` endpoint is protected; you must include a valid token to create an order.



Quick start

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` with `MONGO_URI` and `PORT`, or use defaults, then start in dev mode:

```bash
export MONGO_URI="mongodb://127.0.0.1:27017/aura"
npm run dev
```

Notes
- Orders expect `items` to be an array of `{ product: <productId>, quantity: <number> }`.
- Cart items are stored in a `CartItem` collection; POST /api/cart expects `{ productId, quantity }`.
