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

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://kumara2138:Taniya%4009@aurashine.3nw1yjl.mongodb.net/aurashine?retryWrites=true&w=majority';
mongoose
  .connect(MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => {
    console.error('MongoDB Error:', err);
  });

app.use('/api/products', productsRouter);
app.use('/api/cart', cartRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/auth', authRouter);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Choose a different PORT or stop the process using it.`);
    process.exit(1);
  }
  console.error('Server error:', err);
  process.exit(1);
});
