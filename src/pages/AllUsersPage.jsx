"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Users, UserPlus, Activity, TrendingUp, Download, RefreshCw } from "lucide-react"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import StatCard from "../components/dashboard/StatCard"
import Dropdown from "../components/common/Dropdown"
import Button from "../components/common/Button"
import { toast } from "react-toastify"

const AllUsersPage = () => {
  const [period, setPeriod] = useState("monthly")
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState({
    totalUsers: 12458,
    activeUsers: 8932,
    newUsers: 1247,
    growthRate: 12.5,
  })

  // Sample data for charts
  const userGrowthData = [
    { month: "Jan", users: 8500, active: 6200 },
    { month: "Feb", users: 9200, active: 6800 },
    { month: "Mar", users: 9800, active: 7200 },
    { month: "Apr", users: 10500, active: 7600 },
    { month: "May", users: 11200, active: 8100 },
    { month: "Jun", users: 12458, active: 8932 },
  ]

  const userActivityData = [
    { name: "Active", value: 8932, color: "#10b981" },
    { name: "Inactive", value: 2526, color: "#475569" },
    { name: "New", value: 1000, color: "#6366f1" },
  ]

  const registrationData = [
    { day: "Mon", registrations: 45 },
    { day: "Tue", registrations: 52 },
    { day: "Wed", registrations: 38 },
    { day: "Thu", registrations: 65 },
    { day: "Fri", registrations: 48 },
    { day: "Sat", registrations: 30 },
    { day: "Sun", registrations: 25 },
  ]

  const handleRefresh = () => {
    setLoading(true)
    setTimeout(() => {
      toast.success("Data refreshed successfully")
      setLoading(false)
    }, 1500)
  }

  const handleExport = () => {
    toast.success("Exporting data...")
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">User Analytics Dashboard</h1>
          <p className="text-text-secondary">Track and monitor all user activities and statistics</p>
        </div>

        <div className="flex items-center gap-3">
          <Dropdown
            value={period}
            onChange={setPeriod}
            options={[
              { value: "weekly", label: "Weekly" },
              { value: "monthly", label: "Monthly" },
              { value: "yearly", label: "Yearly" },
            ]}
          />
          <Button variant="secondary" icon={RefreshCw} onClick={handleRefresh} loading={loading}>
            Refresh
          </Button>
          <Button variant="primary" icon={Download} onClick={handleExport}>
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={stats.totalUsers.toLocaleString()}
          icon={Users}
          trend={stats.growthRate}
          trendLabel="vs last month"
          color="primary"
        />
        <StatCard
          title="Active Users"
          value={stats.activeUsers.toLocaleString()}
          icon={Activity}
          trend={8.2}
          trendLabel="vs last month"
          color="success"
        />
        <StatCard
          title="New Registrations"
          value={stats.newUsers.toLocaleString()}
          icon={UserPlus}
          trend={15.3}
          trendLabel="vs last month"
          color="info"
        />
        <StatCard
          title="Growth Rate"
          value={`${stats.growthRate}%`}
          icon={TrendingUp}
          trend={2.4}
          trendLabel="vs last month"
          color="accent"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Growth Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 bg-surface border border-border rounded-xl p-6 shadow-lg"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-text-primary">User Growth Trend</h3>
              <p className="text-sm text-text-muted">Total and active users over time</p>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={userGrowthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
              <XAxis dataKey="month" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "1px solid #475569",
                  borderRadius: "8px",
                  color: "#f1f5f9",
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="users" stroke="#6366f1" strokeWidth={3} name="Total Users" />
              <Line type="monotone" dataKey="active" stroke="#10b981" strokeWidth={3} name="Active Users" />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* User Activity Pie Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-surface border border-border rounded-xl p-6 shadow-lg"
        >
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-text-primary">User Status</h3>
            <p className="text-sm text-text-muted">Distribution by activity</p>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={userActivityData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {userActivityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "1px solid #475569",
                  borderRadius: "8px",
                  color: "#f1f5f9",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Charts Row 2 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-surface border border-border rounded-xl p-6 shadow-lg"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-text-primary">Weekly Registrations</h3>
            <p className="text-sm text-text-muted">New user sign-ups by day</p>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={registrationData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
            <XAxis dataKey="day" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1e293b",
                border: "1px solid #475569",
                borderRadius: "8px",
                color: "#f1f5f9",
              }}
            />
            <Bar dataKey="registrations" fill="#6366f1" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Recent Activity Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-surface border border-border rounded-xl p-6 shadow-lg"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-text-primary">Recent User Activity</h3>
            <p className="text-sm text-text-muted">Latest user registrations and activities</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-sm font-semibold text-text-secondary">User</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-text-secondary">Email</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-text-secondary">Status</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-text-secondary">Joined</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-text-secondary">Last Active</th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  name: "John Doe",
                  email: "john@example.com",
                  status: "Active",
                  joined: "2 days ago",
                  lastActive: "5 mins ago",
                },
                {
                  name: "Jane Smith",
                  email: "jane@example.com",
                  status: "Active",
                  joined: "3 days ago",
                  lastActive: "1 hour ago",
                },
                {
                  name: "Mike Johnson",
                  email: "mike@example.com",
                  status: "Inactive",
                  joined: "5 days ago",
                  lastActive: "2 days ago",
                },
                {
                  name: "Sarah Williams",
                  email: "sarah@example.com",
                  status: "Active",
                  joined: "1 week ago",
                  lastActive: "10 mins ago",
                },
                {
                  name: "Tom Brown",
                  email: "tom@example.com",
                  status: "New",
                  joined: "1 hour ago",
                  lastActive: "1 hour ago",
                },
              ].map((user, index) => (
                <tr key={index} className="border-b border-border/50 hover:bg-surface-light transition-colors">
                  <td className="py-3 px-4 text-sm text-text-primary">{user.name}</td>
                  <td className="py-3 px-4 text-sm text-text-secondary">{user.email}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.status === "Active"
                          ? "bg-success/10 text-success"
                          : user.status === "New"
                            ? "bg-info/10 text-info"
                            : "bg-border/50 text-text-muted"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-text-secondary">{user.joined}</td>
                  <td className="py-3 px-4 text-sm text-text-secondary">{user.lastActive}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  )
}

export default AllUsersPage
