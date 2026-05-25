require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Initialize server app
const app = express();

// Database Connection
connectDB();

// Global Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check API
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    service: 'ecommerce-backend',
    timestamp: new Date()
  });
});

// Mount Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/admin', require('./routes/admin'));

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err.stack);
  res.status(500).json({
    message: 'An internal server error occurred',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// Start Server
const PORT = process.env.PORT || 7000;
app.listen(PORT, () => {
  console.log(`E-Commerce application server is running on port ${PORT}`);
});
