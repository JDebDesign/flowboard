import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { LoadingScreen } from './LoadingScreen';

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading, slowLoading } = useAuth();

  if (loading) return <LoadingScreen slow={slowLoading} />;

  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}
