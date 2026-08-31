import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';
import type { Role } from '../types';

interface Props {
  requiredRole?: Role;
  loginPath?: string;
}

export default function ProtectedRoute({ requiredRole, loginPath = '/login' }: Props) {
  const { accessToken, user } = useAppSelector((s) => s.auth);
  const location = useLocation();

  if (!accessToken) {
    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    if (user?.role === 'ADMIN') return <Navigate to="/admin" replace />;
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
