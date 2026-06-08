# AuraShine E-Commerce Platform

AuraShine is a modern, premium e-commerce web application featuring a stunning light-themed UI and a robust, fully-featured backend API. 

## 🛠️ Technology Stack

**Frontend:**
- React 19
- Vite
- React Router DOM
- Pure CSS with custom design system (Premium Light Theme, Glassmorphism, Micro-animations)

**Backend:**
- Node.js
- Express.js
- MongoDB & Mongoose
- JSON Web Token (JWT) Authentication
- bcrypt for password hashing

---

## 📁 Project Structure

The project is structured into two main directories:
- `/frontend` - Contains the React client application
- `/backend` - Contains the Express/MongoDB API

---

## 🚀 Getting Started

### Prerequisites
Make sure you have the following installed on your machine:
- **Node.js** (v18 or higher recommended)
- **MongoDB** (Local instance or MongoDB Atlas URI)

### 1. Backend Setup

Open a terminal and navigate to the backend directory:
```bash
cd backend
```

Install the required dependencies:
```bash
npm install
```

Set up your environment variables. Create a `.env` file in the `backend` directory (one is already provided) with the following structure:
```env
MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/aurashine?retryWrites=true&w=majority
PORT=5000
JWT_SECRET=your_super_secret_jwt_key
```

Start the backend development server:
```bash
npm run dev
```
The server will typically start on `http://localhost:5000`.

### 2. Frontend Setup

Open a new terminal window/tab and navigate to the frontend directory:
```bash
cd frontend
```

Install the frontend dependencies:
```bash
npm install
```

Set up environment variables. Create a `.env` file in the `frontend` directory:
```env
VITE_API_URL=http://localhost:5000/api
```
*(If your backend is hosted elsewhere, replace the URL appropriately. A default fallback to the local API is already configured in the frontend services).*

Start the frontend development server:
```bash
npm run dev
```
Vite will provide a local URL (e.g., `http://localhost:5173`) where you can view the application.

---

## 🔌 API Endpoints

The backend provides the following key endpoints:

**Products**
- `GET /api/products` — Retrieve products (supports `q` for search, `minPrice`, `maxPrice`, `sort`, `page`, `limit`)
- `GET /api/products/:id` — Get specific product details

**Cart**
- `GET /api/cart` — Retrieve cart items
- `POST /api/cart` — Add item to cart (body: `{ productId, quantity }`)
- `DELETE /api/cart/:id` — Remove item from cart

**Authentication**
- `POST /api/auth/register` — Register a new user (body: `{ name, email, password }`)
- `POST /api/auth/login` — Authenticate and get JWT token (body: `{ email, password }`)

**Orders** *(Protected - Requires JWT Token in `Authorization: Bearer <token>` header)*
- `POST /api/orders` — Create new order (body: `{ customerName, address, mobile, items }`)
- `GET /api/orders` — Retrieve all orders

---

## 🎨 Design System

The frontend was built from scratch using pure CSS to ensure a truly premium and unique feel without relying on generic frameworks. It features:
- **Vibrant Light Theme**: A stunning, clean aesthetic featuring an off-white background with crisp white cards and a gorgeous indigo accent (`#4f46e5`).
- **Dynamic Elements**: Smooth micro-animations on buttons and cards.
- **Responsive Layouts**: Fully responsive grid systems across products, cart, and checkout pages.
