import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getToken, isTokenExpired, removeToken } from '../services/auth';

export default function ProtectedRoute({ children }) {
  const location = useLocation();
  const token = getToken();

  if (!token) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  if (isTokenExpired(token)) {
    removeToken();
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
}
