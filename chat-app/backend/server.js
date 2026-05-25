require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const socketHandler = require('./socket/connection');

// Initialize Express App
const app = express();

// Create HTTP Server wrapping Express (required for Socket.IO integration)
const server = http.createServer(app);

// Initialize Socket.IO Server with CORS
const io = new Server(server, {
  cors: {
    origin: '*', // Allow all client connections
    methods: ['GET', 'POST']
  }
});

// Connect to MongoDB Database
connectDB();

// Global Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve Shared File Uploads as static routes
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health Check API
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'healthy', service: 'chat-backend', time: new Date() });
});

// Mount Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/conversations', require('./routes/conversations'));

// Bind Socket.IO Event Coordinators
socketHandler(io);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error occurred', error: err.message });
});

// Launch server on configured port
const PORT = process.env.PORT || 6000;
server.listen(PORT, () => {
  console.log(`Chat application server is running on port ${PORT}`);
});
