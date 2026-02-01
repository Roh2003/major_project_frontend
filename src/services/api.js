import axios from "axios"
import { toast } from "react-toastify"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
// Create axios instance with base configuration
const API = axios.create({
  baseURL: API_BASE_URL || "https://API.skillup.com",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
})

// Request interceptor - Add auth token to requests
API.interceptors.request.use(
  (config) => {
    // Try admin token first, then tutor token
    const token = localStorage.getItem("adminToken") || localStorage.getItem("tutorToken")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// // Response interceptor - Handle errors globally
API.interceptors.response.use(
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

export default API
