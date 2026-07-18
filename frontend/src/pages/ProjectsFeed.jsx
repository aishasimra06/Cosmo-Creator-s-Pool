import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Briefcase, Clock, Users, ArrowRight, Zap, Loader2 } from 'lucide-react';
import api from '../utils/api';

const ProjectsFeed = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await api.get('/projects');
        setProjects(response.data);
      } catch (err) {
        console.error("Failed to fetch projects:", err);
        setError("Failed to load projects. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 max-w-5xl mx-auto relative z-10">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-text-main tracking-tight mb-2">Active Projects</h1>
          <p className="text-text-muted text-lg">Find the perfect collaboration and start building.</p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Link to="/projects/create" className="btn-cinematic-primary">
            <Zap size={18} /> Post a Project
          </Link>
        </motion.div>
      </div>

      {error && (
        <div className="p-4 bg-red-100 text-red-600 rounded-xl mb-6 text-center border border-red-200">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="animate-spin text-primary-500" size={40} />
        </div>
      ) : projects.length === 0 ? (
        <div className="glass-panel p-12 text-center">
          <Briefcase size={40} className="mx-auto text-text-light mb-4" />
          <h3 className="text-xl font-bold text-text-main mb-2">No projects found</h3>
          <p className="text-text-muted mb-6">Be the first to post a new collaboration project!</p>
          <Link to="/projects/create" className="btn-cinematic mx-auto inline-flex">
            Create Project
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {projects.map((proj, index) => (
            <motion.div 
              key={proj.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: Math.min(index * 0.1, 0.5) }}
            >
              <Link to={`/projects/${proj.id}`} className="block">
                <div className="glass-panel glass-panel-hover p-5 md:p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 group">
                  
                  {/* Clean List Design */}
                  <div className="flex-1 flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
                    {/* Status / Category indicator */}
                    <div className="hidden md:flex w-12 h-12 rounded-xl bg-primary-50 border border-primary-100 items-center justify-center shrink-0">
                      <Briefcase size={20} className="text-primary-600" />
                    </div>

                    <div>
                      <h2 className="text-xl font-bold text-text-main mb-1 group-hover:text-primary-600 transition-colors">
                        {proj.title}
                      </h2>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-text-muted">
                        {proj.categoryNames && proj.categoryNames.length > 0 ? (
                          proj.categoryNames.map((cat, i) => (
                            <span key={i} className="font-mono text-primary-600 bg-primary-50 px-2 py-0.5 rounded-md border border-primary-100 text-xs">{cat}</span>
                          ))
                        ) : (
                          <span className="font-mono text-primary-600 bg-primary-50 px-2 py-0.5 rounded-md border border-primary-100 text-xs">General</span>
                        )}
                        <span className="w-1 h-1 rounded-full bg-text-light"></span>
                        <span className="flex items-center gap-1"><Clock size={14} /> {new Date(proj.createdAt).toLocaleDateString()}</span>
                        <span className="w-1 h-1 rounded-full bg-text-light"></span>
                        <span className="flex items-center gap-1"><Users size={14} /> {proj.status}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center text-primary-600 font-semibold text-sm gap-1 group-hover:translate-x-1 transition-transform w-full md:w-auto justify-end border-t md:border-0 border-white/30 pt-3 md:pt-0">
                    View Details <ArrowRight size={16} />
                  </div>

                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectsFeed;
