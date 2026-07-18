import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Megaphone, Plus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const ProjectUpdates = ({ updates, onPostUpdate, isOwner }) => {
  const [isPosting, setIsPosting] = useState(false);
  const [newUpdate, setNewUpdate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newUpdate.trim()) {
      onPostUpdate(newUpdate);
      setNewUpdate('');
      setIsPosting(false);
    }
  };

  return (
    <div className="glass-panel !bg-white/80 p-6 rounded-2xl border border-white/40">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-sm font-bold text-text-main uppercase tracking-wider flex items-center gap-2">
          <Megaphone size={18} className="text-accent-500" /> Official Updates
        </h3>
        {isOwner && !isPosting && (
          <button 
            onClick={() => setIsPosting(true)}
            className="p-1.5 bg-primary-100 text-primary-600 rounded-md hover:bg-primary-200 transition-colors"
          >
            <Plus size={16} />
          </button>
        )}
      </div>

      {isPosting && (
        <motion.form 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mb-6 bg-white p-4 rounded-xl shadow-sm border border-white/60"
          onSubmit={handleSubmit}
        >
          <textarea 
            value={newUpdate}
            onChange={(e) => setNewUpdate(e.target.value)}
            placeholder="Post a milestone or announcement..."
            className="w-full bg-light-bg border border-white/60 rounded-lg p-3 text-sm text-text-main focus:outline-none focus:border-primary-400 resize-none h-24 mb-3"
          />
          <div className="flex justify-end gap-2">
            <button 
              type="button" 
              onClick={() => setIsPosting(false)}
              className="px-3 py-1.5 text-xs font-medium text-text-muted hover:text-text-main"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={!newUpdate.trim()}
              className="px-4 py-1.5 text-xs font-medium bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50"
            >
              Post Update
            </button>
          </div>
        </motion.form>
      )}

      <div className="space-y-4">
        {updates.length === 0 ? (
          <div className="text-center py-8 text-text-muted opacity-60">
            <Megaphone size={32} className="mx-auto mb-2" />
            <p className="text-sm">No official updates yet.</p>
          </div>
        ) : (
          updates.map((update, index) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              key={update.id}
              className="p-4 bg-white/60 rounded-xl border border-white/80 shadow-sm relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-accent-400"></div>
              <p className="text-sm text-text-main mb-3 leading-relaxed">
                {update.content}
              </p>
              <div className="flex items-center justify-between text-xs text-text-light">
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-full overflow-hidden bg-sand-300">
                    {update.authorAvatarUrl ? (
                      <img src={update.authorAvatarUrl} alt={update.authorName} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-text-main">
                        {update.authorName.charAt(0)}
                      </div>
                    )}
                  </div>
                  <span>{update.authorName}</span>
                </div>
                <span>{new Date(update.createdAt).toLocaleDateString()}</span>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProjectUpdates;
