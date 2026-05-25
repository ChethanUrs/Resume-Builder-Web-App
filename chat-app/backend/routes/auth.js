const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

// @route   POST /api/auth/register
// @desc    Register a new chat user
// @access  Public
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Please enter all fields' });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters long' });
  }

  try {
    let userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      if (userExists.email === email.toLowerCase()) {
        return res.status(400).json({ message: 'A user with this email already exists' });
      }
      return res.status(400).json({ message: 'Username is already taken' });
    }

    const newUser = new User({
      username,
      email,
      password,
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(username)}` // Beautiful initials avatar
    });

    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(password, salt);

    const savedUser = await newUser.save();

    const payload = { id: savedUser._id, username: savedUser.username };
    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'super_secret_jwt_token_for_chat_app_2026_antigravity',
      { expiresIn: '7d' },
      (err, token) => {
        if (err) throw err;
        res.status(201).json({
          token,
          user: {
            id: savedUser._id,
            username: savedUser.username,
            email: savedUser.email,
            avatar: savedUser.avatar
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
// @desc    Authenticate user & get token
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

    const payload = { id: user._id, username: user.username };
    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'super_secret_jwt_token_for_chat_app_2026_antigravity',
      { expiresIn: '7d' },
      (err, token) => {
        if (err) throw err;
        res.json({
          token,
          user: {
            id: user._id,
            username: user.username,
            email: user.email,
            avatar: user.avatar
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
// @desc    Get current user profile
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching user details' });
  }
});

// @route   GET /api/auth/users
// @desc    Get all users for search (excluding current user)
// @access  Private
router.get('/users', auth, async (req, res) => {
  const { search } = req.query;
  try {
    let query = { _id: { $ne: req.user.id } };
    
    if (search) {
      query.$or = [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query).select('username email avatar isOnline lastSeen').limit(20);
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error searching users' });
  }
});

module.exports = router;
