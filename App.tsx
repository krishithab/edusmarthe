
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider, useUser } from './context/UserContext';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import OnboardingPage from './pages/OnboardingPage';
import UserHome from './pages/UserHome';
import StudentDashboard from './pages/StudentDashboard';
import LearningHub from './pages/LearningHub';
import StartupHub from './pages/StartupHub';
import NetworkFeed from './pages/NetworkFeed';
import MentorDiscovery from './pages/MentorDiscovery';
import AdminDashboard from './pages/AdminDashboard';
import EventsPage from './pages/EventsPage';
import PublicProfile from './pages/PublicProfile';
import SettingsPage from './pages/SettingsPage';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { session, loading } = useUser();
  
  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-background-dark text-white">
        <div className="size-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-bold uppercase tracking-widest text-slate-400">Verifying Identity...</p>
      </div>
    );
  }
  
  return session ? <>{children}</> : <Navigate to="/" />;
};

const AppRoutes = () => {
  const { session, loading } = useUser();

  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-background-dark text-white">
        <div className="size-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-bold uppercase tracking-widest text-slate-400">Syncing Ecosystem...</p>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={session ? <UserHome /> : <LandingPage />} />
      <Route path="/login" element={session ? <Navigate to="/" /> : <LoginPage />} />
      <Route path="/onboarding" element={session ? <Navigate to="/" /> : <OnboardingPage />} />
      
      {/* Publicly Accessible Profiles */}
      <Route path="/profile/:id" element={<PublicProfile />} />
      
      {/* Protected Routes */}
      <Route path="/dashboard" element={<ProtectedRoute><StudentDashboard /></ProtectedRoute>} />
      <Route path="/learning" element={<ProtectedRoute><LearningHub /></ProtectedRoute>} />
      <Route path="/startups" element={<ProtectedRoute><StartupHub /></ProtectedRoute>} />
      <Route path="/network" element={<ProtectedRoute><NetworkFeed /></ProtectedRoute>} />
      <Route path="/mentors" element={<ProtectedRoute><MentorDiscovery /></ProtectedRoute>} />
      <Route path="/events" element={<ProtectedRoute><EventsPage /></ProtectedRoute>} />
      <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
      
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <UserProvider>
      <Router>
        <AppRoutes />
      </Router>
    </UserProvider>
  );
};

export default App;
