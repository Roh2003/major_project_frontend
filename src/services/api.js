import axios from "axios"
import { toast } from "react-toastify"

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://api.skillup.com",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
})

// Request interceptor - Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response interceptor - Handle errors globally
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response

      switch (status) {
        case 401:
          toast.error("Unauthorized. Please login again.")
          localStorage.removeItem("authToken")
          window.location.href = "/login"
          break
        case 403:
          toast.error("Access forbidden.")
          break
        case 404:
          toast.error("Resource not found.")
          break
        case 500:
          toast.error("Server error. Please try again later.")
          break
        default:
          toast.error(data.message || "An error occurred.")
      }
    } else if (error.request) {
      // Request made but no response
      toast.error("Network error. Please check your connection.")
    } else {
      // Something else happened
      toast.error("An unexpected error occurred.")
    }

    return Promise.reject(error)
  },
)

// API Methods
export const apiService = {
  // Auth
  login: (credentials) => api.post("/auth/login", credentials),
  logout: () => api.post("/auth/logout"),
  forgotPassword: (email) => api.post("/auth/forgot-password", { email }),

  // Users
  getUsers: (params) => api.get("/users", { params }),
  getUserById: (id) => api.get(`/users/${id}`),
  createUser: (data) => api.post("/users", data),
  updateUser: (id, data) => api.put(`/users/${id}`, data),
  deleteUser: (id) => api.delete(`/users/${id}`),

  // Analytics
  getUserStats: (period) => api.get("/analytics/users", { params: { period } }),

  // Masters
  getCourses: () => api.get("/masters/courses"),
  createCourse: (data) => api.post("/masters/courses", data),
  updateCourse: (id, data) => api.put(`/masters/courses/${id}`, data),
  deleteCourse: (id) => api.delete(`/masters/courses/${id}`),

  // Counselors
  getCounselors: () => api.get("/counselors"),
  createCounselor: (data) => api.post("/counselors", data),
  updateCounselor: (id, data) => api.put(`/counselors/${id}`, data),
  deleteCounselor: (id) => api.delete(`/counselors/${id}`),

  // Sessions
  getSessions: () => api.get("/sessions"),
  createSession: (data) => api.post("/sessions", data),
  updateSession: (id, data) => api.put(`/sessions/${id}`, data),

  // Resources
  getResources: (filters) => api.get("/resources", { params: filters }),
  createResource: (data) => api.post("/resources", data),
  updateResource: (id, data) => api.put(`/resources/${id}`, data),
  deleteResource: (id) => api.delete(`/resources/${id}`),

  // Reports
  getReports: (type, period) => api.get("/reports", { params: { type, period } }),
}

export default api
