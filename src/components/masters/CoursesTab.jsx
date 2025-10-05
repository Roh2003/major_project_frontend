"use client"

import { useState } from "react"
import { Plus, Edit2, Trash2, Search } from "lucide-react"
import Button from "../common/Button"
import Input from "../common/Input"
import Modal from "../common/Modal"
import Table from "../common/Table"
import { toast } from "react-toastify"

const CoursesTab = () => {
  const [showModal, setShowModal] = useState(false)
  const [editingCourse, setEditingCourse] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    duration: "",
    level: "beginner",
    instructor: "",
    price: "",
  })

  const [courses, setCourses] = useState([
    {
      id: 1,
      name: "Web Development Fundamentals",
      description: "Learn HTML, CSS, and JavaScript basics",
      duration: "8 weeks",
      level: "Beginner",
      instructor: "John Smith",
      price: "$99",
      students: 245,
    },
    {
      id: 2,
      name: "Advanced React Patterns",
      description: "Master React hooks, context, and performance",
      duration: "6 weeks",
      level: "Advanced",
      instructor: "Sarah Johnson",
      price: "$149",
      students: 128,
    },
    {
      id: 3,
      name: "Python for Data Science",
      description: "Data analysis with pandas and numpy",
      duration: "10 weeks",
      level: "Intermediate",
      instructor: "Mike Chen",
      price: "$129",
      students: 189,
    },
  ])

  const columns = [
    { key: "name", label: "Course Name" },
    { key: "instructor", label: "Instructor" },
    { key: "duration", label: "Duration" },
    { key: "level", label: "Level" },
    { key: "price", label: "Price" },
    { key: "students", label: "Students" },
  ]

  const handleSubmit = (e) => {
    e.preventDefault()

    if (editingCourse) {
      setCourses(courses.map((course) => (course.id === editingCourse.id ? { ...formData, id: course.id } : course)))
      toast.success("Course updated successfully")
    } else {
      const newCourse = {
        ...formData,
        id: courses.length + 1,
        students: 0,
      }
      setCourses([...courses, newCourse])
      toast.success("Course created successfully")
    }

    setShowModal(false)
    setEditingCourse(null)
    setFormData({
      name: "",
      description: "",
      duration: "",
      level: "beginner",
      instructor: "",
      price: "",
    })
  }

  const handleEdit = (course) => {
    setEditingCourse(course)
    setFormData(course)
    setShowModal(true)
  }

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      setCourses(courses.filter((course) => course.id !== id))
      toast.success("Course deleted successfully")
    }
  }

  const handleAdd = () => {
    setEditingCourse(null)
    setFormData({
      name: "",
      description: "",
      duration: "",
      level: "beginner",
      instructor: "",
      price: "",
    })
    setShowModal(true)
  }

  const filteredCourses = courses.filter(
    (course) =>
      course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      {/* Actions Bar */}
      <div className="flex items-center justify-between gap-4">
        <Input
          placeholder="Search courses..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          icon={Search}
          className="max-w-md"
        />
        <Button variant="primary" icon={Plus} onClick={handleAdd}>
          Add Course
        </Button>
      </div>

      {/* Courses Table */}
      <Table
        columns={columns}
        data={filteredCourses}
        actions={(row) => (
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleEdit(row)}
              className="p-2 text-info hover:bg-info/10 rounded-lg transition-colors"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleDelete(row.id)}
              className="p-2 text-error hover:bg-error/10 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      />

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false)
          setEditingCourse(null)
        }}
        title={editingCourse ? "Edit Course" : "Add New Course"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Course Name"
            placeholder="Enter course name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <div className="space-y-2">
            <label className="block text-sm font-medium text-text-secondary">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter course description"
              rows={3}
              className="w-full px-4 py-2.5 bg-surface border border-border rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Duration"
              placeholder="e.g., 8 weeks"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              required
            />

            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-secondary">Level</label>
              <select
                value={formData.level}
                onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                className="w-full px-4 py-2.5 bg-surface border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Instructor"
              placeholder="Instructor name"
              value={formData.instructor}
              onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
              required
            />

            <Input
              label="Price"
              placeholder="e.g., $99"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              fullWidth
              onClick={() => {
                setShowModal(false)
                setEditingCourse(null)
              }}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" fullWidth>
              {editingCourse ? "Update Course" : "Create Course"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default CoursesTab
