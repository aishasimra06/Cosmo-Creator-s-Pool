import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useParams } from 'react-router-dom';
import { Settings, Calendar, TrendingUp, FolderGit2, Loader2, ArrowRight, Briefcase, MapPin, FileText, CheckCircle, Star } from 'lucide-react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import EditProfileModal from '../components/profile/EditProfileModal';

const ProfilePage = () => {
  const { user } = useAuth();
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      let profileData;
      if (id) {
        const res = await api.get(`/users/${id}`);
        profileData = res.data;
      } else if (user?.userId) {
        const res = await api.get(`/users/${user.userId}`);
        profileData = res.data;
      } else {
        const res = await api.get('/auth/me');
        profileData = res.data;
      }
      setProfile(profileData);
      
      // Fetch portfolios
      if (profileData && profileData.id) {
        try {
          const portsRes = await api.get(`/portfolios/user/${profileData.id}`);
          setPortfolios(portsRes.data);
        } catch (e) {
          console.error("Failed to load portfolios", e);
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user, id]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Loader2 className="animate-spin text-primary-500" size={40} />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen pt-32 px-4 text-center">
        <div className="p-4 bg-red-100 text-red-600 rounded-xl inline-block border border-red-200">
          {error || 'Please log in to view your profile.'}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 max-w-6xl mx-auto relative z-10">
      
      {/* Header Profile Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="glass-panel p-8 md:p-10 mb-8"
      >
        <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
          {/* Avatar Area */}
          <div className="relative">
            <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-sand-300 to-white border-2 border-white shadow-lg overflow-hidden flex items-center justify-center">
              {profile.avatarUrl ? (
                <img src={profile.avatarUrl} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-4xl font-bold text-text-light/50">{profile.name?.charAt(0) || 'U'}</span>
              )}
            </div>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-light-bg"></div>
          </div>

          {/* Profile Info */}
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-text-main mb-1">{profile.name}</h1>
                <p className="text-lg font-medium text-primary-600 mb-4">
                  {profile.title || ((profile.roles && profile.roles.length > 0) ? profile.roles[0] : 'Creator')}
                </p>
              </div>
              {user?.userId === profile.id && (
                <button onClick={() => setIsEditModalOpen(true)} className="btn-cinematic px-4 py-2 hidden sm:flex">
                  <Settings size={18} /> Edit Profile
                </button>
              )}
            </div>
            
            <p className="text-text-muted mb-6 max-w-2xl text-lg leading-relaxed">{profile.bio || 'This creator has not added a bio yet.'}</p>
            
            <div className="flex flex-wrap gap-4 text-sm font-medium text-text-muted">
              {profile.location && <span className="flex items-center gap-1.5"><MapPin size={16} className="text-primary-500"/> {profile.location}</span>}
              <span className="flex items-center gap-1.5"><Calendar size={16} className="text-text-light"/> Registered Member</span>
              {profile.resumeUrl && (
                <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-primary-600 hover:underline">
                  <FileText size={16} /> View Resume
                </a>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Grid Layout for Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Column (Stats & Skills) */}
        <div className="md:col-span-1 space-y-8">
          
          {/* Stats Card */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass-panel p-6"
          >
            <h3 className="text-sm font-mono uppercase tracking-widest text-text-muted mb-6">Ecosystem Metrics</h3>
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3 text-text-main font-medium"><FolderGit2 size={18} className="text-primary-500"/> Owned Projects</div>
                <span className="text-xl font-bold">{profile.projectCount || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3 text-text-main font-medium"><TrendingUp size={18} className="text-accent-500"/> Portfolio Items</div>
                <span className="text-xl font-bold">{profile.portfolioCount || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3 text-text-main font-medium"><CheckCircle size={18} className="text-green-500"/> Completed Collabs</div>
                <span className="text-xl font-bold">{profile.completedCollaborations || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3 text-text-main font-medium"><Star size={18} className="text-yellow-500"/> Creator Rating</div>
                <span className="text-xl font-bold">{profile.creatorRating ? profile.creatorRating.toFixed(1) : 'New'}</span>
              </div>
            </div>
          </motion.div>

          {/* Skills Card */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="glass-panel p-6"
          >
            <h3 className="text-sm font-mono uppercase tracking-widest text-text-muted mb-6">Verified Skills</h3>
            {profile.skills && profile.skills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill, index) => (
                  <span key={index} className="px-3 py-1.5 bg-white/50 border border-white/60 rounded-lg text-sm font-medium text-text-main shadow-sm">
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-text-muted">No skills added yet.</p>
            )}
          </motion.div>
        </div>

        {/* Right Column (Portfolio & Activity) */}
        <div className="md:col-span-2 space-y-8">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex justify-between items-end mb-2"
          >
            <h2 className="text-2xl font-bold text-text-main">Featured Work</h2>
            {user?.userId === profile.id && (
              <Link to="/portfolio" className="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center gap-1 transition-colors">
                Manage portfolio <ArrowRight size={16} />
              </Link>
            )}
          </motion.div>

          {/* Portfolio Grid */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            {portfolios.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {portfolios.map((item) => (
                  <div key={item.id} className="glass-panel glass-panel-hover p-2 group cursor-pointer">
                    <div className="aspect-[4/3] bg-gradient-to-br from-sand-300/50 to-white/30 rounded-xl mb-4 overflow-hidden relative border border-white/40">
                      {item.thumbnailUrl ? (
                         <img src={item.thumbnailUrl} className="w-full h-full object-cover" alt="portfolio" />
                      ) : (
                         <>
                           <div className="absolute inset-0 bg-noise opacity-10"></div>
                           <div className="absolute bottom-[-20%] right-[-20%] w-32 h-32 bg-primary-400/20 rounded-full blur-xl group-hover:bg-primary-400/40 transition-all duration-500"></div>
                         </>
                      )}
                    </div>
                    <div className="px-2 pb-2">
                      <h4 className="font-bold text-text-main">{item.title}</h4>
                      <p className="text-sm text-text-muted mt-1">{item.description?.substring(0, 50)}...</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="glass-panel p-10 text-center">
                <Briefcase size={40} className="mx-auto text-text-light mb-4" />
                <h3 className="text-xl font-bold text-text-main mb-2">No Portfolio Items</h3>
                <p className="text-text-muted">
                  {user?.userId === profile.id ? "You haven't uploaded any work yet." : "This creator hasn't uploaded any work yet."}
                </p>
              </div>
            )}
          </motion.div>

        </div>
      </div>
      <EditProfileModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        profile={profile} 
        onUpdate={fetchProfile} 
      />
    </div>
  );
};

export default ProfilePage;
