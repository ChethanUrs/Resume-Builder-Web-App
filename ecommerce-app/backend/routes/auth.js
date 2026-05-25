const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

// @route   POST /api/auth/register
// @desc    Register a new e-commerce customer
// @access  Public
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Please enter all fields' });
  }

  try {
    let userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({ message: 'A user with this email already exists' });
    }

    // Auto-promote special testing email to admin
    const promoteToAdmin = email.toLowerCase() === 'admin@ecommerce.com';

    const newUser = new User({
      username,
      email,
      password,
      isAdmin: promoteToAdmin
    });

    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(password, salt);

    const savedUser = await newUser.save();

    const payload = { id: savedUser._id, isAdmin: savedUser.isAdmin };
    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'super_secret_jwt_token_for_ecommerce_app_2026_antigravity',
      { expiresIn: '7d' },
      (err, token) => {
        if (err) throw err;
        res.status(201).json({
          token,
          user: {
            id: savedUser._id,
            username: savedUser.username,
            email: savedUser.email,
            isAdmin: savedUser.isAdmin
          }
        });
      }
    );
  } catch (error) {
    console.error('Registration error:', error.message);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get session
// @access  Public
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Please enter all fields' });
  }

  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const payload = { id: user._id, isAdmin: user.isAdmin };
    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'super_secret_jwt_token_for_ecommerce_app_2026_antigravity',
      { expiresIn: '7d' },
      (err, token) => {
        if (err) throw err;
        res.json({
          token,
          user: {
            id: user._id,
            username: user.username,
            email: user.email,
            isAdmin: user.isAdmin
          }
        });
      }
    );
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user profile & populated wishlist
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password')
      .populate('wishlist', 'name price image stock averageRating');
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching user profile' });
  }
});

// @route   PUT /api/auth/wishlist/:id
// @desc    Toggle a product inside user's wishlist array
// @access  Private
router.put('/wishlist/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const productId = req.params.id;
    const isLiked = user.wishlist.includes(productId);

    if (isLiked) {
      user.wishlist = user.wishlist.filter((id) => id.toString() !== productId);
    } else {
      user.wishlist.push(productId);
    }

    await user.save();
    
    // Fetch refreshed populated wishlist
    const updatedUser = await User.findById(req.user.id)
      .populate('wishlist', 'name price image stock averageRating');
      
    res.json(updatedUser.wishlist);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error toggling wishlist' });
  }
});

module.exports = router;
