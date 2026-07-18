import React from 'react';
import { motion } from 'framer-motion';
import { Users, Crown } from 'lucide-react';
import { Link } from 'react-router-dom';

const TeamRoster = ({ team }) => {
  return (
    <div className="glass-panel !bg-white/80 p-6 rounded-2xl border border-white/40 sticky top-28">
      <h3 className="text-sm font-bold text-text-main uppercase tracking-wider mb-6 flex items-center gap-2">
        <Users size={18} className="text-primary-500" /> Team Roster
      </h3>
      
      <div className="space-y-4">
        {team.map((member, index) => (
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            key={member.userId}
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/50 transition-colors border border-transparent hover:border-white/60"
          >
            <div className="relative">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-sand-300">
                {member.avatarUrl ? (
                  <img src={member.avatarUrl} alt={member.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-text-main font-bold">
                    {member.name.charAt(0)}
                  </div>
                )}
              </div>
              {member.role === 'Project Owner' && (
                <div className="absolute -bottom-1 -right-1 bg-yellow-400 text-black rounded-full p-0.5 border border-white">
                  <Crown size={10} />
                </div>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <Link to={`/profile/${member.userId}`} className="text-sm font-bold text-text-main hover:text-primary-600 truncate block">
                {member.name}
              </Link>
              <p className="text-xs text-text-muted truncate">
                {member.role}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default TeamRoster;
