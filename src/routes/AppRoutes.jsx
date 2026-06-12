import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ROLES } from '../utils/constants.js';
import { authService } from '../services/authService.js';
import ProtectedRoute from '../components/ProtectedRoute.jsx';

import AuthLayout from '../layouts/AuthLayout.jsx';
import Login from '../pages/auth/Login.jsx';
import Register from '../pages/auth/Register.jsx';

import AdminLayout from '../layouts/AdminLayout.jsx';
import AdminDashboard from '../pages/admin/Dashboard.jsx';
import AdminExams from '../pages/admin/Exams.jsx';
import CreateExam from '../pages/admin/CreateExam.jsx';
import AdminResults from '../pages/admin/Results.jsx';

import StudentLayout from '../layouts/StudentLayout.jsx';
import StudentDashboard from '../pages/student/Dashboard.jsx';
import AvailableExams from '../pages/student/AvailableExams.jsx';
import TakeExam from '../pages/student/TakeExam.jsx';
import StudentResult from '../pages/student/Result.jsx';
import StudentHistory from '../pages/student/History.jsx';
import ReviewAnswers from '../pages/student/ReviewAnswers.jsx';

export default function AppRoutes() {
  useEffect(() => {
    authService.initUsers();
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/auth/login" replace />} />
      
      <Route path="/auth" element={<AuthLayout />}>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
      </Route>

      <Route path="/admin" element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]}><AdminLayout /></ProtectedRoute>}>
        <Route index element={<AdminDashboard />} />
        <Route path="exams" element={<AdminExams />} />
        <Route path="exams/create" element={<CreateExam />} />
        <Route path="exams/edit/:id" element={<CreateExam />} />
        <Route path="results" element={<AdminResults />} />
      </Route>

      <Route path="/student" element={<ProtectedRoute allowedRoles={[ROLES.STUDENT, ROLES.ADMIN]}><StudentLayout /></ProtectedRoute>}>
        <Route index element={<StudentDashboard />} />
        <Route path="exams" element={<AvailableExams />} />
        <Route path="exams/take/:id" element={<TakeExam />} />
        <Route path="result/:id" element={<StudentResult />} />
        <Route path="history" element={<StudentHistory />} />
        <Route path="review/:id" element={<ReviewAnswers />} />
      </Route>
    </Routes>
  );
}