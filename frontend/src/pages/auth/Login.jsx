import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Mail, Lock } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await axios.post('/api/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data));
      login(res.data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials');
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
            <Lock size={20} className="text-white" />
          </div>
          <h2 className="text-3xl font-bold mb-2 text-text-main">Welcome Back</h2>
          <p className="text-text-muted text-sm">Access your creator workspace</p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-xl bg-red-100 border border-red-200 text-red-600 text-sm text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="relative">
            <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-light" />
            <input 
              type="email" 
              placeholder="Email Address" 
              className="glass-input pl-11"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="relative">
            <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-light" />
            <input 
              type="password" 
              placeholder="Password" 
              className="glass-input pl-11"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="flex justify-between items-center text-sm px-1">
            <label className="flex items-center gap-2 cursor-pointer text-text-muted hover:text-text-main transition-colors font-medium">
              <input type="checkbox" className="rounded border-white/60 bg-white/40 text-primary-500 focus:ring-primary-500/50 shadow-sm" />
              Remember me
            </label>
            <Link to="/forgot-password" className="text-primary-500 hover:text-primary-600 transition-colors font-medium">Forgot Password?</Link>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="btn-cinematic-primary w-full mt-8"
          >
            {loading ? 'Authenticating...' : 'Sign In'} <ArrowRight size={18} />
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-text-muted">
          Don't have an account? <Link to="/register" className="text-text-main hover:text-primary-500 transition-colors font-semibold">Create ecosystem profile</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
