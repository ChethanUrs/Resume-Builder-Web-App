const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');

// Track online users mapping: userId -> socket.id
const userSockets = new Map();

const socketHandler = (io) => {
  // Authentication middleware for Socket connections
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) {
      return next(new Error('Authentication error: No session token'));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_jwt_token_for_chat_app_2026_antigravity');
      socket.user = decoded;
      next();
    } catch (err) {
      return next(new Error('Authentication error: Session invalid or expired'));
    }
  });

  io.on('connection', async (socket) => {
    const userId = socket.user.id;
    userSockets.set(userId, socket.id);

    console.log(`Socket connected: User ${socket.user.username} (${userId})`);

    try {
      // 1. Presence: Update online status in database and broadcast
      await User.findByIdAndUpdate(userId, { isOnline: true });
      socket.broadcast.emit('user-status-changed', { userId, isOnline: true });
      
      // Send active online mapping back to caller
      const onlineUserIds = Array.from(userSockets.keys());
      socket.emit('active-users', onlineUserIds);
    } catch (err) {
      console.error('Error updating online presence:', err.message);
    }

    // 2. Joining rooms
    socket.on('join-rooms', (conversationIds) => {
      if (Array.isArray(conversationIds)) {
        conversationIds.forEach((id) => {
          socket.join(id);
          console.log(`User ${socket.user.username} joined chat room: ${id}`);
        });
      }
    });

    socket.on('join-room', (conversationId) => {
      socket.join(conversationId);
      console.log(`User ${socket.user.username} joined chat room: ${conversationId}`);
    });

    // 3. Typing Indicators
    socket.on('typing-start', ({ conversationId }) => {
      socket.to(conversationId).emit('typing-start', {
        conversationId,
        userId,
        username: socket.user.username
      });
    });

    socket.on('typing-stop', ({ conversationId }) => {
      socket.to(conversationId).emit('typing-stop', {
        conversationId,
        userId
      });
    });

    // 4. Real-time Message Handler
    socket.on('send-message', async ({ conversationId, text, fileUrl, fileName, fileType, fileSize }) => {
      try {
        const newMessage = new Message({
          sender: userId,
          conversation: conversationId,
          text: text || '',
          fileUrl: fileUrl || '',
          fileName: fileName || '',
          fileType: fileType || '',
          fileSize: fileSize || ''
        });

        const savedMessage = await newMessage.save();
        const populatedMessage = await Message.findById(savedMessage._id)
          .populate('sender', 'username avatar');

        // Update last message in Conversation
        await Conversation.findByIdAndUpdate(conversationId, {
          lastMessage: savedMessage._id,
          updatedAt: Date.now()
        });

        // Broadcast message to the chat room
        io.to(conversationId).emit('new-message', populatedMessage);
      } catch (err) {
        console.error('Error sending message via Socket:', err.message);
      }
    });

    // 5. Generic WebRTC Signaling Gateway (Relays WebRTC SDP offers/answers and ICE candidates)
    socket.on('webrtc-signaling', ({ toUserId, type, payload }) => {
      const recipientSocketId = userSockets.get(toUserId);
      if (recipientSocketId) {
        // Forward WebRTC parameters with sender's identity
        io.to(recipientSocketId).emit('webrtc-signaling', {
          fromUserId: userId,
          fromUsername: socket.user.username,
          type,    // 'offer', 'answer', 'ice-candidate', 'hangup', 'call-request'
          payload  // SDP payload or candidate details
        });
        console.log(`Signaling relayed [${type}] from ${socket.user.username} to User Socket ${toUserId}`);
      } else {
        // Notify sender that recipient is currently unreachable for video call
        socket.emit('webrtc-error', { message: 'Recipient is currently offline or unreachable.' });
      }
    });

    // 6. Presence: Disconnect cleanup
    socket.on('disconnect', async () => {
      userSockets.delete(userId);
      console.log(`Socket disconnected: User ${socket.user.username} (${userId})`);

      try {
        await User.findByIdAndUpdate(userId, {
          isOnline: false,
          lastSeen: Date.now()
        });
        io.emit('user-status-changed', { userId, isOnline: false, lastSeen: Date.now() });
      } catch (err) {
        console.error('Error updating presence on disconnect:', err.message);
      }
    });
  });
};

module.exports = socketHandler;
