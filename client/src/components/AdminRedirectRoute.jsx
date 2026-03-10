// components/AdminRedirectRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRedirectRoute = ({ children }) => {
  const { user } = useAuth();

  // Хэрэв админ нэвтэрсэн бол dashboard руу шууд явуулна
  if (user?.isAdmin) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  // Нэвтрээгүй бол login хуудас харуулна
  return children;
};

export default AdminRedirectRoute;