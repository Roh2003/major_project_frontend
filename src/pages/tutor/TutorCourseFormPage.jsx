"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, Save, Upload } from "lucide-react"
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"
import Button from "../../components/common/Button"
import Input from "../../components/common/Input"
import CourseService from "../../services/course.service"

const TutorCourseFormPage = () => {
  const navigate = useNavigate()
  const tutorUser = JSON.parse(localStorage.getItem("tutorUser") || "{}")
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    level: "",
    thumbnailUrl: "",
    instructor: `${tutorUser.firstName || ""} ${tutorUser.lastName || ""}`.trim() || tutorUser.username,
    duration: ""
  })
  
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.title || !formData.description) {
      toast.error("Please fill in title and description")
      return
    }

    setLoading(true)

    try {
      const courseData = {
        ...formData,
        price: formData.price ? parseFloat(formData.price) : 0,
        tutorId: tutorUser.id, // Important: Set tutor ID
        isPublished: false // Tutors cannot publish
      }

      await CourseService.createCourse(courseData)
      
      toast.success("Course created successfully! Waiting for admin approval.")
      navigate("/tutor/dashboard/courses")
    } catch (error) {
      console.error("Error creating course:", error)
      toast.error("Failed to create course")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/tutor/dashboard/courses")}
          className="p-2 hover:bg-surface rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Add New Course</h1>
          <p className="text-text-secondary">Create a course for review by admin</p>
        </div>
      </div>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border border-border rounded-xl p-8 shadow-sm"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div>
            <h3 className="text-lg font-semibold text-text-primary mb-4">Basic Information</h3>
            
            <div className="space-y-4">
              <Input
                label="Course Title *"
                type="text"
                name="title"
                placeholder="e.g., Complete Web Development Course"
                value={formData.title}
                onChange={handleChange}
                required
              />

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  placeholder="Describe what students will learn..."
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  required
                  className="w-full px-4 py-3 bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all text-text-primary"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Price (USD)"
                  type="number"
                  name="price"
                  placeholder="0.00"
                  value={formData.price}
                  onChange={handleChange}
                  step="0.01"
                />

                <Input
                  label="Duration (hours)"
                  type="text"
                  name="duration"
                  placeholder="e.g., 10 hours"
                  value={formData.duration}
                  onChange={handleChange}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all text-text-primary"
                  >
                    <option value="">Select category</option>
                    <option value="Programming">Programming</option>
                    <option value="Design">Design</option>
                    <option value="Business">Business</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Data Science">Data Science</option>
                    <option value="Photography">Photography</option>
                    <option value="Music">Music</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Level
                  </label>
                  <select
                    name="level"
                    value={formData.level}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all text-text-primary"
                  >
                    <option value="">Select level</option>
                    <option value="BEGINNER">Beginner</option>
                    <option value="INTERMEDIATE">Intermediate</option>
                    <option value="ADVANCED">Advanced</option>
                  </select>
                </div>
              </div>

              <Input
                label="Thumbnail URL"
                type="url"
                name="thumbnailUrl"
                placeholder="https://example.com/image.jpg"
                value={formData.thumbnailUrl}
                onChange={handleChange}
              />

              <Input
                label="Instructor Name"
                type="text"
                name="instructor"
                placeholder="Your name"
                value={formData.instructor}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Info Note */}
          <div className="bg-info/10 border border-info/20 rounded-xl p-4">
            <p className="text-sm text-info">
              <strong>Note:</strong> Your course will be submitted for admin review. You can add lessons after the course is created. The course will only be visible to students after admin approval.
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <Button
              type="submit"
              variant="primary"
              loading={loading}
              icon={Save}
            >
              Create Course
            </Button>

            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate("/tutor/dashboard/courses")}
            >
              Cancel
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

export default TutorCourseFormPage
