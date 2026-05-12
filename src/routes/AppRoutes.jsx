/**
 * App Routes Configuration
 * Defines all application routes with protected route wrappers
 */

import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProtectedRoute from './ProtectedRoute';
import DashboardLayout from '../layouts/DashboardLayout';

// Pages
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import TeamDashboard from '../pages/TeamDashboard';
import CreateTeamPage from '../pages/CreateTeamPage';
import JoinTeamPage from '../pages/JoinTeamPage';
import AddIdeaPage from '../pages/AddIdeaPage';
import IdeaDetailsPage from '../pages/IdeaDetailsPage';
import ProfilePage from '../pages/ProfilePage';
import NotFoundPage from '../pages/NotFoundPage';

const AppRoutes = () => {
  const { currentUser } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route
        path="/login"
        element={currentUser ? <Navigate to="/dashboard" replace /> : <LoginPage />}
      />
      <Route
        path="/register"
        element={currentUser ? <Navigate to="/dashboard" replace /> : <RegisterPage />}
      />

      {/* Protected Routes with Dashboard Layout */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<TeamDashboard />} />
        <Route path="create-team" element={<CreateTeamPage />} />
        <Route path="join-team" element={<JoinTeamPage />} />
        <Route path="add-idea" element={<AddIdeaPage />} />
        <Route path="idea/:ideaId" element={<IdeaDetailsPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>

      {/* 404 Page */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
