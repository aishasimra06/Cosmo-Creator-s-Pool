import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, XCircle, Loader2, ExternalLink, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';

const ManageApplicantsModal = ({ isOpen, onClose, projectId }) => {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && projectId) {
      fetchApplicants();
    }
  }, [isOpen, projectId]);

  const fetchApplicants = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/projects/${projectId}/applicants`);
      setApplicants(response.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load applicants.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (requestId, newStatus) => {
    try {
      await api.put(`/projects/${projectId}/applications/${requestId}/status?status=${newStatus}`);
      setApplicants(applicants.map(app => 
        app.id === requestId ? { ...app, status: newStatus } : app
      ));
    } catch (err) {
      console.error(err);
      alert("Failed to update status.");
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
            className="glass-panel w-full max-w-3xl max-h-[85vh] overflow-hidden flex flex-col relative z-10"
          >
            <div className="p-6 border-b border-white/20 flex justify-between items-center bg-white/5">
              <div>
                <h2 className="text-2xl font-bold text-text-main">Manage Applicants</h2>
                <p className="text-sm text-text-muted mt-1">Review and respond to collaboration requests</p>
              </div>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 text-text-muted transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="animate-spin text-primary-500" size={32} />
                </div>
              ) : error ? (
                <div className="p-4 bg-red-100 text-red-600 rounded-lg text-center">{error}</div>
              ) : applicants.length === 0 ? (
                <div className="text-center py-12 text-text-muted">
                  <Users size={48} className="mx-auto mb-4 opacity-30" />
                  <p>No one has applied to this project yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {applicants.map(app => (
                    <div key={app.id} className="p-5 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 transition-colors">
                      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                        
                        {/* Applicant Info */}
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-sand-300 border border-white/50 overflow-hidden flex items-center justify-center">
                            {app.applicantAvatarUrl ? (
                              <img src={app.applicantAvatarUrl} alt="avatar" className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-white font-bold">{app.applicantName.charAt(0)}</span>
                            )}
                          </div>
                          <div>
                            <h4 className="font-bold text-text-main">{app.applicantName} <span className="text-text-muted text-sm font-normal">@{app.applicantUsername}</span></h4>
                            <p className="text-sm text-primary-400 font-medium">Applied for: {app.requestedRole || 'General Collaborator'}</p>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                          {app.status === 'PENDING' ? (
                            <>
                              <button 
                                onClick={() => handleUpdateStatus(app.id, 'ACCEPTED')}
                                className="flex-1 sm:flex-none px-4 py-2 bg-green-500/20 text-green-400 hover:bg-green-500/30 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-1 border border-green-500/30"
                              >
                                <CheckCircle size={16} /> Accept
                              </button>
                              <button 
                                onClick={() => handleUpdateStatus(app.id, 'REJECTED')}
                                className="flex-1 sm:flex-none px-4 py-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-1 border border-red-500/30"
                              >
                                <XCircle size={16} /> Reject
                              </button>
                            </>
                          ) : (
                            <span className={`px-4 py-1.5 rounded-lg text-sm font-bold border ${app.status === 'ACCEPTED' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                              {app.status}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Message & Links */}
                      <div className="mt-4 pt-4 border-t border-white/10">
                        <p className="text-sm text-text-muted italic bg-black/20 p-3 rounded-lg border border-white/5">
                          "{app.message}"
                        </p>
                        
                        <div className="mt-3 flex gap-4 text-sm">
                          <Link to={`/profile/${app.applicantUsername}`} className="text-primary-400 hover:text-primary-300 flex items-center gap-1 transition-colors">
                            View Profile <ExternalLink size={14} />
                          </Link>
                          {app.portfolioLink && (
                            <a href={app.portfolioLink} target="_blank" rel="noopener noreferrer" className="text-primary-400 hover:text-primary-300 flex items-center gap-1 transition-colors">
                              View Portfolio <ExternalLink size={14} />
                            </a>
                          )}
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ManageApplicantsModal;
