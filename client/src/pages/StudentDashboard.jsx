import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { courseService } from '../services/courseService';
import { enrollmentService } from '../services/enrollmentService';

const StudentDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showError } = useToast();
  
  const [stats, setStats] = useState({
    totalCourses: 0,
    enrolledCourses: 0,
    completedCourses: 0,
    averageProgress: 0
  });
  const [recentEnrollments, setRecentEnrollments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      
      // Get all courses to show total available
      const coursesResponse = await courseService.getAllCourses();
      
      // Get student's enrollments
      const enrollmentsResponse = await enrollmentService.getMyEnrollments();
      
      if (coursesResponse.success && enrollmentsResponse.success) {
        const enrollments = enrollmentsResponse.enrollments;
        const completedCount = enrollments.filter(e => (e.progress || 0) >= 100).length;
        const avgProgress = enrollments.length > 0 
          ? Math.round(enrollments.reduce((sum, e) => sum + (e.progress || 0), 0) / enrollments.length)
          : 0;

        setStats({
          totalCourses: coursesResponse.courses.length,
          enrolledCourses: enrollments.length,
          completedCourses: completedCount,
          averageProgress: avgProgress
        });

        // Show recent enrollments (last 3)
        setRecentEnrollments(enrollments.slice(0, 3));
      }
      
    } catch (error) {
      console.error('Load dashboard error:', error);
      showError('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBrowseCourses = () => {
    navigate('/courses');
  };

  const handleViewEnrollments = () => {
    navigate('/student/enrollments');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.email?.split('@')[0]}!
          </h1>
          <p className="text-gray-600">
            Continue your learning journey and explore new courses
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <span className="text-2xl">📚</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Available Courses</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalCourses}</p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-2xl">📖</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Enrolled Courses</p>
                <p className="text-2xl font-bold text-gray-900">{stats.enrolledCourses}</p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <span className="text-2xl">📈</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg. Progress</p>
                <p className="text-2xl font-bold text-gray-900">{stats.averageProgress}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Browse Courses */}
          <div className="card p-6">
            <div className="flex items-center mb-4">
              <span className="text-3xl mr-3">🔍</span>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Browse Courses</h3>
                <p className="text-gray-600 text-sm">Discover new courses to expand your skills</p>
              </div>
            </div>
            <button
              onClick={handleBrowseCourses}
              className="w-full btn-primary"
            >
              Explore Course Catalog
            </button>
          </div>

          {/* My Enrollments */}
          <div className="card p-6">
            <div className="flex items-center mb-4">
              <span className="text-3xl mr-3">📋</span>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">My Enrollments</h3>
                <p className="text-gray-600 text-sm">Continue learning from your enrolled courses</p>
              </div>
            </div>
            <button
              onClick={handleViewEnrollments}
              className="w-full btn-secondary"
            >
              View My Courses
            </button>
          </div>
        </div>

        {/* Learning Progress */}
        <div className="card p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Enrollments</h3>
          
          {recentEnrollments.length > 0 ? (
            <div className="space-y-4">
              {recentEnrollments.map((enrollment) => (
                <div key={enrollment.courseId} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{enrollment.course.title}</h4>
                    <p className="text-sm text-gray-600">{enrollment.course.category}</p>
                    <div className="flex items-center mt-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${enrollment.progress || 0}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600">{enrollment.progress || 0}%</span>
                    </div>
                  </div>
<button
                         onClick={() => navigate(`/student/courses/${enrollment.courseId}/learn`)}
                         className="btn-primary text-sm ml-4"
                       >
                    Continue
                  </button>
                </div>
              ))}
              <div className="text-center pt-4">
                <button
                  onClick={handleViewEnrollments}
                  className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                >
                  View All Enrollments →
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <span className="text-4xl mb-4 block">🚀</span>
              <h4 className="text-lg font-medium text-gray-900 mb-2">Start Your Learning Journey</h4>
              <p className="text-gray-600 mb-4">
                You haven't enrolled in any courses yet. Browse our catalog to find courses that interest you.
              </p>
              <button
                onClick={handleBrowseCourses}
                className="btn-primary"
              >
                Browse Courses
              </button>
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{stats.completedCourses}</div>
              <div className="text-sm text-blue-800">Completed Courses</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{stats.averageProgress}%</div>
              <div className="text-sm text-green-800">Average Progress</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;