import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Mail, Lock, User, AtSign } from 'lucide-react';
import axios from 'axios';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await axios.post('/api/auth/register', formData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data));
      navigate('/dashboard');
    } catch (err) {
      if (err.response?.data?.fieldErrors) {
        const firstError = Object.values(err.response.data.fieldErrors)[0];
        setError(firstError);
      } else {
        setError(err.response?.data?.message || 'Registration failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 flex items-center justify-center relative z-10">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="glass-panel p-8 md:p-12 w-full max-w-md"
      >
        <div className="mb-10 text-center">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-text-main to-gray-800 flex items-center justify-center shadow-lg mx-auto mb-6">
            <User size={20} className="text-white" />
          </div>
          <h2 className="text-3xl font-bold mb-2 text-text-main">Initialize Profile</h2>
          <p className="text-text-muted text-sm">Join the collaboration ecosystem</p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-xl bg-red-100 border border-red-200 text-red-600 text-sm text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-5">
          <div className="relative">
            <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-light" />
            <input 
              type="text" 
              name="name"
              placeholder="Full Name" 
              className="glass-input pl-11"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="relative">
            <AtSign size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-light" />
            <input 
              type="text" 
              name="username"
              placeholder="Username" 
              className="glass-input pl-11"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="relative">
            <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-light" />
            <input 
              type="email" 
              name="email"
              placeholder="Email Address" 
              className="glass-input pl-11"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="relative">
            <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-light" />
            <input 
              type="password" 
              name="password"
              placeholder="Password" 
              className="glass-input pl-11"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="btn-cinematic-primary w-full mt-8"
          >
            {loading ? 'Initializing...' : 'Create Account'} <ArrowRight size={18} />
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-text-muted">
          Already in the ecosystem? <Link to="/login" className="text-text-main hover:text-primary-500 transition-colors font-semibold">Log in</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
