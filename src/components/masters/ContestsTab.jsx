"use client"

import { useState } from "react"
import { Plus, Edit2, Trash2, Search } from "lucide-react"
import Button from "../common/Button"
import Input from "../common/Input"
import Modal from "../common/Modal"
import Table from "../common/Table"
import { toast } from "react-toastify"

const ContestsTab = () => {
  const [showModal, setShowModal] = useState(false)
  const [editingContest, setEditingContest] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    duration: "",
    startTime: "",
    endTime: "",
    questions: "",
    prize: "",
  })

  const [contests, setContests] = useState([
    {
      id: 1,
      name: "JavaScript Challenge 2025",
      duration: "2 hours",
      startTime: "2025-02-15 10:00",
      endTime: "2025-02-15 12:00",
      questions: "20",
      prize: "$500",
      participants: 156,
    },
    {
      id: 2,
      name: "Python Coding Sprint",
      duration: "3 hours",
      startTime: "2025-02-20 14:00",
      endTime: "2025-02-20 17:00",
      questions: "15",
      prize: "$750",
      participants: 203,
    },
  ])

  const columns = [
    { key: "name", label: "Contest Name" },
    { key: "duration", label: "Duration" },
    { key: "startTime", label: "Start Time" },
    { key: "endTime", label: "End Time" },
    { key: "questions", label: "Questions" },
    { key: "prize", label: "Prize" },
    { key: "participants", label: "Participants" },
  ]

  const handleSubmit = (e) => {
    e.preventDefault()

    if (editingContest) {
      setContests(
        contests.map((contest) => (contest.id === editingContest.id ? { ...formData, id: contest.id } : contest)),
      )
      toast.success("Contest updated successfully")
    } else {
      const newContest = {
        ...formData,
        id: contests.length + 1,
        participants: 0,
      }
      setContests([...contests, newContest])
      toast.success("Contest created successfully")
    }

    setShowModal(false)
    setEditingContest(null)
    setFormData({
      name: "",
      duration: "",
      startTime: "",
      endTime: "",
      questions: "",
      prize: "",
    })
  }

  const handleEdit = (contest) => {
    setEditingContest(contest)
    setFormData(contest)
    setShowModal(true)
  }

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this contest?")) {
      setContests(contests.filter((contest) => contest.id !== id))
      toast.success("Contest deleted successfully")
    }
  }

  const handleAdd = () => {
    setEditingContest(null)
    setFormData({
      name: "",
      duration: "",
      startTime: "",
      endTime: "",
      questions: "",
      prize: "",
    })
    setShowModal(true)
  }

  const filteredContests = contests.filter((contest) => contest.name.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <Input
          placeholder="Search contests..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          icon={Search}
          className="max-w-md"
        />
        <Button variant="primary" icon={Plus} onClick={handleAdd}>
          Add Contest
        </Button>
      </div>

      <Table
        columns={columns}
        data={filteredContests}
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
          setEditingContest(null)
        }}
        title={editingContest ? "Edit Contest" : "Add New Contest"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Contest Name"
            placeholder="Enter contest name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Duration"
              placeholder="e.g., 2 hours"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              required
            />

            <Input
              label="Number of Questions"
              type="number"
              placeholder="e.g., 20"
              value={formData.questions}
              onChange={(e) => setFormData({ ...formData, questions: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Start Time"
              type="datetime-local"
              value={formData.startTime}
              onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
              required
            />

            <Input
              label="End Time"
              type="datetime-local"
              value={formData.endTime}
              onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
              required
            />
          </div>

          <Input
            label="Prize"
            placeholder="e.g., $500"
            value={formData.prize}
            onChange={(e) => setFormData({ ...formData, prize: e.target.value })}
            required
          />

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              fullWidth
              onClick={() => {
                setShowModal(false)
                setEditingContest(null)
              }}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" fullWidth>
              {editingContest ? "Update Contest" : "Create Contest"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default ContestsTab
