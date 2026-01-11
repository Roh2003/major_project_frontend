"use client"

import { useEffect, useState } from "react"
import { Trash2, Edit2, Eye } from "lucide-react"
import Button from "../common/Button"
import Input from "../common/Input"
import Modal from "../common/Modal"
import { toast } from "react-toastify"

// SERVICES (you will implement)
import ContestService from "../../services/contest.sevice"

const initialForm = {
  question: "",
  optionA: "",
  optionB: "",
  optionC: "",
  optionD: "",
  correctOption: "A",
  marks: 1,
}

const QuestionManager = ({ contestId }) => {
  const [questions, setQuestions] = useState([])
  const [form, setForm] = useState(initialForm)
  const [editingId, setEditingId] = useState(null)
  const [preview, setPreview] = useState(null)

  useEffect(() => {
    if (contestId) loadQuestions()
  }, [contestId])

  const loadQuestions = async () => {
    try {
      const res = await ContestService.getContestById(contestId)
      setQuestions(res.data.data.ContestQuestion || [])
    } catch {
      toast.error("Failed to load questions")
    }
  }

  const handleSubmit = async () => {
    const { question, optionA, optionB, optionC, optionD } = form

    if (!question || !optionA || !optionB || !optionC || !optionD) {
      toast.error("All fields are required")
      return
    }

    try {
      if (editingId) {
        await ContestService.updateQuestion(editingId, form)
        toast.success("Question updated")
      } else {
        await ContestService.addContestQuestion(contestId, form)
        toast.success("Question added")
      }

      setForm(initialForm)
      setEditingId(null)
      loadQuestions()
    } catch {
      toast.error("Operation failed")
    }
  }

  const handleEdit = (q) => {
    setEditingId(q.id)
    setForm({
      question: q.questionText,
      optionA: q.optionA,
      optionB: q.optionB,
      optionC: q.optionC,
      optionD: q.optionD,
      correctOption: q.correctOption,
      marks: q.marks,
    })
  }

  const handleDelete = async (id) => {
    if (!confirm("Delete this question?")) return
    try {
      await ContestService.deleteQuestion(id)
      toast.success("Question deleted")
      loadQuestions()
    } catch {
      toast.error("Delete failed")
    }
  }

  return (
    <div className="space-y-6">

      {/* QUESTIONS TABLE */}
      <div className="border border-border rounded-lg overflow-hidden">
        <div className="max-h-[320px] overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/30 sticky top-0 z-10">
              <tr>
                <th className="p-2 w-12 text-left">#</th>
                <th className="p-2 text-left">Question</th>
                <th className="p-2 w-24 text-center">Correct</th>
                <th className="p-2 w-20 text-center">Marks</th>
                <th className="p-2 w-32 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {questions.map((q, index) => (
                <tr
                  key={q.id}
                  className="border-t hover:bg-muted/20 transition"
                >
                  <td className="p-2">{index + 1}</td>

                  <td className="p-2 truncate max-w-[400px]">
                    {q.questionText}
                  </td>

                  <td className="p-2 text-center font-semibold">
                    {q.correctOption}
                  </td>

                  <td className="p-2 text-center">
                    {q.marks}
                  </td>

                  <td className="p-2">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setPreview(q)}
                        className="icon-btn"
                        title="Preview"
                      >
                        <Eye size={16} />
                      </button>

                      <button
                        onClick={() => handleEdit(q)}
                        className="icon-btn"
                        title="Edit"
                      >
                        <Edit2 size={16} />
                      </button>

                      <button
                        onClick={() => handleDelete(q.id)}
                        className="icon-btn text-red-500"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {questions.length === 0 && (
            <p className="p-4 text-center text-muted">
              No questions added yet
            </p>
          )}
        </div>
      </div>

      {/* ADD / EDIT QUESTION */}
      <div className="border-t pt-4 space-y-3">
        <h4 className="font-semibold">
          {editingId ? "Edit Question" : "Add Question"}
        </h4>

        <Input
          placeholder="Question"
          value={form.question}
          onChange={(e) => setForm({ ...form, question: e.target.value })}
        />

        <div className="grid grid-cols-2 gap-3">
          <Input
            placeholder="Option A"
            value={form.optionA}
            onChange={(e) => setForm({ ...form, optionA: e.target.value })}
          />
          <Input
            placeholder="Option B"
            value={form.optionB}
            onChange={(e) => setForm({ ...form, optionB: e.target.value })}
          />
          <Input
            placeholder="Option C"
            value={form.optionC}
            onChange={(e) => setForm({ ...form, optionC: e.target.value })}
          />
          <Input
            placeholder="Option D"
            value={form.optionD}
            onChange={(e) => setForm({ ...form, optionD: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <select
            className="w-full px-4 py-2.5 border rounded-lg bg-surface focus:ring-2 focus:ring-primary"
            value={form.correctOption}
            onChange={(e) =>
              setForm({ ...form, correctOption: e.target.value })
            }
          >
            <option value="A">Correct: A</option>
            <option value="B">Correct: B</option>
            <option value="C">Correct: C</option>
            <option value="D">Correct: D</option>
          </select>

          <Input
            type="number"
            placeholder="Marks"
            value={form.marks}
            onChange={(e) =>
              setForm({ ...form, marks: Number(e.target.value) })
            }
          />
        </div>

        <div className="flex gap-3 pt-2">
          <Button
            variant="secondary"
            onClick={() => {
              setEditingId(null)
              setForm(initialForm)
            }}
          >
            Clear
          </Button>

          <Button onClick={handleSubmit}>
            {editingId ? "Update Question" : "Add Question"}
          </Button>
        </div>
      </div>

      {/* PREVIEW MODAL */}
      <Modal
        isOpen={!!preview}
        onClose={() => setPreview(null)}
        title="Question Preview"
      >
        {preview && (
          <div className="space-y-3 text-sm">
            <p className="font-semibold">{preview.questionText}</p>

            <ul className="space-y-1">
              <li>A. {preview.optionA}</li>
              <li>B. {preview.optionB}</li>
              <li>C. {preview.optionC}</li>
              <li>D. {preview.optionD}</li>
            </ul>

            <p className="text-xs text-muted">
              Correct: <b>{preview.correctOption}</b> • {preview.marks} mark(s)
            </p>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default QuestionManager
