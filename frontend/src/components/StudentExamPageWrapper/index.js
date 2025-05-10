import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import StudentExamPage from '../../pages/StudentExamPage';

/**
 * Wrapper component for StudentExamPage that handles authentication
 * and proper redirection flow for exam links
 */
const StudentExamPageWrapper = () => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>;
  }

  // If not authenticated, redirect to login with the current URL as the redirect target
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // If authenticated but not a student, redirect to home
  if (user.role !== 'etudiant') {
    return <Navigate to="/" state={{ message: "Seuls les étudiants peuvent accéder aux examens" }} replace />;
  }

  // If authenticated and is a student, render the exam page
  return <StudentExamPage />;
};

export default StudentExamPageWrapper;
