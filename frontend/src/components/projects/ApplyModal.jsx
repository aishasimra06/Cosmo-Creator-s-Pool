import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Loader2 } from 'lucide-react';
import api from '../../utils/api';

const ApplyModal = ({ isOpen, onClose, projectId, projectRoles, onApplySuccess }) => {
  const [formData, setFormData] = useState({
    requestedRole: '',
    message: '',
    portfolioLink: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.requestedRole || !formData.message) {
      setError('Please select a role and provide a message.');
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      await api.post(`/projects/${projectId}/apply`, formData);
      onApplySuccess();
      onClose();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to submit application. You might have already applied.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="glass-panel w-full max-w-lg max-h-[90vh] flex flex-col relative z-10"
          >
            {/* Header */}
            <div className="p-6 md:px-8 md:pt-8 md:pb-4 border-b border-white/20 flex justify-between items-center shrink-0 bg-white/5">
              <h2 className="text-2xl font-bold text-text-main">Apply to Collaborate</h2>
              <button onClick={onClose} className="text-text-muted hover:text-text-main transition-colors">
                <X size={24} />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="p-6 md:p-8 overflow-y-auto flex-1">
              {error && <div className="p-3 mb-6 bg-red-100 text-red-600 rounded-lg text-sm">{error}</div>}

              <form id="apply-form" onSubmit={handleSubmit} className="space-y-5">
              
              <div>
                <label className="block text-sm font-semibold text-text-main mb-2">Desired Role</label>
                <select 
                  name="requestedRole" 
                  value={formData.requestedRole} 
                  onChange={handleChange} 
                  className="glass-input appearance-none" 
                  required
                >
                  <option value="">Select a role...</option>
                  {projectRoles && projectRoles.length > 0 ? (
                    projectRoles.map((role, idx) => (
                      <option key={idx} value={role}>{role}</option>
                    ))
                  ) : (
                    <option value="General Collaborator">General Collaborator</option>
                  )}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-text-main mb-2">Why do you want to join?</label>
                <textarea 
                  name="message" 
                  value={formData.message} 
                  onChange={handleChange} 
                  className="glass-input min-h-[120px]" 
                  placeholder="Share why you're a great fit for this project..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-text-main mb-2">Portfolio/Reference Link (Optional)</label>
                <input 
                  type="url" 
                  name="portfolioLink" 
                  value={formData.portfolioLink} 
                  onChange={handleChange} 
                  className="glass-input" 
                  placeholder="https://yourportfolio.com" 
                />
              </div>

              </form>
            </div>

            {/* Fixed Footer */}
            <div className="p-6 md:px-8 md:pb-8 md:pt-4 border-t border-white/20 flex justify-end gap-3 shrink-0 bg-white/5">
              <button type="button" onClick={onClose} className="btn-cinematic px-6 py-2">Cancel</button>
              <button type="submit" form="apply-form" disabled={loading} className="btn-cinematic-primary px-8 py-2 flex items-center gap-2">
                {loading ? <Loader2 className="animate-spin" size={18} /> : <><Send size={18} /> Send Application</>}
              </button>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ApplyModal;
