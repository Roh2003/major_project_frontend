"use client"

import { useEffect, useState } from "react"
import { Plus, Edit2, Trash2, Search, BookOpen } from "lucide-react"
import Button from "../common/Button"
import Input from "../common/Input"
import Modal from "../common/Modal"
import Table from "../common/Table"
import { toast } from "react-toastify"
import { uploadToCloudinary } from "../../utils/cloudnery"


// 🔹 SERVICES (you will implement)
import CourseService from "../../services/course.service"

import LessonManager from "./lessons/lessonManager"

const CoursesTab = () => {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(false)

  const [showCourseModal, setShowCourseModal] = useState(false)
  const [editingCourse, setEditingCourse] = useState(null)

  const [showLessonModal, setShowLessonModal] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState(null)

  const [searchQuery, setSearchQuery] = useState("")

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    duration: "",
    level: "BEGINNER",
    instructor: "",
    price: "",
    isPublished: false,
    thumbnailUrl: "",  
  })

  const columns = [
    { key: "title", label: "Course Name" },
    { key: "instructor", label: "Instructor" },
    { key: "duration", label: "Duration" },
    { key: "level", label: "Level" },
    { key: "price", label: "Price" },
    {
      key: "isPublished",
      label: "Status",
      render: (value) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${
            value
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {value ? "Published" : "Not Published"}
        </span>
      ),
    },
  ]
  
  

  useEffect(() => {
    loadCourses()
  }, [])

  const loadCourses = async () => {
    try {
      setLoading(true)
      const data = await CourseService.getCourses()
      setCourses(data)
    } catch {
      toast.error("Failed to load courses")
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      duration: "",
      level: "BEGINNER",
      instructor: "",
      price: "",
      isPublished: false,
      thumbnailUrl: "",  
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const payload = {
      title: formData.name,
      description: formData.description,
      duration: formData.duration,
      level: formData.level,
      instructor: formData.instructor,
      price: Number(formData.price),
      isPublished: formData.isPublished || false,
      thumbnailUrl: formData.thumbnailUrl.url
    }

    try {
      if (editingCourse) {
        await CourseService.updateCourse(editingCourse.id, payload)
        toast.success("Course updated successfully")
      } else {
        await CourseService.createCourse(payload)
        toast.success("Course created successfully")
      }

      setShowCourseModal(false)
      setEditingCourse(null)
      resetForm()
      loadCourses()
    } catch {
      toast.error("Operation failed")
    }
  }

  const handleEdit = (course) => {
    setEditingCourse(course)
    setFormData({
      name: course.title,
      description: course.description,
      duration: course.duration,
      level: course.level,
      instructor: course.instructor,
      price: String(course.price),
      isPublished: course.isPublished || false,
      thumbnailUrl: course.thumbnailUrl
    })
    setShowCourseModal(true)
  }

  const handleDelete = async (id) => {
    if (!confirm("Delete this course?")) return

    try {
      await CourseService.deleteCourse(id)
      toast.success("Course deleted")
      loadCourses()
    } catch {
      toast.error("Delete failed")
    }
  }

  const openLessons = (course) => {
    setSelectedCourse(course)
    setShowLessonModal(true)
  }

  const handleThumbnailUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
  
    try {
      const imageUrl = await uploadToCloudinary(file, "courses/thumbnails")
  
      setFormData((prev) => ({
        ...prev,
        thumbnailUrl: imageUrl,
      }))
    } catch(e) {
      console.log(e)
    }
  }
  

  const data = courses?.data?.data

  console.log("data", data)

  const filteredCourses = Array.isArray(data)
  ? data.map(course => ({
      ...course,
      statusText: course.isPublished ? "Published" : "Not Published",
    }))
      .filter(
        (c) =>
          c.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.instructor?.toLowerCase().includes(searchQuery.toLowerCase())
      )
  : []


    console.log({filteredCourses});
  return (
    <div className="space-y-6">
      {/* Actions */}
      <div className="flex items-center justify-between gap-4">
        <Input
          placeholder="Search courses..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          icon={Search}
          className="max-w-md"
        />
        <Button
          icon={Plus}
          onClick={() => {
            resetForm()
            setEditingCourse(null)
            setShowCourseModal(true)
          }}
        >
          Add Course
        </Button>
      </div>

      {/* Table */}
      <Table
        columns={columns}
        data={filteredCourses}
        loading={loading}
        actions={(row) => (
          <div className="flex gap-2">
            <button
              onClick={() => openLessons(row)}
              className="p-2 text-primary hover:bg-primary/10 rounded-lg"
            >
              <BookOpen className="w-4 h-4" />
            </button>

            <button
              onClick={() => handleEdit(row)}
              className="p-2 text-info hover:bg-info/10 rounded-lg"
            >
              <Edit2 className="w-4 h-4" />
            </button>

            <button
              onClick={() => handleDelete(row.id)}
              className="p-2 text-error hover:bg-error/10 rounded-lg"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      />

      {/* Course Modal */}
      <Modal
        isOpen={showCourseModal}
        onClose={() => setShowCourseModal(false)}
        title={editingCourse ? "Edit Course" : "Add Course"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Course Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="course-description">Description</label>
            <textarea
              id="course-description"
              rows={3}
              className="w-full px-4 py-2.5 border rounded-lg bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary transition resize-none"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              spellCheck={true}
              autoComplete="off"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Duration"
              value={formData.duration}
              onChange={(e) =>
                setFormData({ ...formData, duration: e.target.value })
              }
            />

            <div>
              <label className="text-sm font-medium" htmlFor="course-level">Level</label>
              <select
                id="course-level"
                value={formData.level}
                onChange={(e) =>
                  setFormData({ ...formData, level: e.target.value })
                }
                className="w-full px-4 py-2.5 border rounded-lg bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary transition"
              >
                <option value="BEGINNER">Beginner</option>
                <option value="INTERMEDIATE">Intermediate</option>
                <option value="ADVANCED">Advanced</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Instructor"
              value={formData.instructor}
              onChange={(e) =>
                setFormData({ ...formData, instructor: e.target.value })
              }
            />
            <Input
              label="Price"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
            />
          </div>

          <div className="flex items-center gap-4 my-2">
            <div className="flex-1">
              <label className="text-sm font-medium">Thumbnail Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleThumbnailUpload}
                className="w-full mt-1"
              />
              {formData.thumbnailUrl && (
                <img
                  src={formData.thumbnailUrl}
                  alt="Thumbnail preview"
                  className="mt-2 h-40 rounded-lg object-contain"
                  style={{ width: '200px' }}
                />
              )}
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium" htmlFor="publish-toggle">
                {formData.isPublished ? "Published" : "Draft"}
              </label>
              <button
                type="button"
                id="publish-toggle"
                className={`w-12 h-6 rounded-full transition relative focus:outline-none ${
                  formData.isPublished ? "bg-green-500" : "bg-gray-300"
                }`}
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    isPublished: !prev.isPublished,
                  }))
                }
                aria-pressed={formData.isPublished}
              >
                <span
                  className={`block w-6 h-6 bg-white rounded-full shadow transform transition ${
                    formData.isPublished ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              fullWidth
              onClick={() => setShowCourseModal(false)}
            >
              Cancel
            </Button>
            <Button type="submit" fullWidth>
              {editingCourse ? "Update Course" : "Create Course"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Lesson Modal */}
      <Modal
        isOpen={showLessonModal}
        onClose={() => setShowLessonModal(false)}
        title={`Lessons – ${selectedCourse?.title}`}
      >
        {selectedCourse && (
          <LessonManager courseId={selectedCourse.id} />
        )}
      </Modal>
    </div>
  )
}

export default CoursesTab
