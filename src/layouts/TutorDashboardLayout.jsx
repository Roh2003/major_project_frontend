"use client"

import { useState } from "react"
import { Outlet, NavLink, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { GraduationCap, BookOpen, DollarSign, LogOut, Menu, X, User } from "lucide-react"

const TutorDashboardLayout = ({ onLogout, children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const navigate = useNavigate()

  const menuItems = [
    {
      path: "/tutor/dashboard/courses",
      icon: BookOpen,
      label: "My Courses",
    },
    {
      path: "/tutor/dashboard/earnings",
      icon: DollarSign,
      label: "Earnings",
    },
  ]

  const handleLogout = () => {
    if (onLogout) onLogout()
    navigate("/")
  }

  // Get tutor info from localStorage
  const tutorUser = JSON.parse(localStorage.getItem("tutorUser") || "{}")

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-border z-50 shadow-sm">
        <div className="h-full px-6 flex items-center justify-between">
          {/* Left Side */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-surface rounded-lg transition-colors lg:hidden"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-secondary to-secondary-dark rounded-xl flex items-center justify-center shadow-lg">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-text-primary">SkillUp Tutor</h1>
                <p className="text-xs text-text-muted">Welcome back!</p>
              </div>
            </div>
          </div>

          {/* Right Side - Profile */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-secondary to-secondary-dark rounded-lg flex items-center justify-center shadow-md">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="text-left hidden md:block">
                <p className="text-sm font-medium text-text-primary">
                  {tutorUser.firstName || "Tutor"} {tutorUser.lastName || ""}
                </p>
                <p className="text-xs text-text-muted">{tutorUser.email}</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-sm text-error hover:bg-error/10 rounded-lg transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-16 bottom-0 bg-white border-r border-border transition-all duration-300 z-40 ${
          sidebarOpen ? "w-64" : "w-0 lg:w-20"
        }`}
      >
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all group ${
                  isActive
                    ? "bg-secondary text-white shadow-lg"
                    : "text-text-secondary hover:bg-surface hover:text-text-primary"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {sidebarOpen && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-sm font-medium"
                    >
                      {item.label}
                    </motion.span>
                  )}
                  {!sidebarOpen && (
                    <div className="absolute left-full ml-2 px-3 py-2 bg-surface border border-border rounded-lg shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 hidden lg:block">
                      <span className="text-sm font-medium text-text-primary">{item.label}</span>
                    </div>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main
        className={`pt-16 transition-all duration-300 ${
          sidebarOpen ? "lg:pl-64" : "lg:pl-20"
        }`}
      >
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  )
}

export default TutorDashboardLayout
