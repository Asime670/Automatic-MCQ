import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { ROLES } from '../utils/constants.js';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/auth/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === ROLES.STUDENT) {
      return <Navigate to="/student" state={{ error: "Access Denied: You do not have admin privileges." }} replace />;
    }
    return <Navigate to="/" replace />;
  }
  return children;
}