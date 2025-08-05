import { Navigate } from 'react-router-dom';
import AuthService from '../services/AuthService';

/**
 * Protected Route component that redirects to login page if user is not authenticated
 * Updated for React Router v7
 */
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = AuthService.isAuthenticated();
  
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
