import React from 'react';
import { motion } from 'framer-motion';
import { User, Briefcase, Star, CheckCircle, ExternalLink, MessageSquare, Clock, MapPin, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const ApplicantCard = ({ application, onShortlist, onAccept, onReject, onViewDetails }) => {
  const getStatusColor = (status) => {
    switch(status) {
      case 'PENDING': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'SHORTLISTED': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'ACCEPTED': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'REJECTED': return 'bg-red-500/10 text-red-500 border-red-500/20';
      default: return 'bg-white/10 text-white border-white/20';
    }
  };

  // Mocked data as requested for missing schema fields
  const mockedRating = (Math.random() * (5.0 - 4.2) + 4.2).toFixed(1);
  const mockedProjects = Math.floor(Math.random() * 20) + 2;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      layout
      className="glass-panel !bg-white/80 p-6 flex flex-col gap-5 border border-white/40 hover:border-white/60 transition-all shadow-lg relative overflow-hidden group"
    >
      {/* Decorative gradient orb */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary-500/10 rounded-full blur-3xl group-hover:bg-primary-500/20 transition-colors pointer-events-none"></div>

      {/* Header Info */}
      <div className="flex justify-between items-start z-10 relative">
        <div className="flex gap-4">
          <div className="w-16 h-16 rounded-2xl overflow-hidden border border-white/20 shadow-inner bg-white/5 flex-shrink-0 relative group-hover:scale-105 transition-transform duration-500">
            {application.applicantAvatarUrl ? (
              <img src={application.applicantAvatarUrl} alt={application.applicantName} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-text-muted">
                <User size={24} />
              </div>
            )}
            <div className="absolute bottom-1 right-1 w-3 h-3 bg-green-500 border-2 border-[#1a1a2e] rounded-full"></div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-text-main">{application.applicantName}</h3>
              <CheckCircle size={14} className="text-primary-400" />
            </div>
            <p className="text-sm text-text-muted">@{application.applicantUsername}</p>
            <div className="flex items-center gap-3 mt-1.5 text-xs font-medium">
              <span className="flex items-center gap-1 text-yellow-400"><Star size={12} fill="currentColor"/> {mockedRating} Rating</span>
              <span className="w-1 h-1 rounded-full bg-text-muted/40"></span>
              <span className="text-text-muted">{mockedProjects} Collaborations</span>
            </div>
          </div>
        </div>

        <div className={`px-3 py-1 rounded-full border text-xs font-bold tracking-wider ${getStatusColor(application.status)}`}>
          {application.status}
        </div>
      </div>

      {/* Application Snippet */}
      <div className="bg-white/5 border border-white/5 rounded-xl p-4 z-10 relative">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-mono text-primary-400 uppercase tracking-wider">Applied For:</span>
          <span className="text-xs text-text-muted flex items-center gap-1"><Clock size={12}/> {new Date(application.createdAt).toLocaleDateString()}</span>
        </div>
        <p className="text-sm font-semibold text-text-main mb-2 flex items-center gap-2">
          <Briefcase size={14} className="text-text-muted"/> {application.requestedRole || 'General Collaborator'}
        </p>
        <p className="text-sm text-text-muted line-clamp-2 leading-relaxed">"{application.message}"</p>
        <button onClick={() => onViewDetails(application)} className="text-xs text-primary-400 hover:text-primary-300 mt-2 font-medium flex items-center gap-1">
          Read full pitch <MessageSquare size={12}/>
        </button>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3 mt-2 z-10 relative">
        <Link to={`/profile/${application.applicantId}`} className="btn-cinematic py-2.5 text-sm flex justify-center w-full">
          View Profile <ExternalLink size={14}/>
        </Link>
        {application.portfolioLink ? (
          <a href={application.portfolioLink} target="_blank" rel="noreferrer" className="btn-cinematic py-2.5 text-sm flex justify-center w-full bg-white/10 hover:bg-white/20">
            Portfolio <ExternalLink size={14}/>
          </a>
        ) : (
          <button disabled className="btn-cinematic py-2.5 text-sm flex justify-center w-full opacity-50 cursor-not-allowed">
            No Portfolio
          </button>
        )}
      </div>

      <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent my-1 z-10 relative"></div>

      <div className="flex gap-2 z-10 relative">
        {application.status !== 'ACCEPTED' && (
          <button onClick={() => onAccept(application.id)} className="flex-1 py-2 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 border border-green-500/30 transition-colors text-sm font-medium">
            Accept
          </button>
        )}
        {application.status === 'PENDING' && (
          <button onClick={() => onShortlist(application.id)} className="flex-1 py-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 border border-blue-500/30 transition-colors text-sm font-medium">
            Shortlist
          </button>
        )}
        {application.status !== 'REJECTED' && (
          <button onClick={() => onReject(application.id)} className="px-4 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 transition-colors flex items-center justify-center">
            <X size={18}/>
          </button>
        )}
      </div>

    </motion.div>
  );
};

export default ApplicantCard;
