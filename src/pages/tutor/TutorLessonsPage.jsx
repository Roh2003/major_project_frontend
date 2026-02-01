"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, Plus, Edit, Trash2, Video, Save } from "lucide-react"
import { toast } from "react-toastify"
import { useNavigate, useParams } from "react-router-dom"
import Button from "../../components/common/Button"
import Input from "../../components/common/Input"
import CourseService from "../../services/course.service"

const TutorLessonsPage = () => {
  const navigate = useNavigate()
  const { courseId } = useParams()
  
  const [course, setCourse] = useState(null)
  const [lessons, setLessons] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingLesson, setEditingLesson] = useState(null)
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    videoId: "",
    duration: "",
    isFreePreview: false
  })

  useEffect(() => {
    fetchLessons()
  }, [courseId])

  const fetchLessons = async () => {
    try {
      const response = await CourseService.getLessonById(courseId)
      setLessons(response.data.data || [])
      
      // Fetch course info too
      const coursesResponse = await CourseService.getCourses()
      const currentCourse = coursesResponse.data.data.find(c => c.id === parseInt(courseId))
      setCourse(currentCourse)
    } catch (error) {
      console.error("Error fetching lessons:", error)
      toast.error("Failed to load lessons")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.title || !formData.videoId) {
      toast.error("Please fill in title and video ID")
      return
    }

    try {
      if (editingLesson) {
        // Update lesson
        await CourseService.updateLesson(editingLesson.id, formData)
        toast.success("Lesson updated successfully")
      } else {
        // Add new lesson
        await CourseService.addLesson(courseId, formData)
        toast.success("Lesson added successfully")
      }
      
      setFormData({
        title: "",
        description: "",
        videoId: "",
        duration: "",
        isFreePreview: false
      })
      setShowAddForm(false)
      setEditingLesson(null)
      fetchLessons()
    } catch (error) {
      console.error("Error saving lesson:", error)
      toast.error("Failed to save lesson")
    }
  }

  const handleEdit = (lesson) => {
    setEditingLesson(lesson)
    setFormData({
      title: lesson.title,
      description: lesson.description || "",
      videoId: lesson.videoId,
      duration: lesson.duration || "",
      isFreePreview: lesson.isFreePreview || false
    })
    setShowAddForm(true)
  }

  const handleDelete = async (lessonId) => {
    if (!window.confirm("Are you sure you want to delete this lesson?")) return

    try {
      await CourseService.deleteLesson(lessonId)
      toast.success("Lesson deleted successfully")
      fetchLessons()
    } catch (error) {
      console.error("Error deleting lesson:", error)
      toast.error("Failed to delete lesson")
    }
  }

  const handleCancel = () => {
    setFormData({
      title: "",
      description: "",
      videoId: "",
      duration: "",
      isFreePreview: false
    })
    setShowAddForm(false)
    setEditingLesson(null)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/tutor/dashboard/courses")}
            className="p-2 hover:bg-surface rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-text-primary">Manage Lessons</h1>
            <p className="text-text-secondary">{course?.title || "Loading..."}</p>
          </div>
        </div>

        {!showAddForm && (
          <Button
            variant="primary"
            icon={Plus}
            onClick={() => setShowAddForm(true)}
          >
            Add Lesson
          </Button>
        )}
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-border rounded-xl p-6 shadow-sm"
        >
          <h3 className="text-lg font-semibold text-text-primary mb-4">
            {editingLesson ? "Edit Lesson" : "Add New Lesson"}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Lesson Title *"
              type="text"
              name="title"
              placeholder="e.g., Introduction to React"
              value={formData.title}
              onChange={handleChange}
              required
            />

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Description
              </label>
              <textarea
                name="description"
                placeholder="Describe what this lesson covers..."
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all text-text-primary"
              />
            </div>

            <Input
              label="YouTube Video ID *"
              type="text"
              name="videoId"
              placeholder="e.g., dQw4w9WgXcQ"
              value={formData.videoId}
              onChange={handleChange}
              required
            />

            <Input
              label="Duration"
              type="text"
              name="duration"
              placeholder="e.g., 15:30"
              value={formData.duration}
              onChange={handleChange}
            />

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="isFreePreview"
                checked={formData.isFreePreview}
                onChange={handleChange}
                className="w-4 h-4 text-secondary border-border rounded focus:ring-2 focus:ring-secondary"
              />
              <label className="text-sm text-text-secondary">
                Free Preview (visible to non-enrolled users)
              </label>
            </div>

            <div className="flex items-center gap-4">
              <Button type="submit" variant="primary" icon={Save}>
                {editingLesson ? "Update Lesson" : "Add Lesson"}
              </Button>
              <Button type="button" variant="secondary" onClick={handleCancel}>
                Cancel
              </Button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Lessons List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border border-border rounded-xl shadow-sm overflow-hidden"
      >
        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-secondary border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-text-muted">Loading lessons...</p>
          </div>
        ) : lessons.length === 0 ? (
          <div className="p-12 text-center">
            <Video className="w-16 h-16 text-text-muted mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-text-primary mb-2">No lessons yet</h3>
            <p className="text-text-muted mb-6">Start by adding your first lesson!</p>
            <Button
              variant="primary"
              icon={Plus}
              onClick={() => setShowAddForm(true)}
            >
              Add First Lesson
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-surface">
                <tr>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-text-secondary">Order</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-text-secondary">Title</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-text-secondary">Duration</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-text-secondary">Free Preview</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-text-secondary">Actions</th>
                </tr>
              </thead>
              <tbody>
                {lessons.map((lesson, index) => (
                  <tr key={lesson.id} className="border-t border-border hover:bg-surface/50 transition-colors">
                    <td className="py-4 px-6">
                      <span className="font-semibold text-text-primary">#{index + 1}</span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-secondary to-secondary-dark rounded-lg flex items-center justify-center flex-shrink-0">
                          <Video className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-text-primary">{lesson.title}</p>
                          <p className="text-sm text-text-muted">{lesson.description || "No description"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-text-primary">{lesson.duration || "N/A"}</span>
                    </td>
                    <td className="py-4 px-6">
                      {lesson.isFreePreview ? (
                        <span className="px-3 py-1 bg-success/10 text-success rounded-full text-xs font-medium">
                          Yes
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-surface text-text-muted rounded-full text-xs font-medium">
                          No
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(lesson)}
                          className="p-2 text-secondary hover:bg-secondary/10 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(lesson.id)}
                          className="p-2 text-error hover:bg-error/10 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* Info Note */}
      <div className="bg-info/10 border border-info/20 rounded-xl p-4">
        <p className="text-sm text-info">
          <strong>Tip:</strong> Use YouTube Video IDs (the part after v= in the URL). Example: if the URL is https://youtube.com/watch?v=dQw4w9WgXcQ, use "dQw4w9WgXcQ".
        </p>
      </div>
    </div>
  )
}

export default TutorLessonsPage
