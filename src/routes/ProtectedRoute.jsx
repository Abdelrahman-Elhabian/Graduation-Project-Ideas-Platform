/**
 * Protected Route Component
 * Redirects unauthenticated users to the login page
 */

import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Box, CircularProgress } from '@mui/material';

const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking auth state
  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          background: '#0B0F1A'
        }}
      >
        <CircularProgress
          sx={{
            color: '#7C3AED',
            '& .MuiCircularProgress-circle': {
              strokeLinecap: 'round'
            }
          }}
          size={48}
          thickness={4}
        />
      </Box>
    );
  }

  // Redirect to login if not authenticated
  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
