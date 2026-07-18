import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Calendar, Users, Briefcase, Zap, Loader2 } from 'lucide-react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import ApplyModal from '../components/projects/ApplyModal';
import ManageApplicantsModal from '../components/projects/ManageApplicantsModal';

const ProjectDetail = () => {
  const { user } = useAuth();
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [applied, setApplied] = useState(false);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await api.get(`/projects/${id}`);
        setProject(response.data);
      } catch (err) {
        console.error("Failed to fetch project:", err);
        setError("Failed to load project details.");
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  const handleApplySuccess = () => {
    setApplied(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Loader2 className="animate-spin text-primary-500" size={40} />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen pt-32 px-4 text-center">
        <div className="p-4 bg-red-100 text-red-600 rounded-xl inline-block border border-red-200">
          {error || 'Project not found.'}
        </div>
        <br/>
        <Link to="/projects" className="mt-4 inline-block text-primary-600 hover:underline">Return to projects</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 max-w-4xl mx-auto relative z-10">
      
      <Link to="/projects" className="inline-flex items-center gap-2 text-sm font-medium text-text-muted hover:text-text-main transition-colors mb-8">
        <ArrowLeft size={16} /> Back to Projects
      </Link>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="glass-panel p-8 md:p-12"
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-4">
              {project.categoryNames && project.categoryNames.length > 0 ? (
                project.categoryNames.map((cat, i) => (
                  <span key={i} className="text-xs font-mono font-medium text-primary-600 bg-primary-50 px-3 py-1 rounded-full border border-primary-100">
                    {cat}
                  </span>
                ))
              ) : (
                <span className="text-xs font-mono font-medium text-primary-600 bg-primary-50 px-3 py-1 rounded-full border border-primary-100">
                  General
                </span>
              )}
              <span className="text-xs font-mono font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-100 flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div> {project.status}
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-text-main tracking-tight mb-2">{project.title}</h1>
            <p className="text-lg text-text-muted">Led by <span className="font-semibold text-text-main">{project.owner?.name || 'Unknown User'}</span></p>
          </div>
          
          <AnimatePresence mode="wait">
            {user?.userId === project.creatorId ? (
              <motion.div 
                key="owner"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col sm:flex-row gap-3 w-full md:w-auto"
              >
                <button 
                  onClick={() => setIsManageModalOpen(true)}
                  className="btn-cinematic-primary text-sm whitespace-nowrap"
                >
                  Manage Applicants ({project.applicantCount})
                </button>
                <button className="btn-cinematic text-sm whitespace-nowrap flex items-center gap-2">
                  Edit Project
                </button>
              </motion.div>
            ) : !applied ? (
              <motion.button 
                key="apply"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                onClick={() => setIsApplyModalOpen(true)}
                className="btn-cinematic-primary w-full md:w-auto text-lg whitespace-nowrap"
              >
                Apply to Collaborate <Zap size={18} />
              </motion.button>
            ) : (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-green-50 border border-green-200 text-green-700 font-semibold shadow-sm w-full md:w-auto justify-center"
              >
                <CheckCircle size={20} /> Application Sent
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 py-6 border-y border-white/30">
          <div className="flex flex-col gap-1">
            <span className="text-xs text-text-muted font-mono uppercase">Posted Date</span>
            <span className="text-lg font-semibold flex items-center gap-2"><Calendar size={18} className="text-text-light"/> {new Date(project.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs text-text-muted font-mono uppercase">Status</span>
            <span className="text-lg font-semibold flex items-center gap-2"><Users size={18} className="text-text-light"/> {project.status}</span>
          </div>
        </div>

        {/* Description */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-text-main mb-4">Project Vision</h2>
          <p className="text-text-muted leading-relaxed text-lg whitespace-pre-wrap">{project.description}</p>
        </div>

        {/* Required Roles */}
        <div>
          <h2 className="text-xl font-bold text-text-main mb-4">Roles Needed</h2>
          {project.requiredSkills && project.requiredSkills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {project.requiredSkills.map((role, idx) => (
                <span key={idx} className="px-4 py-2 bg-white/60 border border-white rounded-xl text-sm font-medium text-text-main shadow-sm">
                  {role}
                </span>
              ))}
            </div>
          ) : (
            <div className="p-5 rounded-xl bg-white/50 border border-white/80 shadow-sm">
              <p className="text-sm text-text-muted">No specific roles listed.</p>
            </div>
          )}
        </div>

      </motion.div>
      <ApplyModal 
        isOpen={isApplyModalOpen} 
        onClose={() => setIsApplyModalOpen(false)} 
        projectId={id}
        projectRoles={project.requiredSkills}
        onApplySuccess={handleApplySuccess}
      />
      <ManageApplicantsModal 
        isOpen={isManageModalOpen}
        onClose={() => setIsManageModalOpen(false)}
        projectId={id}
      />
    </div>
  );
};

export default ProjectDetail;
