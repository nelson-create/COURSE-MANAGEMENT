import api from './api';

export const enrollmentService = {
  // Enroll in course (student only)
  enrollInCourse: async (courseId) => {
    const response = await api.post('/enrollments', { courseId });
    return response.data;
  },

  // Get student's enrollments
  getMyEnrollments: async () => {
    const response = await api.get('/enrollments/my');
    return response.data;
  },

  // Get enrollment status for specific course
  getEnrollmentStatus: async (courseId) => {
    const response = await api.get(`/enrollments/${courseId}`);
    return response.data;
  },

  // Update course progress
  updateProgress: async (courseId, completedModules) => {
    const response = await api.put(`/enrollments/${courseId}/progress`, {
      completedModules
    });
    return response.data;
  },

  // Unenroll from course
  unenrollFromCourse: async (courseId) => {
    const response = await api.delete(`/enrollments/${courseId}`);
    return response.data;
  }
};