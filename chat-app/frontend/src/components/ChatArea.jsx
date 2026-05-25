import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { 
  Send, Video, Smile, Paperclip, Loader2, 
  ChevronRight, SmilePlus, Image, FileText 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { useWebRTC } from '../context/WebRTCContext';
import MessageItem from './MessageItem';

const emojis = ['😂', '😍', '👍', '🔥', '🎉', '❤️', '👏', '🚀', '🤔', '🙌', '✨', '✔️'];

const ChatArea = ({ activeChat, messages, setMessages }) => {
  const { user } = useAuth();
  const { socket, isUserOnline } = useSocket();
  const { makeCall } = useWebRTC();

  const [text, setText] = useState('');
  const [typingUsers, setTypingUsers] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);

  const scrollRef = useRef(null);
  const fileInputRef = useRef(null);
  const typingTimer = useRef(null);

  const partner = activeChat.isGroup 
    ? null 
    : activeChat.participants.find((p) => p._id !== user?.id && p._id !== user?.username);

  const chatName = activeChat.isGroup ? activeChat.name : (partner?.username || 'Private Chat');
  const chatAvatar = activeChat.isGroup ? activeChat.avatar : (partner?.avatar || 'https://api.dicebear.com/7.x/initials/svg?seed=U');
  const isOnline = activeChat.isGroup ? false : (partner ? isUserOnline(partner._id) : false);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, typingUsers]);

  // Setup Socket message & typing indicators receivers
  useEffect(() => {
    if (!socket) return;

    // Receive message
    const handleNewMessage = (msg) => {
      if (msg.conversation === activeChat._id) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    // Receive typing indications
    const handleTypingStart = ({ conversationId, userId, username }) => {
      if (conversationId === activeChat._id && userId !== user?.id) {
        setTypingUsers((prev) => prev.includes(username) ? prev : [...prev, username]);
      }
    };

    const handleTypingStop = ({ conversationId, userId }) => {
      if (conversationId === activeChat._id) {
        // Find username if matching
        const typingPartner = activeChat.participants.find((p) => p._id === userId);
        if (typingPartner) {
          setTypingUsers((prev) => prev.filter((u) => u !== typingPartner.username));
        }
      }
    };

    socket.on('new-message', handleNewMessage);
    socket.on('typing-start', handleTypingStart);
    socket.on('typing-stop', handleTypingStop);

    // Join active conversation room
    socket.emit('join-room', activeChat._id);

    return () => {
      socket.off('new-message', handleNewMessage);
      socket.off('typing-start', handleTypingStart);
      socket.off('typing-stop', handleTypingStop);
      setTypingUsers([]);
    };
  }, [socket, activeChat, setMessages, user]);

  // Send text message handler
  const handleSend = (e) => {
    e.preventDefault();
    if (!text.trim() || !socket) return;

    socket.emit('send-message', {
      conversationId: activeChat._id,
      text: text.trim()
    });

    // Notify stop typing instantly on send
    socket.emit('typing-stop', { conversationId: activeChat._id });
    setText('');
  };

  // Typing state changes debouncer
  const handleTextChange = (e) => {
    setText(e.target.value);
    if (!socket) return;

    // Send typing-start
    socket.emit('typing-start', { conversationId: activeChat._id });

    // Clear previous timer
    if (typingTimer.current) clearTimeout(typingTimer.current);

    // Stop typing alert after 1500ms of inactivity
    typingTimer.current = setTimeout(() => {
      socket.emit('typing-stop', { conversationId: activeChat._id });
    }, 1500);
  };

  // Emoji selection inserter
  const handleEmojiSelect = (emoji) => {
    setText((prev) => prev + emoji);
    setShowEmojiPicker(false);
  };

  // File Upload handler via Multer
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !socket) return;

    setUploadingFile(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post('/api/conversations/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const { fileUrl, fileName, fileType, fileSize } = res.data;

      // Broadcast file attachment message via socket instantly
      socket.emit('send-message', {
        conversationId: activeChat._id,
        text: '',
        fileUrl,
        fileName,
        fileType,
        fileSize
      });

    } catch (err) {
      console.error(err);
      alert('Failed to send file. Attachment limit: 10MB.');
    } finally {
      setUploadingFile(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between bg-zinc-50 dark:bg-slate-900/30 h-full relative">
      
      {/* 1. Header Toolbar */}
      <div className="p-4 bg-white dark:bg-slate-950 border-b border-slate-200/50 dark:border-slate-800/50 flex justify-between items-center shadow-sm z-10 transition-colors duration-300">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={chatAvatar}
              alt={chatName}
              className="h-10 w-10 rounded-full border border-slate-200/50 dark:border-slate-800/50 bg-white"
            />
            {isOnline && (
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-950" />
            )}
          </div>

          <div className="text-left">
            <h3 className="text-xs font-extrabold text-slate-800 dark:text-white leading-normal">
              {chatName}
            </h3>
            <span className="block text-[10px] text-slate-400 mt-0.5 font-medium leading-none">
              {activeChat.isGroup 
                ? `${activeChat.participants.length} group members` 
                : isOnline 
                  ? 'Active now' 
                  : 'Offline'
              }
            </span>
          </div>
        </div>

        {/* Action Widgets */}
        <div className="flex items-center gap-2">
          {/* Video Calling (restricted to 1-on-1 private rooms) */}
          {!activeChat.isGroup && partner && (
            <button
              onClick={() => makeCall(partner._id, partner.username)}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-primary-50 dark:hover:bg-slate-900 text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-all duration-200 shadow-sm"
              title={`Call ${chatName}`}
            >
              <Video className="h-4.5 w-4.5" />
            </button>
          )}
        </div>
      </div>

      {/* 2. Messages Panel scroll grid */}
      <div className="flex-grow overflow-y-auto p-4 flex flex-col gap-4 max-h-[calc(100vh-14rem)] min-h-[300px]">
        {messages.map((msg) => (
          <MessageItem 
            key={msg._id} 
            message={msg} 
            isMe={msg.sender._id === user?.id || msg.sender === user?.id} // Check ID matching
            isGroup={activeChat.isGroup}
          />
        ))}

        {/* Live typing indicator bubble rendering */}
        {typingUsers.length > 0 && (
          <div className="self-start flex gap-2 items-center bg-slate-100 dark:bg-slate-900 p-3.5 rounded-3xl rounded-bl-none text-xs text-slate-400 border border-slate-200/20 dark:border-slate-800/20">
            <span className="font-bold text-slate-500 mr-1">{typingUsers.join(', ')}</span> is typing
            <div className="flex gap-1 items-center ml-2.5 h-3">
              <span className="h-1.5 w-1.5 rounded-full bg-slate-400 typing-dot" />
              <span className="h-1.5 w-1.5 rounded-full bg-slate-400 typing-dot" />
              <span className="h-1.5 w-1.5 rounded-full bg-slate-400 typing-dot" />
            </div>
          </div>
        )}

        <div ref={scrollRef} />
      </div>

      {/* 3. Text Message Input Toolbar */}
      <div className="p-4 bg-white dark:bg-slate-950 border-t border-slate-200/50 dark:border-slate-800/50 z-10 transition-colors duration-300 relative">
        
        {/* Emoji Selector Panel Modal */}
        {showEmojiPicker && (
          <div className="absolute bottom-20 left-4 glass p-3.5 rounded-2xl flex flex-wrap gap-2.5 max-w-[200px] z-30 animate-in fade-in slide-in-from-bottom-3 duration-200">
            {emojis.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => handleEmojiSelect(emoji)}
                className="text-lg hover:scale-125 transition-transform p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-900"
              >
                {emoji}
              </button>
            ))}
          </div>
        )}

        <form onSubmit={handleSend} className="flex gap-3 items-center">
          
          {/* File Picker attachment button */}
          <button
            type="button"
            onClick={() => fileInputRef.current.click()}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            title="Attach File/Image"
          >
            {uploadingFile ? (
              <Loader2 className="h-4.5 w-4.5 animate-spin text-primary-500" />
            ) : (
              <Paperclip className="h-4.5 w-4.5" />
            )}
          </button>
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
            accept="image/*,video/*,application/pdf,application/zip,.doc,.docx"
          />

          {/* Emoji button */}
          <button
            type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            title="Add Emoji"
          >
            <Smile className="h-4.5 w-4.5" />
          </button>

          {/* Text area input field */}
          <input
            type="text"
            value={text}
            onChange={handleTextChange}
            placeholder="Type your message..."
            className="glass-input flex-1 py-3 text-xs dark:bg-slate-900/30"
            maxLength="1000"
          />

          {/* Send Trigger */}
          <button
            type="submit"
            className="p-3 bg-primary-600 hover:bg-primary-500 text-white rounded-xl shadow-lg shadow-primary-500/20 hover:-translate-y-0.5 transition-all duration-200"
            title="Send Message"
          >
            <Send className="h-4 w-4 fill-white stroke-none" />
          </button>
        </form>
      </div>

    </div>
  );
};

export default ChatArea;
