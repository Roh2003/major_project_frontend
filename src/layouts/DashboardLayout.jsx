"use client"

import { useState } from "react"
import Navbar from "../components/layout/Navbar"
import Sidebar from "../components/layout/Sidebar"

const DashboardLayout = ({ children, onLogout }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      <Navbar onLogout={onLogout} />

      <div className="flex pt-16">
        <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />

        <main className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? "ml-20" : "ml-64"}`}>
          <div className="p-6">{children}</div>
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
