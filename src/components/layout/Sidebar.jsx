"use client"

import { NavLink } from "react-router-dom"
import { motion } from "framer-motion"
import { Users, Database, UserCheck, FolderOpen, BarChart3, ChevronLeft, ChevronRight } from "lucide-react"

const Sidebar = ({ collapsed, onToggle }) => {
  const menuItems = [
    {
      path: "/dashboard/users",
      icon: Users,
      label: "All User Info",
    },
    {
      path: "/dashboard/master",
      icon: Database,
      label: "Master",
    },
    {
      path: "/dashboard/counselor",
      icon: UserCheck,
      label: "Counselor",
    },
    {
      path: "/dashboard/resources",
      icon: FolderOpen,
      label: "Resources",
    },
    {
      path: "/dashboard/reports",
      icon: BarChart3,
      label: "Reports",
    },
  ]

  return (
    <aside
      className={`fixed left-0 top-16 bottom-0 bg-surface border-r border-border transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-6 w-6 h-6 bg-surface border border-border rounded-full flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-surface-light transition-all shadow-lg"
      >
        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>

      {/* Menu Items */}
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-all group ${
                isActive
                  ? "bg-primary text-white shadow-lg"
                  : "text-text-secondary hover:bg-surface-light hover:text-text-primary"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-sm font-medium"
                  >
                    {item.label}
                  </motion.span>
                )}
                {collapsed && (
                  <div className="absolute left-full ml-2 px-3 py-2 bg-surface border border-border rounded-lg shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                    <span className="text-sm font-medium text-text-primary">{item.label}</span>
                  </div>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar
