import api from './api';

export const courseService = {
  // Get all courses (public)
  getAllCourses: async () => {
    const response = await api.get('/courses');
    return response.data;
  },

  // Get single course
  getCourse: async (courseId) => {
    const response = await api.get(`/courses/${courseId}`);
    return response.data;
  },

  // Create course (admin only)
  createCourse: async (courseData) => {
    const response = await api.post('/courses', courseData);
    return response.data;
  },

  // Update course (admin only)
  updateCourse: async (courseId, courseData) => {
    const response = await api.put(`/courses/${courseId}`, courseData);
    return response.data;
  },

  // Delete course (admin only)
  deleteCourse: async (courseId) => {
    const response = await api.delete(`/courses/${courseId}`);
    return response.data;
  },

  // Get admin's courses (filter by current user)
  getAdminCourses: async () => {
    const response = await api.get('/courses');
    return response.data;
  }
};