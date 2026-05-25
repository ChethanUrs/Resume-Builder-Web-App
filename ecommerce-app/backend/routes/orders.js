const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const { auth, admin } = require('../middleware/auth');

// @route   POST /api/orders
// @desc    Create a new order & process payment & decrement inventory stock
// @access  Private
router.post('/', auth, async (req, res) => {
  const { 
    orderItems, 
    shippingAddress, 
    paymentMethod,
    itemsPrice, 
    taxPrice, 
    shippingPrice, 
    totalPrice 
  } = req.body;

  if (!orderItems || orderItems.length === 0) {
    return res.status(400).json({ message: 'No ordered items in cart list' });
  }

  try {
    // 1. Transactional Inventory Checks
    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: `Product ${item.name} not found in catalog` });
      }
      if (product.stock < item.qty) {
        return res.status(400).json({ 
          message: `Insufficient inventory stock for "${item.name}". Only ${product.stock} available.` 
        });
      }
    }

    // 2. Decrement Stocks immediately on payment capture
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.qty }
      });
    }

    // 3. Process Mock Secure Payment Processing Loop (Mock Stripe Transaction ID)
    const mockPaymentResult = {
      id: `ch_stripe_${Date.now()}_${Math.round(Math.random() * 10000)}`,
      status: 'succeeded',
      update_time: new Date().toISOString(),
      email_address: req.user.email || 'customer@example.com'
    };

    // 4. Record Order in database
    const order = new Order({
      user: req.user.id,
      orderItems,
      shippingAddress,
      paymentMethod: paymentMethod || 'Card',
      paymentResult: mockPaymentResult,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      isPaid: true,
      paidAt: Date.now(),
      status: 'Processing'
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    console.error('Checkout failed:', error.message);
    res.status(500).json({ message: 'Order checkout transaction failed' });
  }
});

// @route   GET /api/orders/myorders
// @desc    Get logged in user orders
// @access  Private
router.get('/myorders', auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error loading user orders list' });
  }
});

// @route   GET /api/orders/:id
// @desc    Get order details by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'username email');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Restrict access: Purchaser or Administrator only!
    const isOwner = order.user._id.toString() === req.user.id;
    const isAdmin = req.user.isAdmin;
    
    if (!isOwner && !isAdmin) {
      return res.status(401).json({ message: 'Not authorized to view this order details' });
    }

    res.json(order);
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(500).json({ message: 'Server error loading order details' });
  }
});

// @route   GET /api/orders
// @desc    Get all orders (Admin Only)
// @access  Private/Admin
router.get('/', auth, admin, async (req, res) => {
  try {
    const orders = await Order.find({}).populate('user', 'id username').sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error loading admin orders directory' });
  }
});

// @route   PUT /api/orders/:id/deliver
// @desc    Update order status to Delivered (Admin Only)
// @access  Private/Admin
router.put('/:id/deliver', auth, admin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = 'Delivered';
    
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error delivering order' });
  }
});

module.exports = router;
