import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, X, Search, Loader2 } from 'lucide-react';

const CreateGroupModal = ({ isOpen, onClose, onGroupCreated }) => {
  const [groupName, setGroupName] = useState('');
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Fetch users when modal opens
  useEffect(() => {
    if (!isOpen) return;

    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/api/auth/users?search=${search}`);
        setUsers(res.data);
      } catch (err) {
        console.error('Error fetching search users:', err);
      } finally {
        setLoading(false);
      }
    };

    // Debounce search
    const delayTimer = setTimeout(() => {
      fetchUsers();
    }, 400);

    return () => clearTimeout(delayTimer);
  }, [search, isOpen]);

  // Toggle user selection
  const handleToggleUser = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!groupName.trim()) {
      alert('Please enter a group name');
      return;
    }
    if (selectedUsers.length === 0) {
      alert('Please select at least one member to join the group');
      return;
    }

    setSubmitting(true);
    try {
      const res = await axios.post('/api/conversations', {
        isGroup: true,
        name: groupName.trim(),
        participants: selectedUsers
      });
      onGroupCreated(res.data);
      // Reset State
      setGroupName('');
      setSelectedUsers([]);
      setSearch('');
      onClose();
    } catch (err) {
      console.error(err);
      alert('Failed to create group chat.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4">
      
      {/* Create Group Panel */}
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden relative max-h-[85vh] flex flex-col justify-between">
        
        {/* Header Title */}
        <div className="p-5 border-b border-slate-200/50 dark:border-slate-850/50 flex justify-between items-center bg-slate-50 dark:bg-slate-950/20">
          <div className="flex items-center gap-2 text-slate-800 dark:text-white">
            <Users className="h-5 w-5 text-primary-500" />
            <h3 className="font-extrabold text-sm tracking-tight font-display">Create Group Chat</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden p-5 space-y-4">
          {/* 1. Group Name Input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-500">Group Room Name</label>
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="e.g. Design Team, Friends Reunion"
              className="glass-input dark:bg-slate-950/40"
              maxLength="30"
              required
            />
          </div>

          {/* 2. Members Search Section */}
          <div className="flex-1 flex flex-col min-h-[220px] overflow-hidden space-y-3 pt-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-slate-500">Select Members</label>
              <span className="text-[10px] bg-primary-50 dark:bg-primary-950/40 text-primary-500 px-2 py-0.5 rounded-md font-bold">
                {selectedUsers.length} selected
              </span>
            </div>

            {/* Search Input bar */}
            <div className="relative">
              <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search username or email..."
                className="glass-input pl-11 w-full dark:bg-slate-950/40"
              />
            </div>

            {/* Search User list */}
            <div className="flex-grow overflow-y-auto pr-1 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl p-2 bg-slate-50/50 dark:bg-slate-950/10 space-y-1 max-h-[200px]">
              {loading ? (
                <div className="flex items-center justify-center py-8 gap-2">
                  <Loader2 className="h-4.5 w-4.5 text-primary-500 animate-spin" />
                  <span className="text-xs text-slate-400 font-medium">Searching contacts...</span>
                </div>
              ) : users.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-400">No other users found.</div>
              ) : (
                users.map((item) => {
                  const isChecked = selectedUsers.includes(item._id);
                  return (
                    <div
                      key={item._id}
                      onClick={() => handleToggleUser(item._id)}
                      className={`flex items-center justify-between p-2 rounded-xl cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800/40 transition-colors ${
                        isChecked ? 'bg-primary-50/20 dark:bg-primary-950/10' : ''
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <img
                          src={item.avatar}
                          alt={item.username}
                          className="h-8 w-8 rounded-full border border-slate-200 dark:border-slate-800"
                        />
                        <div className="text-left">
                          <span className="block text-xs font-bold text-slate-800 dark:text-white leading-normal">
                            {item.username}
                          </span>
                          <span className="block text-[10px] text-slate-400 leading-none">
                            {item.email}
                          </span>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}} // Controlled by div click
                        className="rounded border-slate-300 text-primary-600 focus:ring-primary-500 h-4 w-4"
                      />
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* 3. Action Submits */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 py-3 mt-2 rounded-2xl bg-primary-600 hover:bg-primary-700 disabled:bg-primary-500/50 text-white font-bold text-sm shadow-lg shadow-primary-500/25 transition-all duration-200 hover:-translate-y-0.5"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4.5 w-4.5 animate-spin" />
                <span>Creating Group...</span>
              </>
            ) : (
              <span>Create Group</span>
            )}
          </button>
        </form>

      </div>

    </div>
  );
};

export default CreateGroupModal;
