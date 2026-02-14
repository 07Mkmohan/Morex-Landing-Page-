import { Navigate, useLocation } from 'react-router-dom';
import type { Role } from '../types';
import { useAuth } from '../hooks/useAuth';

interface Props {
  children: React.ReactNode;
  role?: Role;
}

const ProtectedRoute = ({ children, role }: Props) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="centered">
        <div className="spinner" />
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
