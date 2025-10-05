"use client"

import { useState } from "react"
import { Plus, Edit2, Trash2, Search } from "lucide-react"
import Button from "../common/Button"
import Input from "../common/Input"
import Modal from "../common/Modal"
import Table from "../common/Table"
import { toast } from "react-toastify"

const ChallengesTab = () => {
  const [showModal, setShowModal] = useState(false)
  const [editingChallenge, setEditingChallenge] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    difficulty: "easy",
    category: "",
    points: "",
    timeLimit: "",
  })

  const [challenges, setChallenges] = useState([
    {
      id: 1,
      name: "Array Manipulation Master",
      difficulty: "Medium",
      category: "Data Structures",
      points: "100",
      timeLimit: "45 mins",
      completed: 342,
    },
    {
      id: 2,
      name: "Binary Search Tree",
      difficulty: "Hard",
      category: "Algorithms",
      points: "150",
      timeLimit: "60 mins",
      completed: 187,
    },
  ])

  const columns = [
    { key: "name", label: "Challenge Name" },
    { key: "difficulty", label: "Difficulty" },
    { key: "category", label: "Category" },
    { key: "points", label: "Points" },
    { key: "timeLimit", label: "Time Limit" },
    { key: "completed", label: "Completed" },
  ]

  const handleSubmit = (e) => {
    e.preventDefault()

    if (editingChallenge) {
      setChallenges(
        challenges.map((challenge) =>
          challenge.id === editingChallenge.id ? { ...formData, id: challenge.id } : challenge,
        ),
      )
      toast.success("Challenge updated successfully")
    } else {
      const newChallenge = {
        ...formData,
        id: challenges.length + 1,
        completed: 0,
      }
      setChallenges([...challenges, newChallenge])
      toast.success("Challenge created successfully")
    }

    setShowModal(false)
    setEditingChallenge(null)
    setFormData({
      name: "",
      difficulty: "easy",
      category: "",
      points: "",
      timeLimit: "",
    })
  }

  const handleEdit = (challenge) => {
    setEditingChallenge(challenge)
    setFormData(challenge)
    setShowModal(true)
  }

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this challenge?")) {
      setChallenges(challenges.filter((challenge) => challenge.id !== id))
      toast.success("Challenge deleted successfully")
    }
  }

  const handleAdd = () => {
    setEditingChallenge(null)
    setFormData({
      name: "",
      difficulty: "easy",
      category: "",
      points: "",
      timeLimit: "",
    })
    setShowModal(true)
  }

  const filteredChallenges = challenges.filter((challenge) =>
    challenge.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <Input
          placeholder="Search challenges..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          icon={Search}
          className="max-w-md"
        />
        <Button variant="primary" icon={Plus} onClick={handleAdd}>
          Add Challenge
        </Button>
      </div>

      <Table
        columns={columns}
        data={filteredChallenges}
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
          setEditingChallenge(null)
        }}
        title={editingChallenge ? "Edit Challenge" : "Add New Challenge"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Challenge Name"
            placeholder="Enter challenge name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-secondary">Difficulty</label>
              <select
                value={formData.difficulty}
                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                className="w-full px-4 py-2.5 bg-surface border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            <Input
              label="Category"
              placeholder="e.g., Data Structures"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Points"
              type="number"
              placeholder="e.g., 100"
              value={formData.points}
              onChange={(e) => setFormData({ ...formData, points: e.target.value })}
              required
            />

            <Input
              label="Time Limit"
              placeholder="e.g., 45 mins"
              value={formData.timeLimit}
              onChange={(e) => setFormData({ ...formData, timeLimit: e.target.value })}
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
                setEditingChallenge(null)
              }}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" fullWidth>
              {editingChallenge ? "Update Challenge" : "Create Challenge"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default ChallengesTab
