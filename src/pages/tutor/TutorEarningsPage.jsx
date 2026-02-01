"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { DollarSign, TrendingUp, Clock, CheckCircle, Download } from "lucide-react"
import { toast } from "react-toastify"
import Button from "../../components/common/Button"
import TutorService from "../../services/tutor.service"

const TutorEarningsPage = () => {
  const [tutorData, setTutorData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTutorData()
  }, [])

  const fetchTutorData = async () => {
    try {
      const token = localStorage.getItem("tutorToken")
      const response = await TutorService.getTutorProfile(token)
      setTutorData(response.data.data)
    } catch (error) {
      console.error("Error fetching tutor data:", error)
      toast.error("Failed to load earnings data")
    } finally {
      setLoading(false)
    }
  }

  const handleExportReport = () => {
    toast.success("Exporting earnings report...")
    // TODO: Implement actual export functionality
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin w-8 h-8 border-4 border-secondary border-t-transparent rounded-full" />
      </div>
    )
  }

  const totalEarnings = tutorData?.totalEarnings || 0
  const pendingEarnings = tutorData?.pendingEarnings || 0
  const coursesCount = tutorData?.coursesCreated || 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">Earnings</h1>
          <p className="text-text-secondary">Track your revenue and payments</p>
        </div>

        <Button variant="secondary" icon={Download} onClick={handleExportReport}>
          Export Report
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-success/10 to-success/5 border border-success/20 rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-success/20 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-success" />
            </div>
            <CheckCircle className="w-5 h-5 text-success" />
          </div>
          <p className="text-sm text-text-muted mb-1">Total Earnings</p>
          <p className="text-3xl font-bold text-text-primary mb-2">${totalEarnings.toFixed(2)}</p>
          <p className="text-xs text-success">All-time revenue</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-warning/10 to-warning/5 border border-warning/20 rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-warning/20 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-warning" />
            </div>
            <Clock className="w-5 h-5 text-warning" />
          </div>
          <p className="text-sm text-text-muted mb-1">Pending Earnings</p>
          <p className="text-3xl font-bold text-text-primary mb-2">${pendingEarnings.toFixed(2)}</p>
          <p className="text-xs text-warning">Awaiting payout</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-secondary/10 to-secondary/5 border border-secondary/20 rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-secondary/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-secondary" />
            </div>
            <TrendingUp className="w-5 h-5 text-secondary" />
          </div>
          <p className="text-sm text-text-muted mb-1">Average per Course</p>
          <p className="text-3xl font-bold text-text-primary mb-2">
            ${coursesCount > 0 ? (totalEarnings / coursesCount).toFixed(2) : "0.00"}
          </p>
          <p className="text-xs text-secondary">Based on {coursesCount} courses</p>
        </motion.div>
      </div>

      {/* Earnings Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Course-wise Earnings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white border border-border rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold text-text-primary mb-4">Course-wise Earnings</h3>
          
          {tutorData?.courses && tutorData.courses.length > 0 ? (
            <div className="space-y-4">
              {tutorData.courses.map((course, index) => (
                <div key={course.id} className="flex items-center justify-between pb-4 border-b border-border last:border-0">
                  <div className="flex-1">
                    <p className="font-medium text-text-primary text-sm">{course.title}</p>
                    <p className="text-xs text-text-muted mt-1">
                      {course.isPublished ? "Published" : "Pending Review"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-success">$0.00</p>
                    <p className="text-xs text-text-muted">0 enrollments</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <DollarSign className="w-12 h-12 text-text-muted mx-auto mb-3" />
              <p className="text-text-muted">No courses uploaded yet</p>
            </div>
          )}
        </motion.div>

        {/* Payment History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white border border-border rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold text-text-primary mb-4">Payment History</h3>
          
          <div className="text-center py-8">
            <Clock className="w-12 h-12 text-text-muted mx-auto mb-3" />
            <p className="text-text-muted mb-2">No payments yet</p>
            <p className="text-xs text-text-muted">Payments are processed monthly</p>
          </div>
        </motion.div>
      </div>

      {/* Payment Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white border border-border rounded-xl p-6"
      >
        <h3 className="text-lg font-semibold text-text-primary mb-4">Payment Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-text-muted mb-2">Payment Method</p>
            <p className="text-text-primary font-medium">Bank Transfer</p>
          </div>
          <div>
            <p className="text-sm text-text-muted mb-2">Payment Schedule</p>
            <p className="text-text-primary font-medium">Monthly (1st of each month)</p>
          </div>
          <div>
            <p className="text-sm text-text-muted mb-2">Minimum Payout</p>
            <p className="text-text-primary font-medium">$50.00</p>
          </div>
          <div>
            <p className="text-sm text-text-muted mb-2">Next Payout Date</p>
            <p className="text-text-primary font-medium">
              {new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="mt-6 p-4 bg-info/10 border border-info/20 rounded-lg">
          <p className="text-sm text-info">
            <strong>Note:</strong> Earnings are calculated based on course enrollments. Payments are processed monthly if your balance exceeds the minimum payout threshold.
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export default TutorEarningsPage
