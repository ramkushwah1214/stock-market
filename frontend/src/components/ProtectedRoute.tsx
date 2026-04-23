import type { ReactElement } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { useAuth } from '../contexts/AuthContext';


export default function ProtectedRoute({ children }: { children: ReactElement }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Checking session...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}
