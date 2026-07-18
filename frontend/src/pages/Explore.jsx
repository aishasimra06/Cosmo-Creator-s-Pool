import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Compass, Star, TrendingUp } from 'lucide-react';

const Explore = () => {
  const [activeCategory, setActiveCategory] = useState('All');

  // Mock Data
  const categories = ['All', 'UI/UX Design', 'Frontend Dev', '3D Animation', 'Web3', 'Video Editing'];
  const topCreators = [
    { id: 1, name: 'Elena Rostova', role: '3D Generalist', rating: '4.9', avatar: 'ER', category: '3D Animation' },
    { id: 2, name: 'Marcus Chen', role: 'Frontend Arch', rating: '5.0', avatar: 'MC', category: 'Frontend Dev' },
    { id: 3, name: 'Sarah Jenkins', role: 'Product Designer', rating: '4.8', avatar: 'SJ', category: 'UI/UX Design' },
    { id: 4, name: 'David Kim', role: 'Motion Graphics', rating: '4.9', avatar: 'DK', category: 'Video Editing' },
    { id: 5, name: 'Alex Rivera', role: 'Smart Contracts', rating: '4.7', avatar: 'AR', category: 'Web3' },
    { id: 6, name: 'Maya Patel', role: 'React Developer', rating: '4.9', avatar: 'MP', category: 'Frontend Dev' },
  ];

  const filteredCreators = activeCategory === 'All' 
    ? topCreators 
    : topCreators.filter(c => c.category === activeCategory);

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 max-w-7xl mx-auto relative z-10">
      
      {/* Header */}
      <div className="mb-12 text-center max-w-2xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/40 border border-white/60 mb-6 backdrop-blur-md shadow-sm">
            <Compass size={14} className="text-primary-500" />
            <span className="text-xs font-mono tracking-wider text-text-muted uppercase">Global Network</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-text-main tracking-tight mb-4">Explore Ecosystem</h1>
          <p className="text-text-muted text-lg">Discover top-tier talent and visionary creators shaping the digital frontier.</p>
        </motion.div>
      </div>

      {/* Categories Filter */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="flex flex-wrap justify-center gap-3 mb-16"
      >
        {categories.map((cat, i) => (
          <button 
            key={i}
            onClick={() => setActiveCategory(cat)}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all shadow-sm ${activeCategory === cat ? 'bg-text-main text-white' : 'glass-panel text-text-main hover:bg-white/80'}`}
          >
            {cat}
          </button>
        ))}
      </motion.div>

      {/* Top Creators Grid */}
      <div className="mb-8 flex justify-between items-end">
        <h2 className="text-2xl font-bold text-text-main flex items-center gap-2">
          <TrendingUp className="text-primary-500" /> Trending Creators
        </h2>
      </div>

      <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <AnimatePresence>
          {filteredCreators.map((creator, index) => (
            <motion.div 
              key={creator.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4 }}
              className="glass-panel glass-panel-hover p-6 text-center group cursor-pointer"
            >
              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-sand-300 to-white/60 border-2 border-white shadow-sm flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-300">
                <span className="text-xl font-bold text-text-muted">{creator.avatar}</span>
              </div>
              <h3 className="text-lg font-bold text-text-main">{creator.name}</h3>
              <p className="text-sm font-medium text-primary-600 mb-4">{creator.role}</p>
              
              <div className="flex justify-center items-center gap-1 text-sm font-medium text-text-muted bg-white/30 py-1.5 rounded-lg border border-white/50">
                <Star size={14} className="text-yellow-500" /> {creator.rating}
              </div>
              
              <button className="w-full mt-4 py-2 rounded-lg bg-white/40 hover:bg-white/70 text-text-main text-sm font-semibold transition-colors border border-white/60">
                View Profile
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

    </div>
  );
};

export default Explore;
