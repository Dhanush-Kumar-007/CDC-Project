import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Spinner from './Spinner';

/**
 * Usage: <Route element={<ProtectedRoute allowedRole="student" />}>...</Route>
 * Redirects unauthenticated users to the right login page, and redirects
 * users with the wrong role away entirely (a student can't view /admin/*).
 * This is a UX convenience — every real permission check happens again on
 * the backend via authMiddleware/roleMiddleware.
 */
const ProtectedRoute = ({ allowedRole }) => {
  const { isAuthenticated, role, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Spinner label="Checking your session…" />;
  }

  if (!isAuthenticated) {
    const loginPath = allowedRole === 'admin' ? '/admin/login' : '/login';
    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }

  if (allowedRole && role !== allowedRole) {
    return <Navigate to={role === 'admin' ? '/admin/dashboard' : '/dashboard'} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
