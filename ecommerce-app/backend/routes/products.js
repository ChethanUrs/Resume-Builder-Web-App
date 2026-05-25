const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { auth, admin } = require('../middleware/auth');

// @route   GET /api/products
// @desc    Get all products supporting category, search keywords, and price sliders
// @access  Public
router.get('/', async (req, res) => {
  const { category, search, minPrice, maxPrice, rating } = req.query;
  let query = {};

  if (category) {
    query.category = category;
  }

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }

  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  if (rating) {
    query.averageRating = { $gte: Number(rating) };
  }

  try {
    const products = await Product.find(query).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error loading product catalog' });
  }
});

// @route   GET /api/products/:id
// @desc    Get a single product details
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(500).json({ message: 'Server error loading product details' });
  }
});

// @route   POST /api/products
// @desc    Create a new product listing (Admin Only)
// @access  Private/Admin
router.post('/', auth, admin, async (req, res) => {
  const { name, description, price, category, image, stock } = req.body;

  if (!name || !description || price === undefined || !category || stock === undefined) {
    return res.status(400).json({ message: 'Please enter all required product fields' });
  }

  try {
    const newProduct = new Product({
      name,
      description,
      price,
      category,
      image: image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500', // Default gorgeous visual placeholder
      stock
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error creating product' });
  }
});

// @route   PUT /api/products/:id
// @desc    Update a product listing (Admin Only)
// @access  Private/Admin
router.put('/:id', auth, admin, async (req, res) => {
  const { name, description, price, category, image, stock } = req.body;

  try {
    let product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (name !== undefined) product.name = name;
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = price;
    if (category !== undefined) product.category = category;
    if (image !== undefined) product.image = image;
    if (stock !== undefined) product.stock = stock;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error updating product' });
  }
});

// @route   DELETE /api/products/:id
// @desc    Delete a product listing (Admin Only)
// @access  Private/Admin
router.delete('/:id', auth, admin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await product.deleteOne();
    res.json({ message: 'Product removed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error removing product' });
  }
});

// @route   POST /api/products/:id/reviews
// @desc    Add review to a product and update averageRating
// @access  Private
router.post('/:id/reviews', auth, async (req, res) => {
  const { rating, comment } = req.body;

  if (rating === undefined || !comment) {
    return res.status(400).json({ message: 'Rating and comment are required' });
  }

  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if user has already reviewed the product
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user.id
    );

    if (alreadyReviewed) {
      return res.status(400).json({ message: 'Product already reviewed by you' });
    }

    // Get reviewer name
    const User = require('../models/User');
    const reviewer = await User.findById(req.user.id);

    const review = {
      user: req.user.id,
      username: reviewer.username,
      rating: Number(rating),
      comment: comment.trim()
    };

    product.reviews.push(review);
    
    // Recalculate average rating
    const totalRating = product.reviews.reduce((acc, r) => acc + r.rating, 0);
    product.averageRating = totalRating / product.reviews.length;

    await product.save();
    res.status(201).json({ message: 'Review added successfully', product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error posting review' });
  }
});

module.exports = router;
