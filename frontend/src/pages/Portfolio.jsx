import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Plus, LayoutGrid, Loader2, Trash2, Edit } from 'lucide-react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import PortfolioModal from '../components/portfolio/PortfolioModal';

const Portfolio = () => {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const fetchPortfolios = async () => {
    if (!user?.userId) return;
    try {
      setLoading(true);
      const res = await api.get(`/portfolios/user/${user.userId}`);
      setItems(res.data);
    } catch (err) {
      console.error("Failed to load portfolios", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolios();
  }, [user]);

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await api.delete(`/portfolios/${id}`);
        fetchPortfolios();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleEdit = (item, e) => {
    e.stopPropagation();
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const openNewModal = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Loader2 className="animate-spin text-primary-500" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 max-w-7xl mx-auto relative z-10">
      
      <div className="flex justify-between items-end mb-12">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/40 border border-white/60 mb-4 backdrop-blur-md shadow-sm">
            <LayoutGrid size={14} className="text-primary-500" />
            <span className="text-xs font-mono tracking-wider text-text-muted uppercase">Portfolio Grid</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-text-main tracking-tight">Work & Projects</h1>
        </motion.div>

        <motion.button 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          onClick={openNewModal}
          className="btn-cinematic-primary hidden sm:flex"
        >
          <Plus size={18} /> New Work
        </motion.button>
      </div>

      {/* Masonry-style Grid Layout */}
      {items.length === 0 ? (
        <div className="text-center p-12 bg-white/40 rounded-xl border border-white/60">
          <LayoutGrid size={40} className="mx-auto text-text-light mb-4 opacity-50" />
          <h2 className="text-xl font-bold text-text-main mb-2">Your Portfolio is Empty</h2>
          <p className="text-text-muted mb-6">Start building your showcase to attract better collaborations.</p>
          <button onClick={openNewModal} className="btn-cinematic inline-flex">Add Your First Project</button>
        </div>
      ) : (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          <AnimatePresence>
            {items.map((item, index) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="glass-panel glass-panel-hover p-2 group break-inside-avoid block relative"
              >
                {/* Edit/Delete Actions overlay */}
                <div className="absolute top-4 right-4 z-20 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={(e) => handleEdit(item, e)} className="p-2 bg-white/80 hover:bg-white rounded-full text-text-main shadow-lg">
                    <Edit size={16} />
                  </button>
                  <button onClick={(e) => handleDelete(item.id, e)} className="p-2 bg-white/80 hover:bg-red-500 hover:text-white rounded-full text-red-500 shadow-lg transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className={`w-full aspect-[4/3] bg-gradient-to-br from-sand-300/40 to-white/40 rounded-xl mb-4 overflow-hidden relative border border-white/50 flex items-center justify-center`}>
                   {item.thumbnailUrl ? (
                     <img src={item.thumbnailUrl} alt="thumbnail" className="w-full h-full object-cover" />
                   ) : (
                     <>
                       <div className="absolute inset-0 bg-noise opacity-10"></div>
                       <div className="w-1/2 h-1/2 rounded-full bg-primary-400/10 blur-3xl group-hover:bg-primary-400/20 transition-all duration-700"></div>
                       <div className="w-1/3 h-1/3 absolute bottom-0 right-0 bg-accent-400/10 blur-2xl group-hover:bg-accent-400/20 transition-all duration-700 delay-100"></div>
                     </>
                   )}
                   
                   {/* Overlay Action */}
                   {item.projectUrl && (
                     <a href={item.projectUrl} target="_blank" rel="noopener noreferrer" className="absolute inset-0 bg-white/0 group-hover:bg-white/10 backdrop-blur-[0px] group-hover:backdrop-blur-[2px] transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100 z-10">
                       <button className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-text-main shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                         <ExternalLink size={20} />
                       </button>
                     </a>
                   )}
                </div>
                
                <div className="px-3 pb-3">
                  <div className="flex justify-between items-start mb-1 gap-2">
                    <h3 className="text-lg font-bold text-text-main leading-tight">{item.title}</h3>
                    {item.category && (
                      <span className="text-xs font-mono font-medium text-primary-600 bg-primary-50 px-2 py-1 rounded border border-primary-100 whitespace-nowrap">
                        {item.category}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-text-muted mt-2 line-clamp-2">{item.description}</p>
                  {item.tools && (
                    <p className="text-xs text-primary-400 font-medium mt-3 uppercase tracking-wide">{item.tools}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <PortfolioModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={editingItem}
        onSuccess={fetchPortfolios}
      />
    </div>
  );
};

export default Portfolio;
