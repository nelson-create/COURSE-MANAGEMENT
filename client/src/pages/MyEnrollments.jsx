import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { enrollmentService } from '../services/enrollmentService';

const MyEnrollments = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showError } = useToast();

  const [enrollments, setEnrollments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadEnrollments();
  }, []);

  const loadEnrollments = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await enrollmentService.getMyEnrollments();
      
      if (response.success) {
        setEnrollments(response.enrollments);
      }
    } catch (error) {
      console.error('Load enrollments error:', error);
      const message = 'Failed to load your enrollments';
      setError(message);
      showError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewCourse = (courseId) => {
    navigate(`/student/courses/${courseId}/learn`);
  };

  const handleBrowseCourses = () => {
    navigate('/courses');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your enrollments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            My Enrollments
          </h1>
          <p className="text-gray-600">
            Track your progress and continue learning
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
            <button
              onClick={loadEnrollments}
              className="mt-2 text-red-700 hover:text-red-900 font-medium text-sm"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Enrollments */}
        {enrollments.length > 0 ? (
          <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="card p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <span className="text-2xl">📚</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Enrolled Courses</p>
                    <p className="text-2xl font-bold text-gray-900">{enrollments.length}</p>
                  </div>
                </div>
              </div>

              <div className="card p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <span className="text-2xl">📈</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Avg. Progress</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {Math.round(enrollments.reduce((sum, e) => sum + (e.progress || 0), 0) / enrollments.length)}%
                    </p>
                  </div>
                </div>
              </div>

              <div className="card p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <span className="text-2xl">🎓</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Completed</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {enrollments.filter(e => (e.progress || 0) >= 100).length}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Enrollment Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrollments.map((enrollment) => (
                <div key={enrollment.courseId} className="card p-6 hover:shadow-lg transition-shadow duration-200">
                  {/* Course Info */}
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {enrollment.course.title}
                    </h3>
                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                      {enrollment.course.category}
                    </span>
                  </div>

                  {/* Progress */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-600">Progress</span>
                      <span className="text-sm font-medium text-gray-900">{enrollment.progress || 0}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${enrollment.progress || 0}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Enrollment Date */}
                  <div className="mb-4 text-sm text-gray-500">
                    <span>📅 Enrolled {formatDate(enrollment.enrolledAt)}</span>
                  </div>

                  {/* Completed Modules */}
                  <div className="mb-4 text-sm text-gray-600">
                    <span>📖 {enrollment.completedModules?.length || 0} modules completed</span>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => handleViewCourse(enrollment.courseId)}
                    className="w-full btn-primary text-sm"
                  >
                    Continue Learning
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <span className="text-6xl mb-4 block">📚</span>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No enrollments yet
            </h3>
            <p className="text-gray-600 mb-6">
              Start your learning journey by enrolling in courses that interest you.
            </p>
            <button
              onClick={handleBrowseCourses}
              className="btn-primary"
            >
              Browse Course Catalog
            </button>
          </div>
        )}

        {/* Browse More Courses */}
        {enrollments.length > 0 && (
          <div className="mt-12 text-center">
            <div className="card p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Want to learn more?
              </h3>
              <p className="text-gray-600 mb-4">
                Explore our course catalog to find more courses that match your interests
              </p>
              <button
                onClick={handleBrowseCourses}
                className="btn-secondary"
              >
                Browse More Courses
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyEnrollments;