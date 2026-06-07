const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const auth = require('../middleware/auth');

// POST /api/orders - create new order (protected)
router.post('/', auth, async (req, res) => {
  const { customerName, address, mobile, items } = req.body;
  if (!customerName || !address || !mobile || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  try {
    let total = 0;
    const orderItems = [];
    for (const it of items) {
      const prod = await Product.findById(it.product);
      if (!prod) return res.status(400).json({ message: `Product ${it.product} not found` });
      const qty = it.quantity || 1;
      total += prod.price * qty;
      orderItems.push({ product: prod._id, quantity: qty });
    }
    const orderData = { customerName, address, mobile, items: orderItems, total };
    if (req.user && req.user.id) orderData.user = req.user.id;
    const order = new Order(orderData);
    await order.save();
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/orders - retrieve all orders
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().populate('items.product');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
