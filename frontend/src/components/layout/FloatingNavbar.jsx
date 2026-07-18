import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Menu, LogOut, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import NotificationDropdown from './NotificationDropdown';

const FloatingNavbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Overview', path: '/' },
    { name: 'Explore', path: '/explore' },
    { name: 'Projects', path: '/projects' },
    ...(user ? [{ name: 'Profile', path: '/profile' }, { name: 'Dashboard', path: '/dashboard' }] : []),
  ];

  return (
    <motion.header 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 flex justify-center pt-6 px-4 transition-all duration-300 ${scrolled ? 'pt-4' : ''}`}
    >
      <div className="bg-white/30 backdrop-blur-2xl border border-white/60 shadow-glass rounded-full px-6 py-3 flex items-center justify-between w-full max-w-7xl relative z-50 transition-all duration-300">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-text-main flex items-center justify-center shadow-sm">
            <div className="w-3 h-3 bg-white rounded-full"></div>
          </div>
          <span className="font-bold text-xl tracking-tight text-text-main hidden sm:block">COSMO<span className="text-text-muted text-xs align-top">™</span></span>
        </Link>

        {/* Center Links */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              to={link.path}
              className="relative text-sm font-medium text-text-muted hover:text-text-main transition-colors"
            >
              {link.name}
              {location.pathname === link.path && (
                <motion.div 
                  layoutId="activeIndicator"
                  className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary-500 shadow-glow-subtle"
                />
              )}
            </Link>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          <button className="text-text-muted hover:text-text-main transition-colors p-2 hidden sm:block">
            <Search size={18} />
          </button>
          
          <div className="h-4 w-px bg-text-muted/20 mx-1 hidden sm:block"></div>

          <div className="hidden sm:flex items-center gap-3">
            {user ? (
              <>
                <NotificationDropdown />
                <Link to="/profile" className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-sand-400 to-sand-300 text-white font-bold text-xs shadow-sm border border-white">
                  {user.name?.charAt(0) || <User size={14}/>}
                </Link>
                <button 
                  onClick={logout}
                  className="btn-cinematic py-2 px-4 text-sm rounded-full text-text-main flex items-center gap-2 hover:bg-red-500/10 hover:text-red-600 transition-colors"
                >
                  <LogOut size={16} /> Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium text-text-muted hover:text-text-main transition-colors px-3">
                  Log in
                </Link>
                <Link to="/register" className="btn-cinematic-primary py-2 px-5 text-sm rounded-full">
                  Get Started
                </Link>
              </>
            )}
          </div>

          <button className="md:hidden text-text-muted hover:text-text-main p-2">
            <Menu size={20} />
          </button>
        </div>

      </div>
    </motion.header>
  );
};

export default FloatingNavbar;
