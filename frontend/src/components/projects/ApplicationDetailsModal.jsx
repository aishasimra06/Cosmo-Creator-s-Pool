import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Calendar, Briefcase, FileText } from 'lucide-react';

const ApplicationDetailsModal = ({ isOpen, onClose, application }) => {
  if (!application) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
          />
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#1a1a2e] border border-white/10 shadow-2xl rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col pointer-events-auto"
            >
              <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
                  <FileText className="text-primary-400" />
                  Collaboration Proposal
                </h2>
                <button onClick={onClose} className="p-2 text-text-muted hover:text-white hover:bg-white/10 rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 overflow-y-auto custom-scrollbar flex flex-col gap-6">
                
                {/* Applicant Summary */}
                <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
                  <img src={application.applicantAvatarUrl || 'https://via.placeholder.com/150'} alt="avatar" className="w-14 h-14 rounded-full border border-white/20" />
                  <div>
                    <h3 className="text-lg font-bold text-white">{application.applicantName}</h3>
                    <p className="text-sm text-text-muted">@{application.applicantUsername}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                    <span className="text-xs text-text-muted block mb-1">Requested Role</span>
                    <p className="text-sm font-semibold flex items-center gap-2">
                      <Briefcase size={16} className="text-primary-400"/>
                      {application.requestedRole || 'General'}
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                    <span className="text-xs text-text-muted block mb-1">Applied Date</span>
                    <p className="text-sm font-semibold flex items-center gap-2">
                      <Calendar size={16} className="text-primary-400"/>
                      {new Date(application.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-white mb-3 uppercase tracking-wider">The Pitch</h3>
                  <div className="p-5 rounded-xl bg-black/40 border border-white/10 relative">
                    <div className="absolute top-0 left-0 w-1 h-full bg-primary-500 rounded-l-xl"></div>
                    <p className="text-text-main leading-relaxed whitespace-pre-wrap text-sm">
                      {application.message}
                    </p>
                  </div>
                </div>

                {application.portfolioLink && (
                  <div>
                    <h3 className="text-sm font-bold text-white mb-3 uppercase tracking-wider">References</h3>
                    <a href={application.portfolioLink} target="_blank" rel="noreferrer" className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary-500/20 flex items-center justify-center text-primary-400">
                          <ExternalLink size={20} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white">Portfolio / External Work</p>
                          <p className="text-xs text-text-muted truncate max-w-[300px]">{application.portfolioLink}</p>
                        </div>
                      </div>
                      <ExternalLink size={16} className="text-text-muted group-hover:text-white" />
                    </a>
                  </div>
                )}
              </div>

              <div className="p-6 border-t border-white/10 bg-black/20 flex justify-end">
                <button onClick={onClose} className="btn-cinematic px-6 py-2">
                  Close Review
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ApplicationDetailsModal;
