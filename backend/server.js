const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config({ override: true });

const productsRouter = require('./routes/products');
const cartRouter = require('./routes/cart');
const ordersRouter = require('./routes/orders');
const authRouter = require('./routes/auth');

const app = express();
app.use(cors());
app.use(express.json());

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('MONGO_URI is not set. Add it to backend/.env before starting the server.');
  process.exit(1);
}

// ─── MongoDB Connection ───────────────────────────
mongoose.set('bufferCommands', false); // Fail fast instead of buffering for 10s

const connectWithRetry = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 30000,
      heartbeatFrequencyMS: 10000,
    });
    console.log('MongoDB Connected');
  } catch (err) {
    console.error('MongoDB connection failed, retrying in 5s...', err.message);
    setTimeout(connectWithRetry, 5000);
  }
};

// Monitor connection events
mongoose.connection.on('disconnected', () => {
  console.warn('MongoDB disconnected. Attempting reconnect...');
});

mongoose.connection.on('reconnected', () => {
  console.log('MongoDB reconnected');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err.message);
});

// ─── Middleware: check DB before handling requests ─
app.use('/api', (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      error: 'Database is temporarily unavailable. Please try again in a moment.',
    });
  }
  next();
});

// ─── Health check endpoint ────────────────────────
app.get('/health', (req, res) => {
  const dbState = mongoose.connection.readyState;
  const states = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' };
  res.json({ status: dbState === 1 ? 'ok' : 'degraded', db: states[dbState] || 'unknown' });
});

// ─── Routes ───────────────────────────────────────
app.use('/api/products', productsRouter);
app.use('/api/cart', cartRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/auth', authRouter);

// ─── Start ────────────────────────────────────────
const PORT = process.env.PORT || 5000;

connectWithRetry().then(() => {
  const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`Port ${PORT} is already in use.`);
      process.exit(1);
    }
    console.error('Server error:', err);
    process.exit(1);
  });
});
