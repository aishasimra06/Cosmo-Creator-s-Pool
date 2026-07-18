import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Loader2, Save } from 'lucide-react';
import api from '../../utils/api';

const PortfolioModal = ({ isOpen, onClose, initialData, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    projectUrl: '',
    githubUrl: '',
    tools: '',
    category: ''
  });
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        projectUrl: initialData.projectUrl || '',
        githubUrl: initialData.githubUrl || '',
        tools: initialData.tools || '',
        category: initialData.category || ''
      });
      setThumbnailFile(null);
    } else {
      setFormData({
        title: '',
        description: '',
        projectUrl: '',
        githubUrl: '',
        tools: '',
        category: ''
      });
      setThumbnailFile(null);
    }
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setThumbnailFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const payload = new FormData();
    payload.append('data', new Blob([JSON.stringify(formData)], { type: 'application/json' }));
    if (thumbnailFile) {
      payload.append('thumbnail', thumbnailFile);
    }

    try {
      if (initialData?.id) {
        await api.put(`/portfolios/${initialData.id}`, payload, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await api.post('/portfolios', payload, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to save portfolio item.');
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
            className="glass-panel w-full max-w-2xl max-h-[90vh] flex flex-col relative z-10"
          >
            {/* Header */}
            <div className="p-6 md:px-8 md:pt-8 md:pb-4 border-b border-white/20 flex justify-between items-center shrink-0 bg-white/5">
              <h2 className="text-2xl font-bold text-text-main">{initialData ? 'Edit Work' : 'Add New Work'}</h2>
              <button onClick={onClose} className="text-text-muted hover:text-text-main transition-colors">
                <X size={24} />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="p-6 md:p-8 overflow-y-auto flex-1">
              {error && <div className="p-3 mb-6 bg-red-100 text-red-600 rounded-lg text-sm">{error}</div>}

              <form id="portfolio-form" onSubmit={handleSubmit} className="space-y-6">
              
              {/* Thumbnail Upload */}
              <div>
                <label className="block text-sm font-semibold text-text-main mb-2">Thumbnail Image</label>
                <div className="w-full aspect-video rounded-xl border-2 border-dashed border-white/40 bg-white/10 flex flex-col items-center justify-center relative overflow-hidden group cursor-pointer hover:bg-white/20 transition-colors">
                  {thumbnailFile ? (
                    <img src={URL.createObjectURL(thumbnailFile)} alt="preview" className="w-full h-full object-cover" />
                  ) : initialData?.thumbnailUrl ? (
                    <img src={initialData.thumbnailUrl} alt="preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center p-6 text-text-muted">
                      <Upload size={32} className="mx-auto mb-2 opacity-50" />
                      <p className="text-sm font-medium">Click to upload image</p>
                      <p className="text-xs opacity-70">PNG, JPG up to 10MB</p>
                    </div>
                  )}
                  <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-text-main mb-1">Project Title</label>
                  <input type="text" name="title" value={formData.title} onChange={handleChange} className="glass-input" required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-text-main mb-1">Category / Type</label>
                  <input type="text" name="category" value={formData.category} onChange={handleChange} className="glass-input" placeholder="e.g. Web App, Branding" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-text-main mb-1">Description</label>
                <textarea name="description" value={formData.description} onChange={handleChange} className="glass-input min-h-[100px]" placeholder="Briefly describe the project..." />
              </div>

              <div>
                <label className="block text-sm font-semibold text-text-main mb-1">Tools / Technologies Used</label>
                <input type="text" name="tools" value={formData.tools} onChange={handleChange} className="glass-input" placeholder="e.g. Figma, React, Spring Boot" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-text-main mb-1">Live Project URL</label>
                  <input type="url" name="projectUrl" value={formData.projectUrl} onChange={handleChange} className="glass-input" placeholder="https://" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-text-main mb-1">Source Code / GitHub URL</label>
                  <input type="url" name="githubUrl" value={formData.githubUrl} onChange={handleChange} className="glass-input" placeholder="https://" />
                </div>
              </div>

              </form>
            </div>

            {/* Fixed Footer */}
            <div className="p-6 md:px-8 md:pb-8 md:pt-4 border-t border-white/20 flex justify-end gap-3 shrink-0 bg-white/5">
              <button type="button" onClick={onClose} className="btn-cinematic px-6 py-2">Cancel</button>
              <button type="submit" form="portfolio-form" disabled={loading} className="btn-cinematic-primary px-8 py-2 flex items-center gap-2">
                {loading ? <Loader2 className="animate-spin" size={18} /> : <><Save size={18} /> Save Portfolio</>}
              </button>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PortfolioModal;
