import React from 'react';
import { motion } from 'framer-motion';

const AtmosphericBackground = () => {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden">
      
      {/* High-Resolution Cinematic Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000"
        style={{ backgroundImage: 'url("/hero-bg.jpg")' }}
      ></div>

      {/* Atmospheric Soft Gradient Overlays (To ensure text/glass readability) */}
      <div className="absolute inset-0 bg-gradient-to-b from-light-bg/40 via-transparent to-light-bg/80 mix-blend-normal pointer-events-none"></div>
      <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px] pointer-events-none"></div>

      {/* Subtle Noise Texture for Cinematic Grain */}
      <div className="absolute inset-0 bg-noise pointer-events-none z-10 opacity-30"></div>
      
      {/* Warm Ambient Lighting Blobs (Adapted for image blend) */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.6, scale: 1, y: [0, -30, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] rounded-full bg-sand-300/30 blur-[150px] pointer-events-none mix-blend-overlay"
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.7, scale: 1, y: [0, 40, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-[-20%] right-[-10%] w-[900px] h-[900px] rounded-full bg-white/40 blur-[180px] pointer-events-none mix-blend-soft-light"
      />

    </div>
  );
};

export default AtmosphericBackground;
