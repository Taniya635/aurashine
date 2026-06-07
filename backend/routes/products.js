const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// GET /api/products - retrieve all products with search, filtering, sorting, pagination
// Query params:
//  - q: full-text search string (searches name and description)
//  - minPrice, maxPrice: numeric price range
//  - sort: price_asc | price_desc | name_asc | name_desc | relevance
//  - page, limit: pagination
router.get('/', async (req, res) => {
  try {
    const { q, minPrice, maxPrice, sort, page = 1, limit = 20 } = req.query;
    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const lim = Math.max(parseInt(limit, 10) || 20, 1);

    const filter = {};
    if (typeof minPrice !== 'undefined' || typeof maxPrice !== 'undefined') {
      filter.price = {};
      if (minPrice !== undefined && minPrice !== '') filter.price.$gte = Number(minPrice);
      if (maxPrice !== undefined && maxPrice !== '') filter.price.$lte = Number(maxPrice);
    }

    let query = Product.find(filter);

    // Full-text search
    if (q) {
      // Use text search for name/description
      filter.$text = { $search: q };
      // re-create query with text filter so projection and sort by score can apply
      query = Product.find(filter).select({ score: { $meta: 'textScore' } });
    }

    // Sorting
    const sortMap = {
      price_asc: { price: 1 },
      price_desc: { price: -1 },
      name_asc: { name: 1 },
      name_desc: { name: -1 }
    };

    if (q && (!sort || sort === 'relevance')) {
      query = query.sort({ score: { $meta: 'textScore' } });
    } else if (sort && sortMap[sort]) {
      query = query.sort(sortMap[sort]);
    }

    const skip = (pageNum - 1) * lim;
    const total = await Product.countDocuments(filter);
    const products = await query.skip(skip).limit(lim).exec();

    res.json({
      data: products,
      meta: {
        total,
        page: pageNum,
        limit: lim,
        totalPages: Math.ceil(total / lim)
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/products/:id - retrieve specific product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
