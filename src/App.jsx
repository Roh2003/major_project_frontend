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

function App() {
  const [showLanding, setShowLanding] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Check if user is already authenticated
    const authToken = localStorage.getItem("authToken")
    if (authToken) {
      setIsAuthenticated(true)
      setShowLanding(false)
    } else {
      // Show landing page for 3 seconds
      const timer = setTimeout(() => {
        setShowLanding(false)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleLogin = (token) => {
    localStorage.setItem("authToken", token)
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    localStorage.removeItem("authToken")
    setIsAuthenticated(false)
  }

  if (showLanding) {
    return <LandingPage />
  }

  return (
    <>
      <Router>
        <Routes>
          <Route
            path="/login"
            element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage onLogin={handleLogin} />}
          />
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
          <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} />
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
        theme="dark"
      />
    </>
  )
}

export default App
