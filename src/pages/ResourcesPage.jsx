"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Edit2, Trash2, Search, FileText, Video, ImageIcon, File, Download, Eye, Upload } from "lucide-react"
import { motion } from "framer-motion"
import Button from "../components/common/Button"
import Input from "../components/common/Input"
import Modal from "../components/common/Modal"
import Table from "../components/common/Table"
import { toast } from "react-toastify"
import { uploadToCloudinary } from "../utils/cloudnery"
import resourceService from "../services/resource.service"

const ResourcesPage = () => {
  const [showModal, setShowModal] = useState(false)
  const [editingResource, setEditingResource] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "document",
    type: "",
    url: "",
    size: "",
    uploadedBy: "Admin",
  })

  const [resources, setResources] = useState([])
  const [stats, setStats] = useState({
    total: 0,
    documents: 0,
    videos: 0,
    images: 0,
    totalDownloads: 0,
  })

  // Ref to prevent duplicate API calls
  const fetchingRef = useRef(false)

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
    { 
      key: "createdAt", 
      label: "Upload Date",
      render: (value) => new Date(value).toLocaleDateString()
    },
  ]

  // Fetch resources on component mount and when filters change
  useEffect(() => {
    fetchStats() // Only fetch stats once on mount
  }, [])

  const fetchResources = useCallback(async () => {
    // Prevent duplicate calls
    if (fetchingRef.current) {
      console.log("Already fetching, skipping...")
      return
    }

    try {
      fetchingRef.current = true
      setLoading(true)
      const params = {}
      
      if (filterCategory !== "all") {
        params.category = filterCategory
      }
      
      if (searchQuery) {
        params.search = searchQuery
      }

      const response = await resourceService.getAllResources(params)
      setResources(response.data.data)
      toast.success("Resources fetched successfully")

    } catch (error) {
      console.error("Fetch resources error:", error)
      toast.error("Failed to fetch resources")
    } finally {
      setLoading(false)
      fetchingRef.current = false
    }
  }, [filterCategory, searchQuery])

  const fetchStats = async () => {
    try {
      const response = await resourceService.getResourceStats()
      setStats(response.data.data)

    } catch (error) {
      console.error("Fetch stats error:", error)
    }
  }

  // Refetch resources when search or filter changes (with debounce)
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchResources()
    }, 300)

    return () => clearTimeout(delayDebounceFn)
  }, [fetchResources])

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedFile(file)
      
      // Auto-detect category and type
      const fileType = file.type
      let category = "other"
      let type = file.name.split('.').pop().toUpperCase()
      
      if (fileType.startsWith("image/")) {
        category = "image"
      } else if (fileType.startsWith("video/")) {
        category = "video"
      } else {
        category = "document"
      }
      
      setFormData({
        ...formData,
        category,
        type,
        size: formatFileSize(file.size)
      })
    }
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      setUploading(true)
      
      let resourceData = { ...formData }

      // Upload file to Cloudinary if a file is selected
      if (selectedFile) {
        toast.info("Uploading file to Cloudinary...")
        const uploadResult = await uploadToCloudinary(selectedFile, "resources")
        
        resourceData.url = uploadResult.url
        resourceData.size = uploadResult.size
        resourceData.type = uploadResult.format.toUpperCase()
      }

      // Validate required fields
      if (!resourceData.title || !resourceData.url) {
        toast.error("Title and file are required")
        return
      }

      let response
      if (editingResource) {
        response = await resourceService.updateResource(editingResource.id, resourceData)
        toast.success("Resource updated successfully")
        setResources(resources.map((r) => 
          r.id === editingResource.id ? response.data.data : r
        ))
      } else {
        response = await resourceService.createResource(resourceData)
        toast.success("Resource uploaded successfully")
        setResources([response.data.data, ...resources])
      }

      // Close modal and reset form
      setShowModal(false)
      setEditingResource(null)
      setSelectedFile(null)
      resetForm()
      fetchStats() // Refresh stats

    } catch (error) {
      console.error("Submit error:", error)
      toast.error(error.response?.data?.message || "Failed to save resource")
    } finally {
      setUploading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      category: "document",
      type: "",
      url: "",
      size: "",
      uploadedBy: "Admin",
    })
  }

  const handleEdit = (resource) => {
    setEditingResource(resource)
    setFormData({
      title: resource.title,
      description: resource.description || "",
      category: resource.category.toLowerCase(),
      type: resource.type,
      url: resource.url,
      size: resource.size || "",
      uploadedBy: resource.uploadedBy || "Admin",
    })
    setSelectedFile(null)
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this resource?")) {
      try {
        const response = await resourceService.deleteResource(id)

          setResources(resources.filter((resource) => resource.id !== id))
          toast.success("Resource deleted successfully")
          fetchStats() // Refresh stats

      } catch (error) {
        console.error("Delete error:", error)
        toast.error("Failed to delete resource")
      }
    }
  }

  const handleAdd = () => {
    setEditingResource(null)
    setSelectedFile(null)
    resetForm()
    setShowModal(true)
  }

  const handleDownload = async (resource) => {
    try {
      // Increment download count
      await resourceService.incrementDownload(resource.id)
      
      // Open resource in new tab
      window.open(resource.url, '_blank')
      
      toast.success(`Downloading ${resource.title}...`)
      
      // Update local state
      setResources(resources.map((r) => 
        r.id === resource.id ? { ...r, downloads: r.downloads + 1 } : r
      ))
      
      fetchStats() // Refresh stats
    } catch (error) {
      console.error("Download error:", error)
      toast.error("Failed to track download")
    }
  }

  const handlePreview = (resource) => {
    window.open(resource.url, '_blank')
    toast.info(`Opening preview for ${resource.title}`)
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
      {loading ? (
        <div className="text-center py-12">
          <p className="text-text-secondary">Loading resources...</p>
        </div>
      ) : (
        <Table
          columns={columns}
          data={resources}
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
      )}

      {/* Upload/Edit Resource Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false)
          setEditingResource(null)
          setSelectedFile(null)
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
                <option value="other">Other</option>
              </select>
            </div>

            <Input
              label="File Type"
              placeholder="e.g., PDF, MP4, PNG"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              disabled={selectedFile !== null}
            />
          </div>

          <Input
            label="Uploaded By"
            placeholder="Admin name"
            value={formData.uploadedBy}
            onChange={(e) => setFormData({ ...formData, uploadedBy: e.target.value })}
          />

          <div className="space-y-2">
            <label className="block text-sm font-medium text-text-secondary">
              Upload File {!editingResource && <span className="text-error">*</span>}
            </label>
            <div className="flex gap-3">
              <input
                type="file"
                onChange={handleFileSelect}
                className="flex-1 px-4 py-2.5 bg-surface border border-border rounded-lg text-text-primary file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90"
                accept="image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
              />
            </div>
            {selectedFile && (
              <p className="text-xs text-success">
                Selected: {selectedFile.name} ({formatFileSize(selectedFile.size)})
              </p>
            )}
            {editingResource && !selectedFile && (
              <p className="text-xs text-text-muted">
                Leave empty to keep existing file
              </p>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              fullWidth
              onClick={() => {
                setShowModal(false)
                setEditingResource(null)
                setSelectedFile(null)
              }}
              disabled={uploading}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" fullWidth disabled={uploading}>
              {uploading ? "Uploading..." : editingResource ? "Update Resource" : "Upload Resource"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default ResourcesPage
