const express = require('express');
const router = express.Router();
const CartItem = require('../models/CartItem');
const Product = require('../models/Product');

// POST /api/cart - add item to cart
router.post('/', async (req, res) => {
  const { productId, quantity = 1 } = req.body;
  if (!productId) return res.status(400).json({ message: 'productId required' });
  try {
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    const item = new CartItem({ product: productId, quantity });
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/cart - retrieve cart items
router.get('/', async (req, res) => {
  try {
    const items = await CartItem.find().populate('product');
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/cart/:id - remove item from cart
router.delete('/:id', async (req, res) => {
  try {
    const removed = await CartItem.findByIdAndDelete(req.params.id);
    if (!removed) return res.status(404).json({ message: 'Cart item not found' });
    res.json({ message: 'Deleted', id: req.params.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
