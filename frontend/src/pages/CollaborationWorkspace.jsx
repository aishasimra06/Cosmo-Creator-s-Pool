import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Loader2, Lock, CheckCircle } from 'lucide-react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import TeamRoster from '../components/workspace/TeamRoster';
import DiscussionFeed from '../components/workspace/DiscussionFeed';
import ProjectUpdates from '../components/workspace/ProjectUpdates';

const CollaborationWorkspace = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [project, setProject] = useState(null);
  const [team, setTeam] = useState([]);
  const [messages, setMessages] = useState([]);
  const [updates, setUpdates] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchWorkspaceData();
    
    // Simple polling for new messages every 10 seconds to simulate a live feed 
    // since we are using async REST APIs instead of websockets
    const interval = setInterval(() => {
      if (!error) fetchMessagesOnly();
    }, 10000);
    
    return () => clearInterval(interval);
  }, [projectId, error]);

  const fetchWorkspaceData = async () => {
    try {
      setLoading(true);
      const [projectRes, teamRes, messagesRes, updatesRes] = await Promise.all([
        api.get(`/projects/${projectId}`),
        api.get(`/workspace/${projectId}/team`),
        api.get(`/workspace/${projectId}/messages`),
        api.get(`/workspace/${projectId}/updates`)
      ]);
      setProject(projectRes.data);
      setTeam(teamRes.data);
      setMessages(messagesRes.data);
      setUpdates(updatesRes.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.status === 403 
        ? "Access Denied: You are not an accepted collaborator on this project." 
        : "Failed to load workspace data.");
    } finally {
      setLoading(false);
    }
  };

  const fetchMessagesOnly = async () => {
    try {
      const res = await api.get(`/workspace/${projectId}/messages`);
      setMessages(res.data);
    } catch (err) {
      console.error("Failed to poll messages", err);
    }
  };

  const handleSendMessage = async (messageText) => {
    try {
      const res = await api.post(`/workspace/${projectId}/messages`, { message: messageText });
      setMessages(prev => [...prev, res.data]);
    } catch (err) {
      console.error("Failed to send message", err);
      alert("Could not send message: " + (err.response?.data?.message || err.message));
    }
  };

  const handlePostUpdate = async (updateText) => {
    try {
      const res = await api.post(`/workspace/${projectId}/updates`, { content: updateText });
      setUpdates(prev => [res.data, ...prev]);
    } catch (err) {
      console.error("Failed to post update", err);
      alert("Could not post official update: " + (err.response?.data?.message || err.message));
    }
  };

  const handleCloseProject = async () => {
    if (!window.confirm("Are you sure you want to close this project? This will mark it as COMPLETED and update profile stats for all accepted collaborators. This action cannot be undone.")) {
      return;
    }

    try {
      await api.put(`/workspace/${projectId}/close`);
      setProject(prev => ({ ...prev, status: 'COMPLETED' }));
      alert("Project successfully marked as completed! Profile stats have been updated.");
    } catch (err) {
      console.error("Failed to close project", err);
      alert(err.response?.data?.message || "Failed to close project.");
    }
  };

  if (loading && !project) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <Loader2 className="animate-spin text-primary-500" size={48} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-24 flex flex-col items-center justify-center text-center px-4">
        <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6 border border-red-500/20">
          <Lock size={32} className="text-red-500" />
        </div>
        <h2 className="text-3xl font-bold text-text-main mb-4">Workspace Locked</h2>
        <p className="text-text-muted max-w-md mb-8 text-lg">{error}</p>
        <button onClick={() => navigate('/dashboard')} className="btn-cinematic px-8 py-3">
          Return to Dashboard
        </button>
      </div>
    );
  }

  const isOwner = project?.creatorId === user?.userId;

  return (
    <div className="min-h-screen pt-28 pb-20 px-6 max-w-7xl mx-auto relative z-10">
      
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 border-b border-white/40 pb-6"
      >
        <Link to="/dashboard" className="text-primary-600 hover:text-primary-700 flex items-center gap-2 text-sm font-medium mb-4 w-fit transition-colors">
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-md text-xs font-bold uppercase tracking-widest ${
                project.status === 'COMPLETED' 
                  ? 'bg-green-500/10 border-green-500/20 text-green-600'
                  : 'bg-accent-500/10 border-accent-500/20 text-accent-600'
              }`}>
                {project.status !== 'COMPLETED' && (
                  <div className="w-2 h-2 rounded-full bg-accent-500 animate-pulse-slow"></div>
                )}
                {project.status === 'COMPLETED' ? 'Project Completed' : 'Active Workspace'}
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-text-main mb-2">
              {project.title}
            </h1>
            <p className="text-text-muted max-w-2xl">
              Collaborate with your team, share resources, and track progress together.
            </p>
          </div>
          
          {isOwner && project.status !== 'COMPLETED' && (
            <button 
              onClick={handleCloseProject}
              className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-md hover:shadow-lg active:scale-95"
            >
              <CheckCircle size={18} />
              Mark as Completed
            </button>
          )}
        </div>
      </motion.div>

      {/* Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
        
        {/* Left Sidebar - Team Roster */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1 space-y-6"
        >
          <TeamRoster team={team} />
        </motion.div>

        {/* Center - Discussion Feed */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2"
        >
          <DiscussionFeed 
            messages={messages} 
            onSendMessage={handleSendMessage} 
          />
        </motion.div>

        {/* Right Sidebar - Updates & Resources */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-1 space-y-6"
        >
          <ProjectUpdates 
            updates={updates} 
            onPostUpdate={handlePostUpdate}
            isOwner={isOwner}
          />
        </motion.div>

      </div>
    </div>
  );
};

export default CollaborationWorkspace;
