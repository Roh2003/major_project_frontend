"use client"

import { useState } from "react"
import { Plus, Edit2, Trash2, Search, UserCheck, Mail, Phone, Calendar } from "lucide-react"
import { motion } from "framer-motion"
import Button from "../components/common/Button"
import Input from "../components/common/Input"
import Modal from "../components/common/Modal"
import Table from "../components/common/Table"
import { toast } from "react-toastify"

const CounselorPage = () => {
  const [showModal, setShowModal] = useState(false)
  const [showAssignModal, setShowAssignModal] = useState(false)
  const [editingCounselor, setEditingCounselor] = useState(null)
  const [selectedCounselor, setSelectedCounselor] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    specialization: "",
    experience: "",
    availability: "available",
  })

  const [counselors, setCounselors] = useState([
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      email: "sarah.j@skillup.com",
      phone: "+1 234-567-8901",
      specialization: "Career Guidance",
      experience: "8 years",
      availability: "Available",
      assignedStudents: 24,
    },
    {
      id: 2,
      name: "Michael Chen",
      email: "michael.c@skillup.com",
      phone: "+1 234-567-8902",
      specialization: "Technical Skills",
      experience: "5 years",
      availability: "Available",
      assignedStudents: 18,
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      email: "emily.r@skillup.com",
      phone: "+1 234-567-8903",
      specialization: "Personal Development",
      experience: "6 years",
      availability: "Busy",
      assignedStudents: 32,
    },
  ])

  const [availableStudents] = useState([
    { id: 1, name: "John Doe", email: "john@example.com", course: "Web Development" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", course: "Data Science" },
    { id: 3, name: "Mike Wilson", email: "mike@example.com", course: "Mobile Development" },
    { id: 4, name: "Sarah Brown", email: "sarah@example.com", course: "UI/UX Design" },
  ])

  const [selectedStudents, setSelectedStudents] = useState([])

  const columns = [
    { key: "name", label: "Counselor Name" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "specialization", label: "Specialization" },
    { key: "experience", label: "Experience" },
    { key: "availability", label: "Status" },
    { key: "assignedStudents", label: "Assigned Students" },
  ]

  const handleSubmit = (e) => {
    e.preventDefault()

    if (editingCounselor) {
      setCounselors(
        counselors.map((counselor) =>
          counselor.id === editingCounselor.id ? { ...formData, id: counselor.id } : counselor,
        ),
      )
      toast.success("Counselor updated successfully")
    } else {
      const newCounselor = {
        ...formData,
        id: counselors.length + 1,
        assignedStudents: 0,
      }
      setCounselors([...counselors, newCounselor])
      toast.success("Counselor added successfully")
    }

    setShowModal(false)
    setEditingCounselor(null)
    setFormData({
      name: "",
      email: "",
      phone: "",
      specialization: "",
      experience: "",
      availability: "available",
    })
  }

  const handleEdit = (counselor) => {
    setEditingCounselor(counselor)
    setFormData(counselor)
    setShowModal(true)
  }

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this counselor?")) {
      setCounselors(counselors.filter((counselor) => counselor.id !== id))
      toast.success("Counselor deleted successfully")
    }
  }

  const handleAdd = () => {
    setEditingCounselor(null)
    setFormData({
      name: "",
      email: "",
      phone: "",
      specialization: "",
      experience: "",
      availability: "available",
    })
    setShowModal(true)
  }

  const handleAssign = (counselor) => {
    setSelectedCounselor(counselor)
    setSelectedStudents([])
    setShowAssignModal(true)
  }

  const handleAssignSubmit = () => {
    if (selectedStudents.length === 0) {
      toast.error("Please select at least one student")
      return
    }

    setCounselors(
      counselors.map((counselor) =>
        counselor.id === selectedCounselor.id
          ? { ...counselor, assignedStudents: counselor.assignedStudents + selectedStudents.length }
          : counselor,
      ),
    )

    toast.success(`${selectedStudents.length} student(s) assigned to ${selectedCounselor.name}`)
    setShowAssignModal(false)
    setSelectedCounselor(null)
    setSelectedStudents([])
  }

  const toggleStudentSelection = (studentId) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId) ? prev.filter((id) => id !== studentId) : [...prev, studentId],
    )
  }

  const filteredCounselors = counselors.filter(
    (counselor) =>
      counselor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      counselor.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      counselor.specialization.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">Counselor Management</h1>
          <p className="text-text-secondary">Manage counselors and assign students for guidance</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 rounded-xl p-6"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
              <UserCheck className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-text-muted text-sm">Total Counselors</p>
              <h3 className="text-2xl font-bold text-text-primary">{counselors.length}</h3>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-success/20 to-success/5 border border-success/30 rounded-xl p-6"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-success/20 rounded-lg flex items-center justify-center">
              <UserCheck className="w-6 h-6 text-success" />
            </div>
            <div>
              <p className="text-text-muted text-sm">Available</p>
              <h3 className="text-2xl font-bold text-text-primary">
                {counselors.filter((c) => c.availability === "Available").length}
              </h3>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-info/20 to-info/5 border border-info/30 rounded-xl p-6"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-info/20 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-info" />
            </div>
            <div>
              <p className="text-text-muted text-sm">Total Assignments</p>
              <h3 className="text-2xl font-bold text-text-primary">
                {counselors.reduce((sum, c) => sum + c.assignedStudents, 0)}
              </h3>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-accent/20 to-accent/5 border border-accent/30 rounded-xl p-6"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center">
              <UserCheck className="w-6 h-6 text-accent" />
            </div>
            <div>
              <p className="text-text-muted text-sm">Avg. Students/Counselor</p>
              <h3 className="text-2xl font-bold text-text-primary">
                {counselors.length > 0
                  ? Math.round(counselors.reduce((sum, c) => sum + c.assignedStudents, 0) / counselors.length)
                  : 0}
              </h3>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Actions Bar */}
      <div className="flex items-center justify-between gap-4">
        <Input
          placeholder="Search counselors..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          icon={Search}
          className="max-w-md"
        />
        <Button variant="primary" icon={Plus} onClick={handleAdd}>
          Add Counselor
        </Button>
      </div>

      {/* Counselors Table */}
      <Table
        columns={columns}
        data={filteredCounselors}
        actions={(row) => (
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleAssign(row)}
              className="p-2 text-success hover:bg-success/10 rounded-lg transition-colors"
              title="Assign Students"
            >
              <UserCheck className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleEdit(row)}
              className="p-2 text-info hover:bg-info/10 rounded-lg transition-colors"
              title="Edit"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleDelete(row.id)}
              className="p-2 text-error hover:bg-error/10 rounded-lg transition-colors"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      />

      {/* Add/Edit Counselor Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false)
          setEditingCounselor(null)
        }}
        title={editingCounselor ? "Edit Counselor" : "Add New Counselor"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name"
            placeholder="Enter counselor name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Email"
              type="email"
              placeholder="email@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              icon={Mail}
              required
            />

            <Input
              label="Phone"
              type="tel"
              placeholder="+1 234-567-8900"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              icon={Phone}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Specialization"
              placeholder="e.g., Career Guidance"
              value={formData.specialization}
              onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
              required
            />

            <Input
              label="Experience"
              placeholder="e.g., 5 years"
              value={formData.experience}
              onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-text-secondary">Availability Status</label>
            <select
              value={formData.availability}
              onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
              className="w-full px-4 py-2.5 bg-surface border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="available">Available</option>
              <option value="busy">Busy</option>
              <option value="on-leave">On Leave</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              fullWidth
              onClick={() => {
                setShowModal(false)
                setEditingCounselor(null)
              }}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" fullWidth>
              {editingCounselor ? "Update Counselor" : "Add Counselor"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Assign Students Modal */}
      <Modal
        isOpen={showAssignModal}
        onClose={() => {
          setShowAssignModal(false)
          setSelectedCounselor(null)
          setSelectedStudents([])
        }}
        title={`Assign Students to ${selectedCounselor?.name}`}
        size="lg"
      >
        <div className="space-y-4">
          <p className="text-text-secondary">
            Select students to assign to this counselor. Currently assigned: {selectedCounselor?.assignedStudents}{" "}
            students
          </p>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {availableStudents.map((student) => (
              <label
                key={student.id}
                className="flex items-center gap-3 p-4 bg-surface-light border border-border rounded-lg hover:bg-surface transition-colors cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedStudents.includes(student.id)}
                  onChange={() => toggleStudentSelection(student.id)}
                  className="w-5 h-5 text-primary bg-surface border-border rounded focus:ring-2 focus:ring-primary"
                />
                <div className="flex-1">
                  <p className="text-text-primary font-medium">{student.name}</p>
                  <p className="text-sm text-text-muted">
                    {student.email} • {student.course}
                  </p>
                </div>
              </label>
            ))}
          </div>

          <div className="flex gap-3 pt-4 border-t border-border">
            <Button
              type="button"
              variant="secondary"
              fullWidth
              onClick={() => {
                setShowAssignModal(false)
                setSelectedCounselor(null)
                setSelectedStudents([])
              }}
            >
              Cancel
            </Button>
            <Button type="button" variant="primary" fullWidth onClick={handleAssignSubmit}>
              Assign {selectedStudents.length} Student(s)
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default CounselorPage
