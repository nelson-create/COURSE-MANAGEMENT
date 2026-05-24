import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import CreateCourse from './pages/CreateCourse';
import EditCourse from './pages/EditCourse';
import StudentDashboard from './pages/StudentDashboard';
import CourseCatalog from './pages/CourseCatalog';
import CourseDetail from './pages/CourseDetail';
import CourseLearn from './pages/CourseLearn';
import MyEnrollments from './pages/MyEnrollments';

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              
              {/* Public Course Catalog */}
              <Route path="/courses" element={<CourseCatalog />} />
              
              {/* Public Course Detail */}
              <Route path="/courses/:courseId" element={<CourseDetail />} />
              
              {/* Protected Admin Routes */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/courses/create"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <CreateCourse />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/courses/:courseId/edit"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <EditCourse />
                  </ProtectedRoute>
                }
              />
              
              {/* Protected Student Routes */}
              <Route
                path="/student"
                element={
                  <ProtectedRoute requiredRole="student">
                    <StudentDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/enrollments"
                element={
                  <ProtectedRoute requiredRole="student">
                    <MyEnrollments />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/courses/:courseId/learn"
                element={
                  <ProtectedRoute requiredRole="student">
                    <CourseLearn />
                  </ProtectedRoute>
                }
              />
              
              {/* Default Redirect */}
              <Route path="/" element={<Navigate to="/courses" replace />} />
              
              {/* Catch all - redirect to courses */}
              <Route path="*" element={<Navigate to="/courses" replace />} />
            </Routes>
          </div>
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;