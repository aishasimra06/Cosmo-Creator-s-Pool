import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, FileText, Loader2 } from 'lucide-react';
import api from '../../utils/api';

const EditProfileModal = ({ isOpen, onClose, profile, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: profile?.name || '',
    title: profile?.title || '',
    bio: profile?.bio || '',
    location: profile?.location || '',
    experienceLevel: profile?.experienceLevel || '',
    websiteUrl: profile?.websiteUrl || '',
    linkedinUrl: profile?.linkedinUrl || '',
    githubUrl: profile?.githubUrl || '',
    instagramUrl: profile?.instagramUrl || '',
  });

  const [avatarFile, setAvatarFile] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setAvatarFile(e.target.files[0]);
    }
  };

  const handleResumeChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Update basic profile details
      await api.put(`/users/${profile.id}`, formData);

      // Upload avatar if changed
      if (avatarFile) {
        const avatarData = new FormData();
        avatarData.append('file', avatarFile);
        await api.post(`/users/${profile.id}/avatar`, avatarData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      // Upload resume if changed
      if (resumeFile) {
        const resumeData = new FormData();
        resumeData.append('file', resumeFile);
        await api.post(`/users/${profile.id}/resume`, resumeData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      onUpdate(); // Trigger refresh on parent
      onClose();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to update profile');
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
              <h2 className="text-2xl font-bold text-text-main">Edit Profile</h2>
              <button onClick={onClose} className="text-text-muted hover:text-text-main transition-colors">
                <X size={24} />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="p-6 md:p-8 overflow-y-auto flex-1">
              {error && <div className="p-3 mb-6 bg-red-100 text-red-600 rounded-lg text-sm">{error}</div>}

              <form id="edit-profile-form" onSubmit={handleSubmit} className="space-y-6">
              
              {/* Media Uploads */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-text-main mb-2">Profile Image</label>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl bg-white/50 border border-white flex items-center justify-center overflow-hidden">
                      {avatarFile ? (
                        <img src={URL.createObjectURL(avatarFile)} alt="preview" className="w-full h-full object-cover" />
                      ) : profile?.avatarUrl ? (
                        <img src={profile.avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                      ) : (
                        <Upload size={20} className="text-text-light" />
                      )}
                    </div>
                    <input type="file" id="avatar" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                    <label htmlFor="avatar" className="btn-cinematic px-4 py-2 cursor-pointer text-sm">
                      Upload New
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-text-main mb-2">Resume / CV (PDF)</label>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl bg-white/50 border border-white flex items-center justify-center text-primary-500">
                      <FileText size={24} />
                    </div>
                    <div className="flex flex-col gap-2">
                      <input type="file" id="resume" accept=".pdf" onChange={handleResumeChange} className="hidden" />
                      <label htmlFor="resume" className="btn-cinematic px-4 py-2 cursor-pointer text-sm text-center">
                        {resumeFile ? 'Selected' : 'Upload PDF'}
                      </label>
                      {resumeFile && <span className="text-xs text-text-muted truncate max-w-[120px]">{resumeFile.name}</span>}
                    </div>
                  </div>
                </div>
              </div>

              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-text-main mb-1">Full Name</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} className="glass-input" required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-text-main mb-1">Professional Title</label>
                  <input type="text" name="title" value={formData.title} onChange={handleChange} className="glass-input" placeholder="e.g. Senior UX Designer" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-text-main mb-1">Location</label>
                  <input type="text" name="location" value={formData.location} onChange={handleChange} className="glass-input" placeholder="e.g. San Francisco, CA" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-text-main mb-1">Experience Level</label>
                  <select name="experienceLevel" value={formData.experienceLevel} onChange={handleChange} className="glass-input appearance-none">
                    <option value="">Select Level</option>
                    <option value="Entry Level">Entry Level</option>
                    <option value="Mid Level">Mid Level</option>
                    <option value="Senior">Senior</option>
                    <option value="Lead/Director">Lead/Director</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-text-main mb-1">Bio</label>
                <textarea name="bio" value={formData.bio} onChange={handleChange} className="glass-input min-h-[100px]" placeholder="Tell us about your creative journey..." />
              </div>

              {/* Social Links */}
              <div>
                <h3 className="text-sm font-bold text-text-main mb-3">Social & External Links</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input type="url" name="websiteUrl" value={formData.websiteUrl} onChange={handleChange} className="glass-input" placeholder="Portfolio Website URL" />
                  <input type="url" name="linkedinUrl" value={formData.linkedinUrl} onChange={handleChange} className="glass-input" placeholder="LinkedIn URL" />
                  <input type="url" name="githubUrl" value={formData.githubUrl} onChange={handleChange} className="glass-input" placeholder="GitHub URL" />
                  <input type="url" name="instagramUrl" value={formData.instagramUrl} onChange={handleChange} className="glass-input" placeholder="Instagram URL" />
                </div>
              </div>
            </form>
            </div>

            {/* Fixed Footer */}
            <div className="p-6 md:px-8 md:pb-8 md:pt-4 border-t border-white/20 flex justify-end gap-3 shrink-0 bg-white/5">
              <button type="button" onClick={onClose} className="btn-cinematic px-6 py-2">Cancel</button>
              <button type="submit" form="edit-profile-form" disabled={loading} className="btn-cinematic-primary px-8 py-2">
                {loading ? <Loader2 className="animate-spin" size={20} /> : 'Save Changes'}
              </button>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default EditProfileModal;
