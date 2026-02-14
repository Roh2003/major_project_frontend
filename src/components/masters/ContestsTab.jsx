"use client"

import { useEffect, useState } from "react"
import { Plus, Edit2, Trash2, Search, ListChecks } from "lucide-react"
import Button from "../common/Button"
import Input from "../common/Input"
import Modal from "../common/Modal"
import Table from "../common/Table"
import { toast } from "react-toastify"

// SERVICES (you will implement)
import ContestService from "../../services/contest.sevice"
import QuestionManager from "./QuestionManager"
import contestService from "../../services/contest.sevice"

// Helper to format a Date as local "YYYY-MM-DDTHH:mm" for datetime-local inputs
const toLocalDateTimeString = (dateStr) => {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const ContestsTab = () => {
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showQuestionModal, setShowQuestionModal] = useState(false)
  const [activeContestId, setActiveContestId] = useState(null)

  const [editingContest, setEditingContest] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    startTime: "",
    endTime: "",
    durationMinutes: "",
    isPublished: false
  })

  const [contests, setContests] = useState([])

  const columns = [
    { key: "title", label: "Title" },
    { key: "category", label: "Category" },
    { key: "durationMinutes", label: "Duration (min)" },
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
    loadContest()
  }, [])

  const loadContest = async () => {
    try {
      setLoading(true)
      const data = await contestService.getContests()
      console.log("data of contest", data)
      setContests(data.data.data)
    } catch {
      toast.error("Failed to load contest")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      if (editingContest) {
        await ContestService.updateContest(editingContest.id, formData)
        toast.success("Contest updated")
      } else {
        await ContestService.createContest(formData)
        toast.success("Contest created")
      }
      setShowModal(false)
      setEditingContest(null)
      resetForm()
    } catch {
      toast.error("Operation failed")
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      category: "",
      startTime: "",
      endTime: "",
      durationMinutes: "",
      isPublished: false
    })
  }

  const handleEdit = (contest) => {
    setEditingContest(contest)
    setFormData(contest)
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (!confirm("Delete this contest?")) return
    await ContestService.deleteContest(id)
    toast.success("Contest deleted")
  }

  const handleAdd = () => {
    setEditingContest(null)
    resetForm()
    setShowModal(true)
  }

  const filteredContests = Array.isArray(contests)
    ? contests.filter((c) =>
        typeof c.title === "string" &&
        c.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  console.log("filteredcontest", filteredContests)
  console.log("filteredcontest 1", contests)

  return (
    <div className="space-y-6">

      {/* Header */}
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

      {/* Contest Table */}
      <Table
        columns={[
          ...columns,
          {
            key: "startTime",
            label: "Start Time",
            render: (value, row) => {
              // If `row.startTime` is falsy, return "-"
              if (!row.startTime) return "-";
              // Parse date if possible
              const local = new Date(row.startTime);
              return isNaN(local.getTime())
                ? row.startTime
                : local.toLocaleString();
            },
          },
          {
            key: "endTime",
            label: "End Time",
            render: (value, row) => {
              if (!row.endTime) return "-";
              const local = new Date(row.endTime);
              return isNaN(local.getTime())
                ? row.endTime
                : local.toLocaleString();
            },
          },
        ]}
        data={filteredContests}
        actions={(row) => (
          <div className="flex items-center gap-2">
            <button onClick={() => handleEdit(row)} className="icon-btn">
              <Edit2 size={16} />
            </button>

            <button onClick={() => handleDelete(row.id)} className="icon-btn text-red-500">
              <Trash2 size={16} />
            </button>

            <button
              onClick={() => {
                setActiveContestId(row.id)
                setShowQuestionModal(true)
              }}
              className="icon-btn text-indigo-500"
              title="Manage Questions"
            >
              <ListChecks size={16} />
            </button>
          </div>
        )}
      />

      {/* Contest Create / Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingContest ? "Edit Contest" : "Create Contest"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">

          <Input
            label="Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />

          <Input
            label="Category"
            placeholder="Web / DSA / AI"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            required
          />

          <textarea
            placeholder="Contest description"
            className="w-full px-4 py-2.5 border rounded-lg bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary transition resize-none"
            rows={3}
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              type="datetime-local"
              label="Start Time"
              value={
                formData.startTime
                  ? toLocalDateTimeString(formData.startTime)
                  : ""
              }
              onChange={(e) =>
                setFormData({ ...formData, startTime: new Date(e.target.value).toISOString() })
              }
              required
            />

            <Input
              type="datetime-local"
              label="End Time"
              value={
                formData.endTime
                  ? toLocalDateTimeString(formData.endTime)
                  : ""
              }
              onChange={(e) =>
                setFormData({ ...formData, endTime: new Date(e.target.value).toISOString() })
              }
              required
            />
          </div>

          <Input
            type="number"
            label="Duration (minutes)"
            value={formData.durationMinutes}
            onChange={(e) =>
              setFormData({ ...formData, durationMinutes: e.target.value })
            }
            required
          />

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

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="secondary" fullWidth onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" fullWidth>
              {editingContest ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Question Manager Modal */}
      <Modal
        isOpen={showQuestionModal}
        onClose={() => setShowQuestionModal(false)}
        title="Manage Questions"
        size="xl"
      >
        <QuestionManager contestId={activeContestId} />
      </Modal>
    </div>
  )
}

export default ContestsTab
