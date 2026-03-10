// src/components/AdminRedirectRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRedirectRoute = ({ children }) => {
  const { isAdmin, loading } = useAuth();

  if (loading) return null;

  if (isAdmin) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
};

export default AdminRedirectRoute;