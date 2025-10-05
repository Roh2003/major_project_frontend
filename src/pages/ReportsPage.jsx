"use client"

import { useState } from "react"
import { Download, TrendingUp, Users, BookOpen, Award, FileText, Filter } from "lucide-react"
import { motion } from "framer-motion"
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
import Button from "../components/common/Button"
import Dropdown from "../components/common/Dropdown"
import StatCard from "../components/dashboard/StatCard"
import { toast } from "react-toastify"

const ReportsPage = () => {
  const [reportType, setReportType] = useState("overview")
  const [dateRange, setDateRange] = useState("monthly")
  const [loading, setLoading] = useState(false)

  // Sample data for reports
  const enrollmentData = [
    { month: "Jan", enrollments: 145, completions: 98 },
    { month: "Feb", enrollments: 168, completions: 112 },
    { month: "Mar", enrollments: 192, completions: 134 },
    { month: "Apr", enrollments: 215, completions: 156 },
    { month: "May", enrollments: 234, completions: 178 },
    { month: "Jun", enrollments: 267, completions: 201 },
  ]

  const coursePerformanceData = [
    { course: "Web Dev", students: 456, completion: 78 },
    { course: "Data Science", students: 328, completion: 82 },
    { course: "Mobile Dev", students: 289, completion: 71 },
    { course: "UI/UX", students: 234, completion: 85 },
    { course: "Cloud Computing", students: 198, completion: 68 },
  ]

  const categoryDistribution = [
    { name: "Programming", value: 45, color: "#6366f1" },
    { name: "Design", value: 25, color: "#10b981" },
    { name: "Business", value: 15, color: "#f59e0b" },
    { name: "Marketing", value: 15, color: "#ec4899" },
  ]

  const revenueData = [
    { month: "Jan", revenue: 12500 },
    { month: "Feb", revenue: 15800 },
    { month: "Mar", revenue: 18200 },
    { month: "Apr", revenue: 21500 },
    { month: "May", revenue: 24300 },
    { month: "Jun", revenue: 28900 },
  ]

  const handleExport = (format) => {
    setLoading(true)
    setTimeout(() => {
      toast.success(`Exporting report as ${format.toUpperCase()}...`)
      setLoading(false)
    }, 1500)
  }

  const handleGenerateReport = () => {
    setLoading(true)
    setTimeout(() => {
      toast.success("Report generated successfully")
      setLoading(false)
    }, 2000)
  }

  const reportTypes = [
    { value: "overview", label: "Overview Report" },
    { value: "enrollment", label: "Enrollment Report" },
    { value: "performance", label: "Performance Report" },
    { value: "revenue", label: "Revenue Report" },
    { value: "user-activity", label: "User Activity Report" },
  ]

  const dateRanges = [
    { value: "weekly", label: "Last 7 Days" },
    { value: "monthly", label: "Last 30 Days" },
    { value: "quarterly", label: "Last 3 Months" },
    { value: "yearly", label: "Last Year" },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">Reports & Analytics</h1>
          <p className="text-text-secondary">Generate comprehensive reports and insights</p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="secondary" icon={Download} onClick={() => handleExport("pdf")} loading={loading}>
            Export PDF
          </Button>
          <Button variant="secondary" icon={Download} onClick={() => handleExport("csv")} loading={loading}>
            Export CSV
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-surface border border-border rounded-xl p-6 shadow-lg">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-text-muted" />
            <span className="text-sm font-medium text-text-secondary">Filters:</span>
          </div>

          <Dropdown value={reportType} onChange={setReportType} options={reportTypes} />

          <Dropdown value={dateRange} onChange={setDateRange} options={dateRanges} />

          <Button variant="primary" onClick={handleGenerateReport} loading={loading}>
            Generate Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Enrollments"
          value="1,221"
          icon={Users}
          trend={18.5}
          trendLabel="vs last period"
          color="primary"
        />
        <StatCard
          title="Course Completions"
          value="879"
          icon={Award}
          trend={12.3}
          trendLabel="vs last period"
          color="success"
        />
        <StatCard
          title="Active Courses"
          value="48"
          icon={BookOpen}
          trend={8.7}
          trendLabel="vs last period"
          color="info"
        />
        <StatCard
          title="Total Revenue"
          value="$121.3K"
          icon={TrendingUp}
          trend={24.8}
          trendLabel="vs last period"
          color="accent"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Enrollment Trends */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-surface border border-border rounded-xl p-6 shadow-lg"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-text-primary">Enrollment Trends</h3>
              <p className="text-sm text-text-muted">Monthly enrollments vs completions</p>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={enrollmentData}>
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
              <Line type="monotone" dataKey="enrollments" stroke="#6366f1" strokeWidth={3} name="Enrollments" />
              <Line type="monotone" dataKey="completions" stroke="#10b981" strokeWidth={3} name="Completions" />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Category Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-surface border border-border rounded-xl p-6 shadow-lg"
        >
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-text-primary">Course Category Distribution</h3>
            <p className="text-sm text-text-muted">Enrollment by category</p>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryDistribution.map((entry, index) => (
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Course Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-surface border border-border rounded-xl p-6 shadow-lg"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-text-primary">Top Course Performance</h3>
              <p className="text-sm text-text-muted">Students enrolled and completion rates</p>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={coursePerformanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
              <XAxis dataKey="course" stroke="#94a3b8" />
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
              <Bar dataKey="students" fill="#6366f1" radius={[8, 8, 0, 0]} name="Students" />
              <Bar dataKey="completion" fill="#10b981" radius={[8, 8, 0, 0]} name="Completion %" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Revenue Trends */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-surface border border-border rounded-xl p-6 shadow-lg"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-text-primary">Revenue Growth</h3>
              <p className="text-sm text-text-muted">Monthly revenue trends</p>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData}>
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
                formatter={(value) => `$${value.toLocaleString()}`}
              />
              <Bar dataKey="revenue" fill="#10b981" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Detailed Report Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-surface border border-border rounded-xl p-6 shadow-lg"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-text-primary">Detailed Performance Report</h3>
            <p className="text-sm text-text-muted">Course-wise breakdown of key metrics</p>
          </div>
          <Button variant="secondary" icon={FileText} size="sm">
            View Full Report
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-sm font-semibold text-text-secondary">Course Name</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-text-secondary">Enrollments</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-text-secondary">Completions</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-text-secondary">Completion Rate</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-text-secondary">Avg. Rating</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-text-secondary">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  name: "Web Development Fundamentals",
                  enrollments: 456,
                  completions: 356,
                  rate: 78,
                  rating: 4.5,
                  revenue: "$45,144",
                },
                {
                  name: "Data Science with Python",
                  enrollments: 328,
                  completions: 269,
                  rate: 82,
                  rating: 4.7,
                  revenue: "$42,312",
                },
                {
                  name: "Mobile App Development",
                  enrollments: 289,
                  completions: 205,
                  rate: 71,
                  rating: 4.3,
                  revenue: "$28,900",
                },
                {
                  name: "UI/UX Design Masterclass",
                  enrollments: 234,
                  completions: 199,
                  rate: 85,
                  rating: 4.8,
                  revenue: "$34,866",
                },
                {
                  name: "Cloud Computing Essentials",
                  enrollments: 198,
                  completions: 135,
                  rate: 68,
                  rating: 4.2,
                  revenue: "$19,800",
                },
              ].map((course, index) => (
                <tr key={index} className="border-b border-border/50 hover:bg-surface-light transition-colors">
                  <td className="py-3 px-4 text-sm text-text-primary font-medium">{course.name}</td>
                  <td className="py-3 px-4 text-sm text-text-secondary">{course.enrollments}</td>
                  <td className="py-3 px-4 text-sm text-text-secondary">{course.completions}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-border rounded-full h-2 max-w-[100px]">
                        <div className="bg-success h-2 rounded-full" style={{ width: `${course.rate}%` }} />
                      </div>
                      <span className="text-sm text-text-secondary">{course.rate}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1">
                      <span className="text-sm text-text-primary font-medium">{course.rating}</span>
                      <span className="text-accent">★</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-text-primary font-semibold">{course.revenue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-xl p-6"
        >
          <h4 className="text-sm font-medium text-text-muted mb-2">Average Completion Rate</h4>
          <p className="text-3xl font-bold text-text-primary mb-1">76.8%</p>
          <p className="text-sm text-success">+5.2% from last period</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-gradient-to-br from-success/10 to-success/5 border border-success/20 rounded-xl p-6"
        >
          <h4 className="text-sm font-medium text-text-muted mb-2">Student Satisfaction</h4>
          <p className="text-3xl font-bold text-text-primary mb-1">4.5/5.0</p>
          <p className="text-sm text-success">+0.3 from last period</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20 rounded-xl p-6"
        >
          <h4 className="text-sm font-medium text-text-muted mb-2">Revenue Per Student</h4>
          <p className="text-3xl font-bold text-text-primary mb-1">$99.35</p>
          <p className="text-sm text-success">+12.8% from last period</p>
        </motion.div>
      </div>
    </div>
  )
}

export default ReportsPage
