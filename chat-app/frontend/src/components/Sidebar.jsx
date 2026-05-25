import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Search, Users, LogOut, Sun, Moon, 
  MessageSquare, Loader2, Plus, Wifi 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useSocket } from '../context/SocketContext';

const Sidebar = ({ conversations, setConversations, activeChat, setActiveChat, onOpenGroupModal }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { isUserOnline } = useSocket();

  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loadingSearch, setLoadingSearch] = useState(false);

  // Search users API
  useEffect(() => {
    if (!search.trim()) {
      setSearchResults([]);
      return;
    }

    const searchUsers = async () => {
      setLoadingSearch(true);
      try {
        const res = await axios.get(`/api/auth/users?search=${search}`);
        setSearchResults(res.data);
      } catch (err) {
        console.error('Error searching users:', err);
      } finally {
        setLoadingSearch(false);
      }
    };

    const delayTimer = setTimeout(() => {
      searchUsers();
    }, 450);

    return () => clearTimeout(delayTimer);
  }, [search]);

  // Click handler: Start/Load 1-on-1 chat
  const handleSelectContact = async (contactUser) => {
    try {
      const res = await axios.post('/api/conversations', {
        isGroup: false,
        recipientId: contactUser._id
      });
      
      const newChat = res.data;
      
      // Add to local lists if not present
      if (!conversations.some((c) => c._id === newChat._id)) {
        setConversations((prev) => [newChat, ...prev]);
      }
      
      setActiveChat(newChat);
      setSearch(''); // Clear search
    } catch (err) {
      console.error('Error starting conversation:', err);
    }
  };

  // Helper date formatter
  const formatTime = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="w-full md:w-[320px] lg:w-[360px] border-r border-slate-200/50 dark:border-slate-800/50 flex flex-col justify-between bg-white dark:bg-slate-950 transition-colors duration-300 h-full">
      
      {/* 1. Header Profile & Settings bar */}
      <div className="p-4 border-b border-slate-200/50 dark:border-slate-800/50 flex justify-between items-center bg-slate-50 dark:bg-slate-950/20">
        <div className="flex items-center gap-2.5">
          <img
            src={user?.avatar}
            alt={user?.username}
            className="h-9 w-9 rounded-full border border-slate-200 dark:border-slate-800 bg-white shadow-sm"
          />
          <div className="text-left">
            <span className="block text-xs font-bold text-slate-800 dark:text-white leading-tight">
              {user?.username}
            </span>
            <span className="inline-flex items-center gap-1 text-[9px] text-emerald-500 font-bold uppercase tracking-wider leading-none mt-0.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span>Online</span>
            </span>
          </div>
        </div>

        {/* Setting Actions */}
        <div className="flex items-center gap-2">
          {/* Create Group Button */}
          <button
            onClick={onOpenGroupModal}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            title="Create Group Chat"
          >
            <Plus className="h-4 w-4" />
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            title="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          {/* Logout Button */}
          <button
            onClick={logout}
            className="p-2 rounded-xl border border-red-100 dark:border-red-950/30 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
            title="Logout"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* 2. Chat Search Directory */}
      <div className="p-3 border-b border-slate-200/30 dark:border-slate-850/30 space-y-2">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search contacts or start chat..."
            className="glass-input pl-9 py-2 w-full text-xs dark:bg-slate-900/30"
          />
        </div>
      </div>

      {/* 3. Conversations or Contacts list */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {search.trim() ? (
          /* Search Directory results */
          <div className="space-y-1">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2 mb-2">Global Directory</h4>
            {loadingSearch ? (
              <div className="flex items-center justify-center py-6 gap-2">
                <Loader2 className="h-4 w-4 text-primary-500 animate-spin" />
                <span className="text-xs text-slate-400">Searching...</span>
              </div>
            ) : searchResults.length === 0 ? (
              <div className="text-center py-6 text-xs text-slate-400">No matching users.</div>
            ) : (
              searchResults.map((contact) => (
                <div
                  key={contact._id}
                  onClick={() => handleSelectContact(contact)}
                  className="flex items-center gap-3 p-2.5 rounded-xl cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors text-left"
                >
                  <div className="relative">
                    <img
                      src={contact.avatar}
                      alt={contact.username}
                      className="h-9 w-9 rounded-full border border-slate-200 dark:border-slate-800"
                    />
                    {isUserOnline(contact._id) && (
                      <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-950" />
                    )}
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-slate-800 dark:text-white leading-normal">
                      {contact.username}
                    </span>
                    <span className="block text-[9px] text-slate-400 leading-none mt-0.5">
                      {contact.email}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          /* Active Chat rooms list */
          <div className="space-y-0.5">
            {conversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center text-slate-400 px-4 space-y-2">
                <MessageSquare className="h-8 w-8 text-slate-350 dark:text-slate-700 animate-bounce" />
                <span className="text-xs">No active chats</span>
                <span className="text-[10px] text-slate-400 leading-relaxed max-w-[200px]">
                  Use the search bar above to look up users and send a message!
                </span>
              </div>
            ) : (
              conversations.map((conv) => {
                const isActive = activeChat?._id === conv._id;
                
                // For 1-on-1 chats, identify the partner participant
                const partner = conv.isGroup 
                  ? null 
                  : conv.participants.find((p) => p._id !== user?.id && p._id !== user?.username); // Fallback standard partner identify
                
                const chatName = conv.isGroup ? conv.name : (partner?.username || 'Private Chat');
                const chatAvatar = conv.isGroup ? conv.avatar : (partner?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=U`);
                const isPartnerOnline = conv.isGroup ? false : (partner ? isUserOnline(partner._id) : false);

                return (
                  <div
                    key={conv._id}
                    onClick={() => setActiveChat(conv)}
                    className={`flex items-center justify-between p-3 rounded-2xl cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900/60 transition-all duration-150 ${
                      isActive 
                        ? 'bg-primary-50 dark:bg-primary-950/20 border-l-4 border-primary-500 rounded-l-none' 
                        : ''
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      {/* Avatar Wrapper */}
                      <div className="relative shrink-0">
                        <img
                          src={chatAvatar}
                          alt={chatName}
                          className="h-10 w-10 rounded-full border border-slate-200/50 dark:border-slate-800/50 bg-white"
                        />
                        {isPartnerOnline && (
                          <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-950" />
                        )}
                      </div>

                      {/* Info Text */}
                      <div className="text-left min-w-0 flex-1">
                        <span className={`block text-xs font-bold leading-normal truncate ${
                          isActive ? 'text-primary-600 dark:text-primary-400' : 'text-slate-800 dark:text-white'
                        }`}>
                          {chatName}
                        </span>
                        
                        {/* Last Message text or typing indicator */}
                        <span className="block text-[10px] text-slate-400 truncate mt-0.5">
                          {conv.lastMessage?.text || (conv.lastMessage?.fileUrl ? 'Sent an attachment' : 'Start conversation...')}
                        </span>
                      </div>
                    </div>

                    {/* Metadata column */}
                    <div className="text-right pl-2 shrink-0">
                      <span className="block text-[8px] text-slate-400 font-bold uppercase">
                        {formatTime(conv.updatedAt)}
                      </span>
                    </div>

                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

    </div>
  );
};

export default Sidebar;
