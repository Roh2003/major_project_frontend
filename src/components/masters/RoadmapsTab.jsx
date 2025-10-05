"use client"

import { useState } from "react"
import { Plus, Edit2, Trash2, Search } from "lucide-react"
import Button from "../common/Button"
import Input from "../common/Input"
import Modal from "../common/Modal"
import Table from "../common/Table"
import { toast } from "react-toastify"

const RoadmapsTab = () => {
  const [showModal, setShowModal] = useState(false)
  const [editingRoadmap, setEditingRoadmap] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    duration: "",
    level: "beginner",
    topics: "",
  })

  const [roadmaps, setRoadmaps] = useState([
    {
      id: 1,
      name: "Full Stack Developer Path",
      description: "Complete roadmap from frontend to backend",
      duration: "6 months",
      level: "Intermediate",
      topics: "12",
      enrolled: 456,
    },
    {
      id: 2,
      name: "Data Science Journey",
      description: "From basics to advanced ML techniques",
      duration: "8 months",
      level: "Beginner",
      topics: "15",
      enrolled: 328,
    },
  ])

  const columns = [
    { key: "name", label: "Roadmap Name" },
    { key: "duration", label: "Duration" },
    { key: "level", label: "Level" },
    { key: "topics", label: "Topics" },
    { key: "enrolled", label: "Enrolled" },
  ]

  const handleSubmit = (e) => {
    e.preventDefault()

    if (editingRoadmap) {
      setRoadmaps(
        roadmaps.map((roadmap) => (roadmap.id === editingRoadmap.id ? { ...formData, id: roadmap.id } : roadmap)),
      )
      toast.success("Roadmap updated successfully")
    } else {
      const newRoadmap = {
        ...formData,
        id: roadmaps.length + 1,
        enrolled: 0,
      }
      setRoadmaps([...roadmaps, newRoadmap])
      toast.success("Roadmap created successfully")
    }

    setShowModal(false)
    setEditingRoadmap(null)
    setFormData({
      name: "",
      description: "",
      duration: "",
      level: "beginner",
      topics: "",
    })
  }

  const handleEdit = (roadmap) => {
    setEditingRoadmap(roadmap)
    setFormData(roadmap)
    setShowModal(true)
  }

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this roadmap?")) {
      setRoadmaps(roadmaps.filter((roadmap) => roadmap.id !== id))
      toast.success("Roadmap deleted successfully")
    }
  }

  const handleAdd = () => {
    setEditingRoadmap(null)
    setFormData({
      name: "",
      description: "",
      duration: "",
      level: "beginner",
      topics: "",
    })
    setShowModal(true)
  }

  const filteredRoadmaps = roadmaps.filter((roadmap) => roadmap.name.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <Input
          placeholder="Search roadmaps..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          icon={Search}
          className="max-w-md"
        />
        <Button variant="primary" icon={Plus} onClick={handleAdd}>
          Add Roadmap
        </Button>
      </div>

      <Table
        columns={columns}
        data={filteredRoadmaps}
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

      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false)
          setEditingRoadmap(null)
        }}
        title={editingRoadmap ? "Edit Roadmap" : "Add New Roadmap"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Roadmap Name"
            placeholder="Enter roadmap name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <div className="space-y-2">
            <label className="block text-sm font-medium text-text-secondary">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter roadmap description"
              rows={3}
              className="w-full px-4 py-2.5 bg-surface border border-border rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Duration"
              placeholder="e.g., 6 months"
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

          <Input
            label="Number of Topics"
            type="number"
            placeholder="e.g., 12"
            value={formData.topics}
            onChange={(e) => setFormData({ ...formData, topics: e.target.value })}
            required
          />

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              fullWidth
              onClick={() => {
                setShowModal(false)
                setEditingRoadmap(null)
              }}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" fullWidth>
              {editingRoadmap ? "Update Roadmap" : "Create Roadmap"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default RoadmapsTab
