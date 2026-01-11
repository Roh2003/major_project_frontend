"use client"

import { useState, useEffect } from "react"
import { Plus, Search, UserCheck, Edit2, Trash2, Users, Briefcase, Clock, Star } from "lucide-react"
import { motion } from "framer-motion"
import Button from "../components/common/Button"
import Input from "../components/common/Input"
import Modal from "../components/common/Modal"
import Table from "../components/common/Table"
import { toast } from "react-toastify"
import { uploadToCloudinary } from "../utils/cloudnery"
import counselorService from "../services/counselor.service"

const CounselorPage = () => {
  const [showModal, setShowModal] = useState(false)
  const [editingCounselor, setEditingCounselor] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [uploading, setUploading] = useState(false)
  const [imageFile, setImageFile] = useState(null)
  const [loading, setLoading] = useState(false)

  const emptyForm = {
    name: "",
    email: "",
    password: "",
    specialization: "CODING",
    experience: "",
    employmentType: "FULL_TIME",
    bio: "",
    profileImage: "",
  }

  const [formData, setFormData] = useState({ ...emptyForm })
  const [counselors, setCounselors] = useState([])

  useEffect(() => {
    loadCounselors()
  }, [])

  const loadCounselors = async () => {
    try {
      setLoading(true)
      const data = await counselorService.getAllCounselor()
      setCounselors(data.data.data)
    } catch {
      toast.error("Failed to load counselors")
    } finally {
      setLoading(false)
    }
  }

  // Calculate stats
  const stats = {
    total: counselors.length,
    fullTime: counselors.filter(c => c.employmentType === "FULL_TIME").length,
    partTime: counselors.filter(c => c.employmentType === "PART_TIME").length,
    avgExperience: counselors.length > 0 
      ? Math.round(counselors.reduce((sum, c) => sum + (c.experience || 0), 0) / counselors.length * 10) / 10
      : 0,
  }

  // Edit
  const handleEdit = (counselor) => {
    setEditingCounselor(counselor)
    setFormData({
      ...counselor,
      password: "", // For security; admin must enter a temp password again for updates
    })
    setShowModal(true)
  }

  // Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this counselor?")) return
    try {
      await counselorService.deleteCounselor(id)
      toast.success("Counselor deleted")
      loadCounselors()
    } catch {
      toast.error("Failed to delete counselor")
    }
  }

  // Add or Update
  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      setUploading(true)

      let imageUrl = formData.profileImage
      if (imageFile) {
        const uploadResult = await uploadToCloudinary(imageFile, "skillup/counselors")
        imageUrl = uploadResult.url
      }

      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        specialization: formData.specialization,
        experience: Number(formData.experience),
        employmentType: formData.employmentType,
        bio: formData.bio,
        profileImage: imageUrl,
      }

      if (editingCounselor) {
        await counselorService.updateCounselor(editingCounselor.id, payload)
        toast.success("Counselor updated successfully")
      } else {
        await counselorService.createCounselor(payload)
        toast.success("Counselor created successfully")
      }

      setShowModal(false)
      setFormData({ ...emptyForm })
      setEditingCounselor(null)
      setImageFile(null)
      loadCounselors()
    } catch (error) {
      console.error(error)
      toast.error(editingCounselor ? "Failed to update counselor" : "Failed to create counselor")
    } finally {
      setUploading(false)
    }
  }

  // Reset Modal to Add mode
  const handleAdd = () => {
    setEditingCounselor(null)
    setFormData({ ...emptyForm })
    setImageFile(null)
    setShowModal(true)
  }

  const filteredCounselors = Array.isArray(counselors)
    ? counselors.filter(
        (c) =>
          c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.specialization?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : []

  const columns = [
    { 
      key: "name", 
      label: "Name",
      render: (value, row) => (
        <div className="flex items-center gap-3">
          {row.profileImage ? (
            <img 
              src={row.profileImage} 
              alt={value} 
              className="w-10 h-10 rounded-full object-cover border-2 border-primary/20"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-primary" />
            </div>
          )}
          <span className="font-medium">{value}</span>
        </div>
      )
    },
    { key: "email", label: "Email" },
    { 
      key: "specialization", 
      label: "Specialization",
      render: (value) => (
        <span className="px-3 py-1 bg-info/10 text-info rounded-full text-sm font-medium">
          {value}
        </span>
      )
    },
    { 
      key: "employmentType", 
      label: "Employment",
      render: (value) => (
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
          value === "FULL_TIME" 
            ? "bg-success/10 text-success" 
            : "bg-accent/10 text-accent"
        }`}>
          {value === "FULL_TIME" ? "Full Time" : "Part Time"}
        </span>
      )
    },
    { 
      key: "experience", 
      label: "Experience",
      render: (value) => `${value} ${value === 1 ? 'year' : 'years'}`
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">
            Counselor Management
          </h1>
          <p className="text-text-secondary">
            Create and manage SkillUp counselors
          </p>
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
              <h3 className="text-2xl font-bold text-text-primary">{stats.total}</h3>
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
              <Briefcase className="w-6 h-6 text-success" />
            </div>
            <div>
              <p className="text-text-muted text-sm">Full Time</p>
              <h3 className="text-2xl font-bold text-text-primary">{stats.fullTime}</h3>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-accent/20 to-accent/5 border border-accent/30 rounded-xl p-6"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-accent" />
            </div>
            <div>
              <p className="text-text-muted text-sm">Part Time</p>
              <h3 className="text-2xl font-bold text-text-primary">{stats.partTime}</h3>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-info/20 to-info/5 border border-info/30 rounded-xl p-6"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-info/20 rounded-lg flex items-center justify-center">
              <Star className="w-6 h-6 text-info" />
            </div>
            <div>
              <p className="text-text-muted text-sm">Avg Experience</p>
              <h3 className="text-2xl font-bold text-text-primary">{stats.avgExperience} yrs</h3>
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

      {/* Table with Edit/Delete Actions */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-text-secondary">Loading counselors...</p>
        </div>
      ) : (
        <Table
          columns={columns}
          data={filteredCounselors}
          actions={(row) => (
            <div className="flex items-center gap-2">
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
      )}

      {/* Modal for Add/Edit Counselor */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingCounselor ? "Edit Counselor" : "Add New Counselor"}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Profile Image */}
          <div className="flex flex-col items-center space-y-3">
            <div className="relative flex flex-col items-center">
              {(formData.profileImage || imageFile) ? (
                <img
                  src={imageFile ? URL.createObjectURL(imageFile) : formData.profileImage}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover border-4 border-primary/20 shadow-lg mb-2"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border-4 border-primary/20 flex items-center justify-center mb-2">
                  <Users className="w-12 h-12 text-primary/40" />
                </div>
              )}
              <label htmlFor="profile-image-upload" className="cursor-pointer mt-2 px-6 py-2 rounded-lg bg-primary text-white text-sm font-medium shadow-lg hover:bg-primary/90 transition-all hover:shadow-xl">
                {imageFile ? "Change Photo" : "Upload Photo"}
                <input
                  id="profile-image-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => e.target.files[0] && setImageFile(e.target.files[0])}
                />
              </label>
              {imageFile && (
                <span className="text-xs text-success mt-2 font-medium">
                  ✓ {imageFile.name}
                </span>
              )}
            </div>
          </div>

          <Input
            label="Full Name"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            required
            placeholder="Enter counselor's full name"
          />

          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
            disabled={!!editingCounselor}
            placeholder="counselor@skillup.com"
          />

          <Input
            label="Temporary Password"
            type="password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            required={!editingCounselor}
            placeholder={editingCounselor ? "Leave empty to keep current password" : "Set temporary password"}
          />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-secondary">
                Specialization
              </label>
              <input
                type="text"
                value={formData.specialization}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    specialization: e.target.value,
                  })
                }
                className="w-full px-4 py-2.5 bg-surface border border-border rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="e.g. Coding, English, Design"
              />
            </div>

            <Input
              label="Experience (years)"
              type="number"
              value={formData.experience}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  experience: e.target.value,
                })
              }
              required
              min="0"
              placeholder="Years of experience"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-text-secondary">
              Employment Type
            </label>
            <select
              value={formData.employmentType}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  employmentType: e.target.value,
                })
              }
              className="w-full px-4 py-2.5 bg-surface border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="FULL_TIME">Full Time</option>
              <option value="PART_TIME">Part Time</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-text-secondary">
              Bio (Optional)
            </label>
            <textarea
              placeholder="Short bio about the counselor..."
              value={formData.bio}
              onChange={(e) =>
                setFormData({ ...formData, bio: e.target.value })
              }
              rows={3}
              className="w-full px-4 py-2.5 bg-surface border border-border rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="secondary" fullWidth onClick={() => setShowModal(false)} disabled={uploading}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" fullWidth disabled={uploading}>
              {uploading
                ? (editingCounselor ? "Saving..." : "Creating...")
                : (editingCounselor ? "Update Counselor" : "Create Counselor")}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default CounselorPage
