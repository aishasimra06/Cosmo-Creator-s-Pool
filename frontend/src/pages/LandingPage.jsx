import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Activity, Zap, Box } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LandingPage = () => {
  const { user } = useAuth();
  return (
    <div className="min-h-screen pt-32 pb-20 px-4 relative flex flex-col items-center">
      
      {/* Central Hero Text */}
      <div className="max-w-4xl mx-auto text-center z-10 mt-10 md:mt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/40 border border-white/60 mb-8 backdrop-blur-md shadow-sm"
        >
          <Sparkles size={14} className="text-primary-500" />
          <span className="text-xs font-mono tracking-wider text-text-muted uppercase">Creator OS v2.0 Live</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3 }}
          className="text-6xl md:text-8xl font-bold tracking-tighter mb-6 leading-tight text-text-main"
        >
          Build <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-accent-500">Together.</span><br/>
          Scale <span className="text-text-muted">Faster.</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-lg md:text-xl text-text-muted max-w-2xl mx-auto mb-10 font-light"
        >
          The cinematic collaboration hub for elite designers, developers, and visionaries. 
          Find your next breakthrough project.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          {user ? (
            <Link to="/dashboard" className="btn-cinematic-primary w-full sm:w-auto text-lg px-10 py-4">
              Go to Dashboard <ArrowRight size={18} />
            </Link>
          ) : (
            <Link to="/register" className="btn-cinematic-primary w-full sm:w-auto text-lg px-10 py-4">
              Initialize Profile <ArrowRight size={18} />
            </Link>
          )}
          <Link to="/explore" className="btn-cinematic w-full sm:w-auto text-lg px-10 py-4">
            Explore Ecosystem
          </Link>
        </motion.div>
      </div>

      {/* Floating Dashboard Widgets (The "Cosmo" light dashboard feel) */}
      <div className="w-full max-w-7xl mx-auto mt-24 grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
        
        {/* Left Panel - Analytics */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="glass-panel glass-panel-hover p-6 flex flex-col justify-between h-80"
        >
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-medium text-text-muted uppercase tracking-widest font-mono">Network Activity</h3>
              <Activity size={16} className="text-accent-500" />
            </div>
            <div className="flex items-end gap-3">
              <span className="text-5xl font-light text-text-main">12.4<span className="text-2xl text-text-light">k</span></span>
              <span className="text-sm text-green-600 mb-2 font-medium">+14% this week</span>
            </div>
          </div>
          
          <div className="mt-8">
            <p className="text-xs text-text-muted mb-3 font-medium">Trending Skills</p>
            <div className="flex flex-wrap gap-2">
              {['React', 'UI/UX', 'Three.js', 'Figma', 'Node'].map((skill, i) => (
                <span key={skill} className="text-xs px-3 py-1 rounded-full bg-white/40 border border-white/60 text-text-main shadow-sm">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Center Panel - Minimal Core Graphic */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.9 }}
          className="glass-panel glass-panel-hover p-6 md:col-span-1 h-80 flex flex-col items-center justify-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-primary-400/5 to-transparent"></div>
          <div className="w-32 h-32 rounded-full border border-primary-500/10 flex items-center justify-center relative z-10 shadow-glass">
            <div className="w-24 h-24 rounded-full border border-accent-400/20 flex items-center justify-center animate-spin-slow">
               <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-primary-400/80 to-accent-400/80 blur-md"></div>
            </div>
            <Box className="absolute text-primary-600 drop-shadow-md" size={32} />
          </div>
          <p className="mt-6 font-mono text-sm text-text-muted uppercase tracking-widest z-10">Ecosystem Core</p>
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1 z-10">
            <div className="w-8 h-1 bg-primary-500 rounded-full"></div>
            <div className="w-2 h-1 bg-text-light/30 rounded-full"></div>
            <div className="w-2 h-1 bg-text-light/30 rounded-full"></div>
          </div>
        </motion.div>

        {/* Right Panel - Active Projects */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 1.0 }}
          className="glass-panel glass-panel-hover p-6 h-80 flex flex-col"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-medium text-text-muted uppercase tracking-widest font-mono">Live Projects</h3>
            <Zap size={16} className="text-primary-500" />
          </div>

          <div className="flex-1 flex flex-col gap-3">
            {[
              { t: 'Fintech Dashboard Redesign', p: 'UI/UX', s: '8/10' },
              { t: 'Web3 NFT Marketplace', p: 'Fullstack', s: '3/4' },
              { t: 'AI Video Editor Tool', p: 'React', s: '1/3' }
            ].map((proj, i) => (
              <div key={i} className="flex justify-between items-center p-3 rounded-xl bg-white/30 border border-white/50 hover:bg-white/60 transition-colors cursor-pointer shadow-sm">
                <div className="truncate pr-4">
                  <p className="text-sm font-medium text-text-main truncate">{proj.t}</p>
                  <p className="text-xs text-text-muted mt-0.5">{proj.p}</p>
                </div>
                <div className="text-xs font-mono text-primary-600 bg-primary-100 px-2 py-1 rounded font-medium border border-primary-200">
                  {proj.s}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default LandingPage;
