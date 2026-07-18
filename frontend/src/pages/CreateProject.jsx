import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send } from 'lucide-react';
import api from '../utils/api';

const CreateProject = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'OPEN'
  });
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [rolesInput, setRolesInput] = useState('');
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Attempt to fetch categories if your backend supports it
    // If not, we will use a fallback static list for now to not break the UI
    const fetchCategories = async () => {
      try {
        // Mocking categories array since we need category IDs
        // Assuming Category Entity exists and we can get them.
        const res = await api.get('/categories').catch(() => ({ data: [] }));
        if (res.data && res.data.length > 0) {
           setCategories(res.data);
           setSelectedCategories([res.data[0].id]);
        } else {
           // Fallback if no categories endpoint
           setCategories([{id: 1, name: 'Web Dev'}, {id: 2, name: 'Design'}, {id: 3, name: 'Video Editing'}]);
           setSelectedCategories([1]);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchCategories();
  }, []);

  const handleRoleAdd = (e) => {
    e.preventDefault();
    if (rolesInput.trim() && !roles.includes(rolesInput.trim())) {
      setRoles([...roles, rolesInput.trim()]);
      setRolesInput('');
    }
  };

  const removeRole = (roleToRemove) => {
    setRoles(roles.filter(r => r !== roleToRemove));
  };

  const handleCategoryToggle = (catId) => {
    setSelectedCategories(prev => 
      prev.includes(catId) ? prev.filter(id => id !== catId) : [...prev, catId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        status: formData.status,
        categoryIds: selectedCategories,
        requiredSkills: roles
      };
      
      const form = new FormData();
      form.append('data', new Blob([JSON.stringify(payload)], { type: 'application/json' }));
      
      const res = await api.post('/projects', form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      navigate(`/projects/${res.data.id}`);
    } catch (err) {
      console.error(err);
      setError('Failed to post project. Ensure you are logged in.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 max-w-3xl mx-auto relative z-10">
      <Link to="/projects" className="inline-flex items-center gap-2 text-sm font-medium text-text-muted hover:text-text-main transition-colors mb-8">
        <ArrowLeft size={16} /> Back to Projects
      </Link>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="glass-panel p-8 md:p-12"
      >
        <h1 className="text-3xl font-bold text-text-main mb-2">Post a New Project</h1>
        <p className="text-text-muted mb-8">Outline your vision and find the perfect collaborators.</p>

        {error && (
          <div className="mb-6 p-3 rounded-xl bg-red-100 border border-red-200 text-red-600 text-sm text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-text-main mb-2">Project Title</label>
            <input 
              type="text" 
              className="glass-input" 
              placeholder="e.g. Immersive VR Art Gallery"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-text-main mb-2">Categories (Select Multiple)</label>
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleCategoryToggle(cat.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${
                    selectedCategories.includes(cat.id)
                      ? 'bg-primary-500 text-white border-primary-600'
                      : 'bg-white/50 text-text-muted border-white hover:bg-white'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-text-main mb-2">Project Description</label>
            <textarea 
              className="glass-input min-h-[120px] resize-y" 
              placeholder="Describe the project goals and vision..."
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              required
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-semibold text-text-main mb-2">Roles Needed</label>
            <div className="flex gap-2 mb-3">
              <input 
                type="text" 
                className="glass-input flex-1" 
                placeholder="e.g. React Developer, 3D Animator"
                value={rolesInput}
                onChange={(e) => setRolesInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleRoleAdd(e)}
              />
              <button 
                type="button" 
                onClick={handleRoleAdd}
                className="px-4 py-2 bg-text-main text-white rounded-xl text-sm font-semibold hover:bg-text-light transition-colors"
              >
                Add
              </button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {roles.map((role, idx) => (
                <div key={idx} className="flex items-center gap-1 bg-white/60 border border-white px-3 py-1.5 rounded-lg text-sm font-medium text-text-main">
                  {role}
                  <button type="button" onClick={() => removeRole(role)} className="text-red-500 hover:text-red-700 ml-1 text-lg leading-none">&times;</button>
                </div>
              ))}
              {roles.length === 0 && <span className="text-sm text-text-muted">No roles added yet. Add at least one to help creators find your project.</span>}
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="btn-cinematic-primary w-full mt-4"
          >
            {loading ? 'Posting...' : 'Launch Project'} <Send size={18} />
          </button>
        </form>

      </motion.div>
    </div>
  );
};

export default CreateProject;
