import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Welcome from '../pages/Welcome';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import TeacherDashboardPage from '../pages/TeacherDashboardPage';
import CreateExamPage from '../pages/TeacherDashboardPage/CreateExamPage';
import QuestionPage from '../pages/TeacherDashboardPage/QuestionPage';
import EditExamPage from '../pages/TeacherDashboardPage/EditExamPage'; 
import EditQuestionPage from '../pages/TeacherDashboardPage/EditQuestionPage';
import ExamResultsPage from '../pages/TeacherDashboardPage/ExamResultsPage';
import SubmissionDetailsPage from '../pages/TeacherDashboardPage/SubmissionDetailsPage';
import ProfilePage from '../pages/ProfilePage'; 
import ProtectedRoute from './ProtectedRoute';
import { useAuth } from '../contexts/AuthContext';
import StudentExamPage from '../pages/StudentExamPage';
import StudentDashboardPage from '../pages/StudentDashboardPage'; 
import StudentResultsPage from '../pages/StudentResultsPage';
import StudentExamPageWrapper from '../components/StudentExamPageWrapper';

export default function AppRoutes() {
  const { user } = useAuth(); // Get user to redirect if already logged in

  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute allowedRoles={["enseignant"]} />}>
        <Route path="/teacher/dashboard" element={<TeacherDashboardPage />} />
        <Route path="/teacher/exams/new" element={<CreateExamPage />} />
        <Route path="/teacher/exams/:id/edit" element={<EditExamPage />} />
        <Route path="/teacher/exams/:examId/questions/new" element={<QuestionPage />} />
        <Route path="/teacher/exams/:examId/questions/:questionId/edit" element={<EditQuestionPage />} />
        <Route path="/teacher/exams/:examId/results" element={<ExamResultsPage />} />
        <Route path="/teacher/exams/:examId/submissions/:submissionId" element={<SubmissionDetailsPage />} />
      </Route>

      {/* Add other public or student-specific routes here */}
      <Route element={<ProtectedRoute allowedRoles={["etudiant"]} />}>
        <Route path="/student/dashboard" element={<StudentDashboardPage />} /> {/* Add route for StudentDashboardPage */}
        <Route path="/student/results/:submissionId" element={<StudentResultsPage />} /> {/* Route for student results detail */}
      </Route>
      
      {/* Exam link route - Using a render prop approach for better control */}
      <Route path="/exam/:link" element={<StudentExamPageWrapper />} />

      {/* Profile route - accessible to all authenticated users */}
      <Route element={<ProtectedRoute allowedRoles={["enseignant", "etudiant"]} />}>
        <Route path="/profile" element={<ProfilePage />} />
      </Route>

      {/* Fallback for unmatched routes */}
      {/* <Route path="*" element={<NotFoundPage />} /> */}
    </Routes>
  );
}
