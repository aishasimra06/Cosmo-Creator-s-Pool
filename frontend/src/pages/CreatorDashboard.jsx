import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Activity, Bell, Briefcase, FileEdit, Users, Zap, LayoutDashboard, Loader2, Bookmark, FolderGit2 } from 'lucide-react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const CreatorDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('projects'); // 'projects', 'applications', 'saved'
  
  const [myProjects, setMyProjects] = useState([]);
  const [myApplications, setMyApplications] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [projectsRes, appsRes, profileRes] = await Promise.all([
          api.get('/projects/me'),
          api.get('/projects/applications/me'),
          api.get('/auth/me')
        ]);
        setMyProjects(projectsRes.data);
        setMyApplications(appsRes.data);
        setProfile(profileRes.data);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };
    
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const stats = [
    { label: 'Posted Projects', value: myProjects.length, icon: Briefcase, trend: 'Owned by you' },
    { label: 'Active Applications', value: myApplications.length, icon: Zap, trend: 'Pending responses' },
    { label: 'Completed Collabs', value: profile?.completedCollaborations || 0, icon: Users, trend: 'Successful projects' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Loader2 className="animate-spin text-primary-500" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 max-w-7xl mx-auto relative z-10">
      
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/40 border border-white/60 mb-4 backdrop-blur-md shadow-sm">
            <LayoutDashboard size={14} className="text-primary-500" />
            <span className="text-xs font-mono tracking-wider text-text-muted uppercase">Creator Workspace</span>
          </div>
          <h1 className="text-4xl font-bold text-text-main tracking-tight">Dashboard</h1>
          <p className="text-text-muted mt-2">Welcome back, {user?.name}</p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex gap-3"
        >
          <button className="btn-cinematic p-3 rounded-xl"><Bell size={20} /></button>
          <Link to="/projects/create" className="btn-cinematic-primary py-2 px-6 flex items-center gap-2"><Zap size={18} /> New Project</Link>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {stats.map((stat, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass-panel p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-white/50 rounded-lg shadow-sm border border-white/80">
                    <stat.icon size={20} className="text-primary-600" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-text-main mb-1">{stat.value}</h3>
                <p className="text-sm font-medium text-text-main mb-2">{stat.label}</p>
                <p className="text-xs text-text-muted">{stat.trend}</p>
              </motion.div>
            ))}
          </div>

          {/* Dynamic Tabs */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex gap-4 border-b border-white/40 pb-2 mb-6"
          >
            <button 
              onClick={() => setActiveTab('projects')}
              className={`pb-2 px-1 font-semibold text-sm transition-all border-b-2 ${activeTab === 'projects' ? 'border-primary-500 text-primary-700' : 'border-transparent text-text-muted hover:text-text-main'}`}
            >
              My Posted Projects
            </button>
            <button 
              onClick={() => setActiveTab('applications')}
              className={`pb-2 px-1 font-semibold text-sm transition-all border-b-2 ${activeTab === 'applications' ? 'border-primary-500 text-primary-700' : 'border-transparent text-text-muted hover:text-text-main'}`}
            >
              My Applications
            </button>
            <button 
              onClick={() => setActiveTab('saved')}
              className={`pb-2 px-1 font-semibold text-sm transition-all border-b-2 ${activeTab === 'saved' ? 'border-primary-500 text-primary-700' : 'border-transparent text-text-muted hover:text-text-main'}`}
            >
              Saved Projects
            </button>
          </motion.div>

          <AnimatePresence mode="wait">
            {activeTab === 'projects' && (
              <motion.div 
                key="projects"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                {myProjects.length > 0 ? myProjects.map(proj => (
                  <div key={proj.id} className="block glass-panel glass-panel-hover p-5 border border-white/60">
                    <div className="flex justify-between items-start">
                      <div>
                        <Link to={`/projects/${proj.id}`} className="font-bold text-text-main text-lg hover:text-primary-400 transition-colors">{proj.title}</Link>
                        <div className="flex items-center gap-2 mt-2">
                           <span className="text-xs font-mono bg-primary-50 text-primary-600 px-2 py-0.5 rounded border border-primary-100">
                             {proj.status}
                           </span>
                           <span className="text-xs text-text-muted">{proj.applicantCount} applicants</span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Link to={`/projects/${proj.id}/manage-applicants`} className="btn-cinematic py-1.5 px-4 text-xs">
                          Review Applicants
                        </Link>
                        {proj.hasAcceptedCollaborators && (
                          <Link to={`/collaboration/${proj.id}`} className="btn-cinematic-primary py-1.5 px-4 text-xs flex items-center justify-center gap-2">
                            <Zap size={14} /> Workspace
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="text-center p-8 bg-white/40 rounded-xl border border-white/60">
                    <FolderGit2 size={30} className="mx-auto text-text-light mb-3" />
                    <p className="text-text-muted mb-4">You haven't posted any projects yet.</p>
                    <Link to="/projects/create" className="btn-cinematic inline-flex">Create Your First Project</Link>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'applications' && (
              <motion.div 
                key="applications"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                {myApplications.length > 0 ? myApplications.map(app => (
                  <div key={app.id} className="block glass-panel glass-panel-hover p-5 border border-white/60">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-xs text-text-muted mb-1">Applied to:</p>
                        <Link to={`/projects/${app.projectId}`} className="font-bold text-text-main text-lg hover:text-primary-500 transition-colors">{app.projectTitle}</Link>
                      </div>
                      <div className="text-right">
                        <span className={`inline-block mb-2 text-xs font-mono px-2 py-1 rounded border ${app.status === 'ACCEPTED' ? 'bg-green-50 text-green-700 border-green-200' : app.status === 'REJECTED' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-yellow-50 text-yellow-700 border-yellow-200'}`}>
                          {app.status}
                        </span>
                        {app.status === 'ACCEPTED' && (
                          <Link to={`/collaboration/${app.projectId}`} className="block btn-cinematic-primary py-1 px-3 text-xs">
                            Enter Workspace
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="text-center p-8 bg-white/40 rounded-xl border border-white/60">
                    <Zap size={30} className="mx-auto text-text-light mb-3" />
                    <p className="text-text-muted mb-4">You haven't applied to any projects yet.</p>
                    <Link to="/projects" className="btn-cinematic inline-flex">Browse Projects</Link>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'saved' && (
              <motion.div 
                key="saved"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <div className="text-center p-8 bg-white/40 rounded-xl border border-white/60">
                  <Bookmark size={30} className="mx-auto text-text-light mb-3" />
                  <p className="text-text-muted">You have no saved projects.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          
          {/* Quick Actions */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="glass-panel p-6"
          >
             <h2 className="text-lg font-bold text-text-main mb-4">Creator Profile</h2>
             <div className="space-y-3">
               <Link to="/profile" className="flex items-center gap-3 p-3 rounded-xl bg-white/40 border border-white/60 hover:bg-white/70 transition-colors text-sm font-medium text-text-main">
                 <FileEdit size={16} className="text-primary-600" /> Edit Profile Details
               </Link>
               <Link to="/portfolio" className="flex items-center gap-3 p-3 rounded-xl bg-white/40 border border-white/60 hover:bg-white/70 transition-colors text-sm font-medium text-text-main">
                 <Briefcase size={16} className="text-primary-600" /> Manage Portfolio
               </Link>
             </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default CreatorDashboard;
