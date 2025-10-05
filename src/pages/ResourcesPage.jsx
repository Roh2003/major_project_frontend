"use client"

import { useState } from "react"
import { Edit2, Trash2, Search, FileText, Video, ImageIcon, File, Download, Eye, Upload } from "lucide-react"
import { motion } from "framer-motion"
import Button from "../components/common/Button"
import Input from "../components/common/Input"
import Modal from "../components/common/Modal"
import Table from "../components/common/Table"
import { toast } from "react-toastify"

const ResourcesPage = () => {
  const [showModal, setShowModal] = useState(false)
  const [editingResource, setEditingResource] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "document",
    type: "pdf",
    url: "",
    size: "",
    uploadedBy: "Admin",
  })

  const [resources, setResources] = useState([
    {
      id: 1,
      title: "JavaScript Fundamentals Guide",
      description: "Complete guide to JavaScript basics",
      category: "Document",
      type: "PDF",
      url: "/resources/js-guide.pdf",
      size: "2.5 MB",
      uploadedBy: "Admin",
      downloads: 342,
      uploadDate: "2025-01-15",
    },
    {
      id: 2,
      title: "React Tutorial Series",
      description: "Video series on React development",
      category: "Video",
      type: "MP4",
      url: "/resources/react-tutorial.mp4",
      size: "125 MB",
      uploadedBy: "Admin",
      downloads: 189,
      uploadDate: "2025-01-20",
    },
    {
      id: 3,
      title: "UI Design Patterns",
      description: "Collection of modern UI patterns",
      category: "Image",
      type: "PNG",
      url: "/resources/ui-patterns.png",
      size: "5.8 MB",
      uploadedBy: "Admin",
      downloads: 256,
      uploadDate: "2025-01-25",
    },
    {
      id: 4,
      title: "Python Cheat Sheet",
      description: "Quick reference for Python syntax",
      category: "Document",
      type: "PDF",
      url: "/resources/python-cheat.pdf",
      size: "1.2 MB",
      uploadedBy: "Admin",
      downloads: 421,
      uploadDate: "2025-02-01",
    },
  ])

  const categories = [
    { value: "all", label: "All Resources", icon: File },
    { value: "document", label: "Documents", icon: FileText },
    { value: "video", label: "Videos", icon: Video },
    { value: "image", label: "Images", icon: ImageIcon },
  ]

  const columns = [
    { key: "title", label: "Resource Title" },
    { key: "category", label: "Category" },
    { key: "type", label: "Type" },
    { key: "size", label: "Size" },
    { key: "uploadedBy", label: "Uploaded By" },
    { key: "downloads", label: "Downloads" },
    { key: "uploadDate", label: "Upload Date" },
  ]

  const handleSubmit = (e) => {
    e.preventDefault()

    if (editingResource) {
      setResources(
        resources.map((resource) => (resource.id === editingResource.id ? { ...formData, id: resource.id } : resource)),
      )
      toast.success("Resource updated successfully")
    } else {
      const newResource = {
        ...formData,
        id: resources.length + 1,
        downloads: 0,
        uploadDate: new Date().toISOString().split("T")[0],
      }
      setResources([...resources, newResource])
      toast.success("Resource uploaded successfully")
    }

    setShowModal(false)
    setEditingResource(null)
    setFormData({
      title: "",
      description: "",
      category: "document",
      type: "pdf",
      url: "",
      size: "",
      uploadedBy: "Admin",
    })
  }

  const handleEdit = (resource) => {
    setEditingResource(resource)
    setFormData(resource)
    setShowModal(true)
  }

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this resource?")) {
      setResources(resources.filter((resource) => resource.id !== id))
      toast.success("Resource deleted successfully")
    }
  }

  const handleAdd = () => {
    setEditingResource(null)
    setFormData({
      title: "",
      description: "",
      category: "document",
      type: "pdf",
      url: "",
      size: "",
      uploadedBy: "Admin",
    })
    setShowModal(true)
  }

  const handleDownload = (resource) => {
    toast.success(`Downloading ${resource.title}...`)
    setResources(resources.map((r) => (r.id === resource.id ? { ...r, downloads: r.downloads + 1 } : r)))
  }

  const handlePreview = (resource) => {
    toast.info(`Opening preview for ${resource.title}`)
  }

  const filteredResources = resources.filter((resource) => {
    const matchesSearch =
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = filterCategory === "all" || resource.category.toLowerCase() === filterCategory
    return matchesSearch && matchesCategory
  })

  const stats = {
    total: resources.length,
    documents: resources.filter((r) => r.category === "Document").length,
    videos: resources.filter((r) => r.category === "Video").length,
    images: resources.filter((r) => r.category === "Image").length,
    totalDownloads: resources.reduce((sum, r) => sum + r.downloads, 0),
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">Resource Management</h1>
          <p className="text-text-secondary">Upload and manage learning resources for students</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 rounded-xl p-6"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
              <File className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-text-muted text-sm">Total Resources</p>
              <h3 className="text-2xl font-bold text-text-primary">{stats.total}</h3>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-info/20 to-info/5 border border-info/30 rounded-xl p-6"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-info/20 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-info" />
            </div>
            <div>
              <p className="text-text-muted text-sm">Documents</p>
              <h3 className="text-2xl font-bold text-text-primary">{stats.documents}</h3>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-success/20 to-success/5 border border-success/30 rounded-xl p-6"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-success/20 rounded-lg flex items-center justify-center">
              <Video className="w-6 h-6 text-success" />
            </div>
            <div>
              <p className="text-text-muted text-sm">Videos</p>
              <h3 className="text-2xl font-bold text-text-primary">{stats.videos}</h3>
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
              <ImageIcon className="w-6 h-6 text-accent" />
            </div>
            <div>
              <p className="text-text-muted text-sm">Images</p>
              <h3 className="text-2xl font-bold text-text-primary">{stats.images}</h3>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 rounded-xl p-6"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
              <Download className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-text-muted text-sm">Total Downloads</p>
              <h3 className="text-2xl font-bold text-text-primary">{stats.totalDownloads}</h3>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Category Filter */}
      <div className="flex gap-3 overflow-x-auto pb-2">
        {categories.map((category) => {
          const Icon = category.icon
          return (
            <button
              key={category.value}
              onClick={() => setFilterCategory(category.value)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                filterCategory === category.value
                  ? "bg-primary text-white shadow-lg"
                  : "bg-surface border border-border text-text-secondary hover:bg-surface-light"
              }`}
            >
              <Icon className="w-4 h-4" />
              {category.label}
            </button>
          )
        })}
      </div>

      {/* Actions Bar */}
      <div className="flex items-center justify-between gap-4">
        <Input
          placeholder="Search resources..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          icon={Search}
          className="max-w-md"
        />
        <Button variant="primary" icon={Upload} onClick={handleAdd}>
          Upload Resource
        </Button>
      </div>

      {/* Resources Table */}
      <Table
        columns={columns}
        data={filteredResources}
        actions={(row) => (
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePreview(row)}
              className="p-2 text-info hover:bg-info/10 rounded-lg transition-colors"
              title="Preview"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleDownload(row)}
              className="p-2 text-success hover:bg-success/10 rounded-lg transition-colors"
              title="Download"
            >
              <Download className="w-4 h-4" />
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

      {/* Upload/Edit Resource Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false)
          setEditingResource(null)
        }}
        title={editingResource ? "Edit Resource" : "Upload New Resource"}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Resource Title"
            placeholder="Enter resource title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />

          <div className="space-y-2">
            <label className="block text-sm font-medium text-text-secondary">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter resource description"
              rows={3}
              className="w-full px-4 py-2.5 bg-surface border border-border rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-secondary">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2.5 bg-surface border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="document">Document</option>
                <option value="video">Video</option>
                <option value="image">Image</option>
              </select>
            </div>

            <Input
              label="File Type"
              placeholder="e.g., PDF, MP4, PNG"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="File Size"
              placeholder="e.g., 2.5 MB"
              value={formData.size}
              onChange={(e) => setFormData({ ...formData, size: e.target.value })}
              required
            />

            <Input
              label="Uploaded By"
              placeholder="Admin name"
              value={formData.uploadedBy}
              onChange={(e) => setFormData({ ...formData, uploadedBy: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-text-secondary">File URL or Upload</label>
            <div className="flex gap-3">
              <Input
                placeholder="Enter file URL or upload file"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                required
              />
              <Button type="button" variant="secondary" icon={Upload}>
                Browse
              </Button>
            </div>
            <p className="text-xs text-text-muted">Enter a URL or click Browse to upload a file</p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              fullWidth
              onClick={() => {
                setShowModal(false)
                setEditingResource(null)
              }}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" fullWidth>
              {editingResource ? "Update Resource" : "Upload Resource"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default ResourcesPage
