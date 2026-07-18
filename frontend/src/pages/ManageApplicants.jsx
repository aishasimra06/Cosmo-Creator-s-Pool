import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Filter, ArrowLeft, Search, Loader2 } from 'lucide-react';
import api from '../utils/api';
import ApplicantCard from '../components/projects/ApplicantCard';
import ApplicationDetailsModal from '../components/projects/ApplicationDetailsModal';

const ManageApplicants = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [project, setProject] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedApplication, setSelectedApplication] = useState(null);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [projectRes, applicantsRes] = await Promise.all([
        api.get(`/projects/${id}`),
        api.get(`/projects/${id}/applicants`)
      ]);
      setProject(projectRes.data);
      setApplicants(applicantsRes.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load applicant data. Please ensure you are the project owner.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (applicationId, status) => {
    try {
      let endpoint = '';
      if (status === 'SHORTLISTED') endpoint = `/applications/${applicationId}/shortlist`;
      if (status === 'ACCEPTED') endpoint = `/applications/${applicationId}/accept`;
      if (status === 'REJECTED') endpoint = `/applications/${applicationId}/reject`;

      await api.put(endpoint);
      
      // Update local state smoothly
      setApplicants(prev => prev.map(app => 
        app.id === applicationId ? { ...app, status } : app
      ));
    } catch (err) {
      console.error('Failed to update status', err);
      alert('Failed to update application status.');
    }
  };

  const filteredApplicants = applicants.filter(app => {
    const matchesStatus = filterStatus === 'ALL' || app.status === filterStatus;
    const matchesSearch = app.applicantName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          app.requestedRole?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const statuses = ['ALL', 'PENDING', 'SHORTLISTED', 'ACCEPTED', 'REJECTED'];

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <Loader2 className="animate-spin text-primary-500" size={48} />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen pt-24 flex flex-col items-center justify-center text-center px-4">
        <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
          <Users size={32} className="text-red-500" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-4">Access Denied</h2>
        <p className="text-text-muted max-w-md mb-8">{error}</p>
        <button onClick={() => navigate('/dashboard')} className="btn-cinematic px-8 py-3">
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20 px-6 max-w-7xl mx-auto relative z-10">
      
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <Link to={`/projects/${id}`} className="text-primary-400 hover:text-primary-300 flex items-center gap-2 text-sm font-medium mb-6 w-fit">
          <ArrowLeft size={16} /> Back to Project
        </Link>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-text-main mb-3">
              Applicant Review
            </h1>
            <p className="text-lg text-text-muted flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary-500"></span>
              {project.title}
            </p>
          </div>
          <div className="flex gap-4">
            <div className="text-center px-6 py-3 glass-panel !bg-white/80 rounded-2xl border border-white/40">
              <p className="text-2xl font-bold text-text-main">{applicants.length}</p>
              <p className="text-xs text-text-muted uppercase tracking-wider">Total Applicants</p>
            </div>
            <div className="text-center px-6 py-3 glass-panel !bg-white/80 rounded-2xl border border-white/40">
              <p className="text-2xl font-bold text-green-500">{applicants.filter(a => a.status === 'ACCEPTED').length}/{project.teamSize}</p>
              <p className="text-xs text-text-muted uppercase tracking-wider">Team Size</p>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Sidebar Filters */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full lg:w-64 flex-shrink-0 space-y-6"
        >
          <div className="glass-panel !bg-white/80 p-5 rounded-2xl border border-white/40 sticky top-28">
            <h3 className="text-sm font-bold text-text-main uppercase tracking-wider mb-4 flex items-center gap-2">
              <Filter size={16} className="text-primary-500" /> Filters
            </h3>
            
            <div className="relative mb-6">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input 
                type="text" 
                placeholder="Search name or role..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/50 border border-white/60 rounded-xl py-2 pl-9 pr-4 text-sm text-text-main placeholder-text-light focus:outline-none focus:border-primary-500 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <p className="text-xs text-text-muted mb-2 font-medium">STATUS</p>
              {statuses.map(status => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all flex justify-between items-center ${
                    filterStatus === status 
                      ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/20' 
                      : 'text-text-muted hover:bg-black/5 hover:text-text-main'
                  }`}
                >
                  {status === 'ALL' ? 'All Applicants' : status.charAt(0) + status.slice(1).toLowerCase()}
                  <span className={`text-xs px-2 py-0.5 rounded-full ${filterStatus === status ? 'bg-black/20 text-white' : 'bg-black/5 text-text-muted'}`}>
                    {status === 'ALL' ? applicants.length : applicants.filter(a => a.status === status).length}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Applicants Grid */}
        <div className="flex-1">
          {filteredApplicants.length > 0 ? (
            <motion.div 
              layout
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <AnimatePresence>
                {filteredApplicants.map(app => (
                  <ApplicantCard 
                    key={app.id} 
                    application={app} 
                    onShortlist={(id) => handleUpdateStatus(id, 'SHORTLISTED')}
                    onAccept={(id) => handleUpdateStatus(id, 'ACCEPTED')}
                    onReject={(id) => handleUpdateStatus(id, 'REJECTED')}
                    onViewDetails={setSelectedApplication}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="glass-panel border-dashed border-2 border-white/10 rounded-3xl p-12 text-center flex flex-col items-center justify-center min-h-[400px]"
            >
              <Users size={48} className="text-text-muted mb-4 opacity-50" />
              <h3 className="text-xl font-bold text-white mb-2">No applicants found</h3>
              <p className="text-text-muted max-w-sm">
                {searchQuery || filterStatus !== 'ALL' 
                  ? "Try adjusting your search filters to see more results." 
                  : "You haven't received any applications for this project yet."}
              </p>
              {(searchQuery || filterStatus !== 'ALL') && (
                <button 
                  onClick={() => { setFilterStatus('ALL'); setSearchQuery(''); }}
                  className="mt-6 text-primary-400 font-medium hover:text-primary-300 transition-colors"
                >
                  Clear filters
                </button>
              )}
            </motion.div>
          )}
        </div>
      </div>

      <ApplicationDetailsModal 
        isOpen={!!selectedApplication} 
        onClose={() => setSelectedApplication(null)}
        application={selectedApplication}
      />

    </div>
  );
};

export default ManageApplicants;
