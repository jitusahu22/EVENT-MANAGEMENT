import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function ProtectedRoute({ allowedRole }) {
  const { isAuthenticated, role } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If a specific role is required (e.g. allowedRole = true means 'admin' required)
  if (allowedRole === true && role !== 'admin') {
    return <Navigate to="/user" replace />;
  }

  return <Outlet />;
}
