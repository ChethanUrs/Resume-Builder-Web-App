import React from 'react';
import { Paperclip, Download, ExternalLink, FileText, Image } from 'lucide-react';

const MessageItem = ({ message, isMe, isGroup }) => {
  const { sender = {}, text, fileUrl, fileName, fileType, fileSize, createdAt } = message;

  // Format timestamp: hh:mm
  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Helper static URL generator (prefixes local backend port 6000)
  const getFullUrl = (relativeUrl) => {
    if (!relativeUrl) return '';
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:6000';
    return relativeUrl.startsWith('http') ? relativeUrl : `${API_URL}${relativeUrl}`;
  };

  return (
    <div className={`flex gap-3 max-w-[85%] sm:max-w-[70%] items-end ${
      isMe ? 'self-end flex-row-reverse' : 'self-start text-left'
    }`}>
      
      {/* 1. Profile Avatar (not rendered for self messages to clean layouts) */}
      {!isMe && (
        <img
          src={sender.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=U`}
          alt={sender.username}
          className="h-8 w-8 rounded-full border border-slate-200/50 dark:border-slate-800/50 bg-white shadow-sm shrink-0 mb-1"
        />
      )}

      {/* 2. Text / Media Content Bubble */}
      <div className="flex flex-col space-y-1">
        {/* Render sender's name in group chats if not isMe */}
        {!isMe && isGroup && (
          <span className="text-[10px] font-bold text-slate-400 pl-2 leading-none">
            {sender.username}
          </span>
        )}

        <div className={`p-3.5 rounded-3xl text-sm relative group flex flex-col gap-2 ${
          isMe
            ? 'bg-primary-600 text-white rounded-br-none shadow-md shadow-primary-500/10'
            : 'bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-bl-none border border-slate-200/30 dark:border-slate-800/30'
        }`}>
          {/* File Attachments Renders */}
          {fileUrl && (
            <div className="rounded-xl overflow-hidden max-w-full">
              {fileType === 'image' ? (
                /* Shared Image Card */
                <a 
                  href={getFullUrl(fileUrl)} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="block relative overflow-hidden group/img border border-black/5 dark:border-white/5 rounded-xl"
                >
                  <img
                    src={getFullUrl(fileUrl)}
                    alt={fileName || 'Shared Image'}
                    className="max-h-[200px] w-full object-cover group-hover/img:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center text-white text-xs gap-1 font-semibold">
                    <ExternalLink className="h-4 w-4" /> Open Large
                  </div>
                </a>
              ) : (
                /* Other shared file format card (PDF, doc, zip, etc.) */
                <div className={`flex items-center gap-3 p-2.5 rounded-xl border text-xs font-semibold ${
                  isMe 
                    ? 'bg-primary-700/50 border-primary-500/30 text-white' 
                    : 'bg-slate-200/50 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                }`}>
                  <div className={`p-2 rounded-lg ${isMe ? 'bg-primary-800' : 'bg-slate-100 dark:bg-slate-900'}`}>
                    <FileText className="h-4.5 w-4.5 text-primary-500" />
                  </div>
                  
                  <div className="text-left min-w-0 flex-grow">
                    <span className="block font-bold truncate leading-normal pr-1 max-w-[120px] sm:max-w-[180px]">{fileName}</span>
                    <span className="block text-[10px] text-slate-400 dark:text-slate-500 leading-none mt-0.5">{fileSize}</span>
                  </div>

                  <a
                    href={getFullUrl(fileUrl)}
                    download={fileName}
                    target="_blank"
                    rel="noreferrer"
                    className={`p-1.5 rounded-lg border transition-colors ${
                      isMe 
                        ? 'border-primary-500 hover:bg-primary-700 text-white' 
                        : 'border-slate-350 dark:border-slate-800 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400'
                    }`}
                    title="Download Attachment"
                  >
                    <Download className="h-3.5 w-3.5" />
                  </a>
                </div>
              )}
            </div>
          )}

          {/* Text block */}
          {text && (
            <p className="whitespace-pre-line leading-relaxed break-words text-left pr-2">{text}</p>
          )}

          {/* Timestamp Indicator */}
          <span className={`block text-[8px] self-end leading-none font-bold uppercase tracking-wider select-none pt-1 ${
            isMe ? 'text-primary-200' : 'text-slate-400 dark:text-slate-500'
          }`}>
            {formatTime(createdAt)}
          </span>
        </div>
      </div>

    </div>
  );
};

export default MessageItem;
