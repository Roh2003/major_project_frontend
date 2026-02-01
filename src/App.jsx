"use client"

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import { useState, useEffect } from "react"
import LandingPage from "./pages/LandingPage"
import LoginPage from "./pages/LoginPage"
import DashboardLayout from "./layouts/DashboardLayout"
import AllUsersPage from "./pages/AllUsersPage"
import MasterPage from "./pages/MasterPage"
import CounselorPage from "./pages/CounselorPage"
import ReportsPage from "./pages/ReportsPage"
import ResourcesPage from "./pages/ResourcesPage"
import TutorSignupPage from "./pages/TutorSignupPage"
import TutorDashboardLayout from "./layouts/TutorDashboardLayout"
import TutorCoursesPage from "./pages/tutor/TutorCoursesPage"
import TutorEarningsPage from "./pages/tutor/TutorEarningsPage"
import TutorCourseFormPage from "./pages/tutor/TutorCourseFormPage"
import TutorLessonsPage from "./pages/tutor/TutorLessonsPage"

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isTutorAuthenticated, setIsTutorAuthenticated] = useState(false)

  useEffect(() => {
    // Check if admin is authenticated
    const adminToken = localStorage.getItem("adminToken")
    if (adminToken) {
      setIsAuthenticated(true)
    }
    
    // Check if tutor is authenticated
    const tutorToken = localStorage.getItem("tutorToken")
    if (tutorToken) {
      setIsTutorAuthenticated(true)
    }
  }, [])

  const handleLogin = (token) => {
    localStorage.setItem("adminToken", token)
    setIsAuthenticated(true)
  }

  const handleTutorLogin = (token) => {
    localStorage.setItem("tutorToken", token)
    setIsTutorAuthenticated(true)
    console.log(isTutorAuthenticated)
  }

  const handleLogout = () => {
    localStorage.removeItem("adminToken")
    localStorage.removeItem("adminUser")
    setIsAuthenticated(false)
  }

  const handleTutorLogout = () => {
    localStorage.removeItem("tutorToken")
    localStorage.removeItem("tutorUser")
    setIsTutorAuthenticated(false)
  }

  return (
    <>
      <Router>
        <Routes>
          {/* Landing Page */}
          <Route path="/" element={<LandingPage />} />
          
          {/* Admin Login */}
          <Route
            path="/login"
            element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage onLogin={handleLogin} />}
          />

          {/* Tutor login */ }

          <Route
          path="/login"
          element={isTutorAuthenticated ? <Navigate to="/tutor/dashboard" /> : <LoginPage onLogin={handleTutorLogin} />} 
          />
          
          {/* Admin Dashboard */}
          <Route
            path="/dashboard/*"
            element={
              isAuthenticated ? (
                <DashboardLayout onLogout={handleLogout}>
                  <Routes>
                    <Route index element={<AllUsersPage />} />
                    <Route path="users" element={<AllUsersPage />} />
                    <Route path="master/*" element={<MasterPage />} />
                    <Route path="counselor/*" element={<CounselorPage />} />
                    <Route path="resources" element={<ResourcesPage />} />
                    <Route path="reports" element={<ReportsPage />} />
                  </Routes>
                </DashboardLayout>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          
          {/* Tutor Routes */}
          <Route path="/tutor/signup" element={<TutorSignupPage />} />

          {console.log(isTutorAuthenticated)}
          
          {/* Tutor Dashboard */}
          <Route
            path="/tutor/dashboard/*"
            element={
               
                <TutorDashboardLayout onLogout={handleTutorLogout}>
                  <Routes>
                    <Route index element={<Navigate to="/tutor/dashboard/courses" replace />} />
                    <Route path="courses" element={<TutorCoursesPage />} />
                    <Route path="courses/add" element={<TutorCourseFormPage />} />
                    <Route path="courses/edit/:courseId" element={<TutorCourseFormPage />} />
                    <Route path="courses/:courseId/lessons" element={<TutorLessonsPage />} />
                    <Route path="earnings" element={<TutorEarningsPage />} />
                  </Routes>
                </TutorDashboardLayout>
              
            }
          />
          
          {/* Default Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  )
}

export default App
