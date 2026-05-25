const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const auth = require('../middleware/auth');

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Unique filename with original extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } // Limit: 10MB
});

// @route   GET /api/conversations
// @desc    Get all conversations for the authenticated user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user.id
    })
    .populate('participants', 'username email avatar isOnline lastSeen')
    .populate('lastMessage')
    .sort({ updatedAt: -1 });
    
    res.json(conversations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching conversations list' });
  }
});

// @route   GET /api/conversations/:id/messages
// @desc    Get messages inside a conversation
// @access  Private
router.get('/:id/messages', auth, async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.id);
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    // Verify participant
    if (!conversation.participants.includes(req.user.id)) {
      return res.status(401).json({ message: 'Not authorized to view this room messages' });
    }

    const messages = await Message.find({ conversation: req.params.id })
      .populate('sender', 'username avatar')
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching messages history' });
  }
});

// @route   POST /api/conversations
// @desc    Start a conversation (1-on-1 or group)
// @access  Private
router.post('/', auth, async (req, res) => {
  const { recipientId, isGroup, name, participants = [] } = req.body;

  try {
    // 1. Private Chat Handler (1-on-1)
    if (!isGroup) {
      if (!recipientId) {
        return res.status(400).json({ message: 'Recipient ID is required' });
      }

      // Check if conversation already exists
      let existingConv = await Conversation.findOne({
        isGroup: false,
        participants: { $all: [req.user.id, recipientId], $size: 2 }
      })
      .populate('participants', 'username email avatar isOnline lastSeen')
      .populate('lastMessage');

      if (existingConv) {
        return res.json(existingConv);
      }

      // Create new private chat
      const newConv = new Conversation({
        participants: [req.user.id, recipientId],
        isGroup: false
      });

      const savedConv = await newConv.save();
      const populatedConv = await Conversation.findById(savedConv._id)
        .populate('participants', 'username email avatar isOnline lastSeen');
        
      return res.status(201).json(populatedConv);
    }

    // 2. Group Chat Handler
    if (!name) {
      return res.status(400).json({ message: 'Group name is required' });
    }

    // Include the creator in participants list
    const allParticipants = Array.from(new Set([req.user.id, ...participants]));

    const newGroup = new Conversation({
      participants: allParticipants,
      isGroup: true,
      name,
      avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(name)}`, // Unique group pattern avatar
      admin: req.user.id
    });

    const savedGroup = await newGroup.save();
    const populatedGroup = await Conversation.findById(savedGroup._id)
      .populate('participants', 'username email avatar isOnline lastSeen');

    res.status(201).json(populatedGroup);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error creating conversation' });
  }
});

// @route   POST /api/conversations/upload
// @desc    Upload file attachments (images, docs, files)
// @access  Private
router.post('/upload', auth, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Generate static server link for development uploads
    const fileUrl = `/uploads/${req.file.filename}`;
    
    // Classify file type
    const ext = path.extname(req.file.originalname).toLowerCase();
    let fileType = 'document';
    if (['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext)) {
      fileType = 'image';
    } else if (['.mp4', '.mov', '.avi', '.mkv'].includes(ext)) {
      fileType = 'video';
    } else if (['.mp3', '.wav', '.ogg'].includes(ext)) {
      fileType = 'audio';
    }

    // Calculate file size in KB/MB
    let fileSizeStr = `${(req.file.size / 1024).toFixed(1)} KB`;
    if (req.file.size > 1024 * 1024) {
      fileSizeStr = `${(req.file.size / (1024 * 1024)).toFixed(1)} MB`;
    }

    res.json({
      fileUrl,
      fileName: req.file.originalname,
      fileType,
      fileSize: fileSizeStr
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'File upload failed' });
  }
});

module.exports = router;
