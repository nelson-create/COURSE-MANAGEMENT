import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { courseService } from '../services/courseService';
import CourseCard from '../components/CourseCard';
import DeleteConfirmModal from '../components/DeleteConfirmModal';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, course: null, isDeleting: false });

  // Load admin's courses
  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await courseService.getAllCourses();
      
      if (response.success) {
        // Filter courses created by current admin
        const adminCourses = response.courses.filter(
          course => course.createdBy.id === user.id || course.createdBy._id === user.id
        );
        setCourses(adminCourses);
      }
    } catch (error) {
      console.error('Load courses error:', error);
      setError('Failed to load courses');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateCourse = () => {
    navigate('/admin/courses/create');
  };

  const handleEditCourse = (course) => {
    navigate(`/admin/courses/${course.id}/edit`);
  };

  const handleDeleteCourse = (course) => {
    setDeleteModal({ isOpen: true, course, isDeleting: false });
  };

  const confirmDelete = async () => {
    const { course } = deleteModal;
    setDeleteModal(prev => ({ ...prev, isDeleting: true }));
    
    try {
      const response = await courseService.deleteCourse(course.id);
      if (response.success) {
        showSuccess('Course deleted successfully');
        await loadCourses(); // Reload courses
        setDeleteModal({ isOpen: false, course: null, isDeleting: false });
      }
    } catch (error) {
      console.error('Delete course error:', error);
      const message = error.response?.data?.message || 'Failed to delete course';
      showError(message);
      setDeleteModal(prev => ({ ...prev, isDeleting: false }));
    }
  };

  const closeDeleteModal = () => {
    if (!deleteModal.isDeleting) {
      setDeleteModal({ isOpen: false, course: null, isDeleting: false });
    }
  };

  // Calculate stats
  const totalCourses = courses.length;
  const totalEnrollments = courses.reduce((sum, course) => sum + (course.enrollmentCount || 0), 0);
  const averageEnrollments = totalCourses > 0 ? Math.round(totalEnrollments / totalCourses) : 0;

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
            Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Manage your courses and track student engagement
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
                <p className="text-sm font-medium text-gray-600">Total Courses</p>
                <p className="text-2xl font-bold text-gray-900">{totalCourses}</p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-2xl">👥</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Enrollments</p>
                <p className="text-2xl font-bold text-gray-900">{totalEnrollments}</p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <span className="text-2xl">📈</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg. Enrollments</p>
                <p className="text-2xl font-bold text-gray-900">{averageEnrollments}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Courses Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">My Courses</h2>
            <button
              onClick={handleCreateCourse}
              className="btn-primary flex items-center space-x-2"
            >
              <span>➕</span>
              <span>Create Course</span>
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Courses Grid */}
        {courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                onEdit={handleEditCourse}
                onDelete={handleDeleteCourse}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <span className="text-6xl mb-4 block">📚</span>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No courses yet
            </h3>
            <p className="text-gray-600 mb-6">
              Create your first course to get started with the platform.
            </p>
            <button
              onClick={handleCreateCourse}
              className="btn-primary"
            >
              Create Your First Course
            </button>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        <DeleteConfirmModal
          isOpen={deleteModal.isOpen}
          onClose={closeDeleteModal}
          onConfirm={confirmDelete}
          courseName={deleteModal.course?.title}
          isDeleting={deleteModal.isDeleting}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;