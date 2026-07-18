import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Send, MessageSquare } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const DiscussionFeed = ({ messages, onSendMessage }) => {
  const { user } = useAuth();
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage('');
    }
  };

  return (
    <div className="glass-panel !bg-white/90 flex flex-col h-[700px] border border-white/40 rounded-2xl overflow-hidden shadow-lg">
      
      {/* Header */}
      <div className="p-4 border-b border-white/40 bg-white/50 backdrop-blur-md flex items-center gap-3">
        <div className="p-2 bg-primary-100 rounded-lg text-primary-600">
          <MessageSquare size={20} />
        </div>
        <div>
          <h3 className="font-bold text-text-main">Project Discussion</h3>
          <p className="text-xs text-text-muted">Coordinate with your team</p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-transparent to-white/20">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-text-muted opacity-50">
            <MessageSquare size={48} className="mb-4" />
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((msg, index) => {
            const isMe = msg.senderId === user?.userId;
            return (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={msg.id || index}
                className={`flex gap-4 ${isMe ? 'flex-row-reverse' : ''}`}
              >
                <div className="w-8 h-8 rounded-full overflow-hidden bg-sand-300 flex-shrink-0 mt-1">
                  {msg.senderAvatarUrl ? (
                    <img src={msg.senderAvatarUrl} alt={msg.senderName} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-text-main font-bold text-xs">
                      {msg.senderName.charAt(0)}
                    </div>
                  )}
                </div>
                
                <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[70%]`}>
                  <div className="flex items-baseline gap-2 mb-1 px-1">
                    <span className="text-xs font-bold text-text-main">{msg.senderName}</span>
                    <span className="text-[10px] text-text-light">
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div 
                    className={`px-4 py-3 rounded-2xl text-sm shadow-sm ${
                      isMe 
                        ? 'bg-primary-500 text-white rounded-tr-none' 
                        : 'bg-white border border-white/60 text-text-main rounded-tl-none'
                    }`}
                  >
                    {msg.message}
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white/60 backdrop-blur-md border-t border-white/40">
        <form onSubmit={handleSubmit} className="relative">
          <input 
            type="text" 
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Discuss project updates..." 
            className="w-full bg-white border border-white/60 rounded-xl py-3 pl-4 pr-12 text-sm text-text-main focus:outline-none focus:border-primary-500 shadow-sm transition-all"
          />
          <button 
            type="submit"
            disabled={!newMessage.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:hover:bg-primary-500"
          >
            <Send size={16} />
          </button>
        </form>
      </div>
      
    </div>
  );
};

export default DiscussionFeed;
