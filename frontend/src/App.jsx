import { Routes, Route } from 'react-router-dom';
import ScrollToTop from './components/layout/ScrollToTop';
import AtmosphericBackground from './components/layout/AtmosphericBackground';
import FloatingNavbar from './components/layout/FloatingNavbar';
import LandingPage from './pages/LandingPage';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ProfilePage from './pages/ProfilePage';
import Portfolio from './pages/Portfolio';
import Explore from './pages/Explore';
import ProjectsFeed from './pages/ProjectsFeed';
import ProjectDetail from './pages/ProjectDetail';
import CreateProject from './pages/CreateProject';
import CreatorDashboard from './pages/CreatorDashboard';
import ManageApplicants from './pages/ManageApplicants';
import CollaborationWorkspace from './pages/CollaborationWorkspace';

function App() {
  return (
    <>
      <AtmosphericBackground />
      <FloatingNavbar />
      <ScrollToTop />
      
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/profile/:id" element={<ProfilePage />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/projects" element={<ProjectsFeed />} />
        <Route path="/projects/create" element={<CreateProject />} />
        <Route path="/projects/:id" element={<ProjectDetail />} />
        <Route path="/projects/:id/manage-applicants" element={<ManageApplicants />} />
        <Route path="/collaboration/:projectId" element={<CollaborationWorkspace />} />
        <Route path="/dashboard" element={<CreatorDashboard />} />
      </Routes>
    </>
  );
}

export default App;
