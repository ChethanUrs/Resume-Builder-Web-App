import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  MessageSquare, Loader2, Sparkles, Video, 
  Paperclip, Users, AlertCircle 
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import ChatArea from '../components/ChatArea';
import VideoCallModal from '../components/VideoCallModal';
import CreateGroupModal from '../components/CreateGroupModal';
import { useSocket } from '../context/SocketContext';

const ChatDashboard = () => {
  const { socket } = useSocket();

  // States
  const [conversations, setConversations] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingChats, setLoadingChats] = useState(true);
  const [error, setError] = useState('');
  
  // Modals state
  const [showGroupModal, setShowGroupModal] = useState(false);

  // Fetch active conversations list
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoadingChats(true);
        const res = await axios.get('/api/conversations');
        setConversations(res.data);
        
        // Register active conversation rooms for instant WebSocket deliveries
        if (socket && res.data.length > 0) {
          const roomIds = res.data.map((c) => c._id);
          socket.emit('join-rooms', roomIds);
        }
      } catch (err) {
        console.error(err);
        setError('Failed to sync conversations list.');
      } finally {
        setLoadingChats(false);
      }
    };

    fetchConversations();
  }, [socket]);

  // Fetch message logs when selecting a chat
  useEffect(() => {
    if (!activeChat) {
      setMessages([]);
      return;
    }

    const fetchMessages = async () => {
      try {
        const res = await axios.get(`/api/conversations/${activeChat._id}/messages`);
        setMessages(res.data);
      } catch (err) {
        console.error('Error fetching chat messages history:', err);
      }
    };

    fetchMessages();
  }, [activeChat]);

  // Listen to incoming messages globally to update the sidebar's "lastMessage" text
  useEffect(() => {
    if (!socket) return;

    const handleMessageIndicator = (msg) => {
      setConversations((prev) => {
        const updated = prev.map((c) => {
          if (c._id === msg.conversation) {
            return {
              ...c,
              lastMessage: msg,
              updatedAt: msg.createdAt
            };
          }
          return c;
        });
        
        // Sort conversations: most recently updated first
        return [...updated].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
      });
    };

    socket.on('new-message', handleMessageIndicator);
    return () => {
      socket.off('new-message', handleMessageIndicator);
    };
  }, [socket]);

  // Handle group created
  const handleGroupCreated = (newGroup) => {
    setConversations((prev) => [newGroup, ...prev]);
    setActiveChat(newGroup);
    
    // Register the new group chat room immediately via Socket
    if (socket) {
      socket.emit('join-room', newGroup._id);
    }
  };

  return (
    <div className="flex h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300 overflow-hidden relative">
      
      {/* Decors background */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-primary-600/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none" />

      {/* Unified Sidebar & Main workspace grid */}
      <div className="flex-grow flex h-full z-10 relative">
        {loadingChats ? (
          <div className="flex flex-col items-center justify-center flex-1 gap-3">
            <Loader2 className="h-10 w-10 text-primary-500 animate-spin" />
            <span className="text-xs text-slate-400 font-medium">Syncing conversations history...</span>
          </div>
        ) : (
          <>
            <Sidebar
              conversations={conversations}
              setConversations={setConversations}
              activeChat={activeChat}
              setActiveChat={setActiveChat}
              onOpenGroupModal={() => setShowGroupModal(true)}
            />

            {activeChat ? (
              <ChatArea 
                activeChat={activeChat} 
                messages={messages} 
                setMessages={setMessages} 
              />
            ) : (
              /* Blank slate dashboard workspace */
              <div className="hidden md:flex flex-col justify-center items-center flex-grow p-12 bg-zinc-50 dark:bg-slate-900/10 text-center select-none space-y-5 transition-colors duration-300">
                <div className="p-5 bg-primary-50 dark:bg-primary-950/40 text-primary-500 rounded-3xl animate-pulse-slow">
                  <MessageSquare className="h-10 w-10" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-xl font-extrabold tracking-tight font-display text-slate-800 dark:text-white">
                    Select a conversation
                  </h2>
                  <p className="text-xs text-slate-400 dark:text-slate-500 max-w-[280px] leading-relaxed mx-auto">
                    Choose a contact from the sidebar or start a group room to exchange instant messages, shared files, and direct WebRTC calls.
                  </p>
                </div>

                {/* Features highlights badge panel */}
                <div className="grid grid-cols-2 gap-3 max-w-sm pt-6 border-t border-slate-200/50 dark:border-slate-800/50 text-left">
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-semibold">
                    <Sparkles className="h-4 w-4 text-primary-500" /> Real-time status
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-semibold">
                    <Video className="h-4 w-4 text-primary-500" /> WebRTC Calling
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-semibold">
                    <Paperclip className="h-4 w-4 text-primary-500" /> File sharing
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-semibold">
                    <Users className="h-4 w-4 text-primary-500" /> Group channels
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* 4. Video calling signaling Modal overlay */}
      <VideoCallModal />

      {/* 5. Group creation selection List */}
      <CreateGroupModal
        isOpen={showGroupModal}
        onClose={() => setShowGroupModal(false)}
        onGroupCreated={handleGroupCreated}
      />

    </div>
  );
};

export default ChatDashboard;
