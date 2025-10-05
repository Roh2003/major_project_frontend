"use client"
import { Routes, Route, NavLink, Navigate } from "react-router-dom"
import CoursesTab from "../components/masters/CoursesTab"
import ContestsTab from "../components/masters/ContestsTab"
import ChallengesTab from "../components/masters/ChallengesTab"
import RoadmapsTab from "../components/masters/RoadmapsTab"

const MasterPage = () => {
  const tabs = [
    { path: "courses", label: "Courses" },
    { path: "contests", label: "Contests" },
    { path: "challenges", label: "Challenges" },
    { path: "roadmaps", label: "Learning Roadmaps" },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-text-primary mb-2">Master Management</h1>
        <p className="text-text-secondary">Create and manage courses, contests, challenges, and learning roadmaps</p>
      </div>

      {/* Sub-tabs Navigation */}
      <div className="bg-surface border border-border rounded-xl p-2 flex gap-2 overflow-x-auto">
        {tabs.map((tab) => (
          <NavLink
            key={tab.path}
            to={tab.path}
            className={({ isActive }) =>
              `px-6 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                isActive
                  ? "bg-primary text-white shadow-lg"
                  : "text-text-secondary hover:bg-surface-light hover:text-text-primary"
              }`
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </div>

      {/* Tab Content */}
      <Routes>
        <Route index element={<Navigate to="courses" replace />} />
        <Route path="courses" element={<CoursesTab />} />
        <Route path="contests" element={<ContestsTab />} />
        <Route path="challenges" element={<ChallengesTab />} />
        <Route path="roadmaps" element={<RoadmapsTab />} />
      </Routes>
    </div>
  )
}

export default MasterPage
