import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

const tutorService = {
  // Tutor Signup
  tutorSignup: async (data) => {
    return await axios.post(`${API_URL}/tutor/signup`, data);
  },

  // Tutor Login
  tutorLogin: async (credentials) => {
    return await axios.post(`${API_URL}/tutor/login`, credentials);
  },

  // Get Tutor Profile
  getTutorProfile: async (token) => {
    return await axios.get(`${API_URL}/tutor/profile`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  },

  // Update Tutor Profile
  updateTutorProfile: async (token, data) => {
    return await axios.post(`${API_URL}/tutor/update-profile`, data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  },

  // Get Tutor Courses
  getTutorCourses: async (token) => {
    return await axios.get(`${API_URL}/admin/courses`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  },

  // Create Course
  createCourse: async (token, courseData) => {
    return await axios.post(`${API_URL}/admin/courses`, courseData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  },

  // Update Course
  updateCourse: async (token, courseId, courseData) => {
    return await axios.put(`${API_URL}/admin/courses/${courseId}`, courseData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  },

  // Delete Course
  deleteCourse: async (token, courseId) => {
    return await axios.delete(`${API_URL}/admin/courses/${courseId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }
};

export default tutorService;
