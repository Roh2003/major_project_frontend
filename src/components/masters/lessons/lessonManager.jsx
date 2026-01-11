import { useEffect, useState } from "react"
import Button from "../../common/Button"
import Input from "../../common/Input"
import { toast } from "react-toastify"
import CourseService from "../../../services/course.service"

const LessonManager = ({ courseId }) => {
  const [lessons, setLessons] = useState([])
  const [activeLessonId, setActiveLessonId] = useState(null)
  const [editingLessonId, setEditingLessonId] = useState(null)
  const [editForm, setEditForm] = useState({})

  const [form, setForm] = useState({
    title: "",
    videoUrl: "",
    duration: "",
    isFreePreview: false,
  })

  useEffect(() => {
    if (courseId) loadLessons()
  }, [courseId])

  const loadLessons = async () => {
    try {
      const res = await CourseService.getLessonById(courseId)
      setLessons(res.data.data || [])
    } catch {
      toast.error("Failed to load lessons")
    }
  }

  const extractVideoId = (url) => {
    const match = url.match(/(?:v=|youtu\.be\/)([^&]+)/)
    return match ? match[1] : null
  }

  const handleAddLesson = async () => {
    const videoId = extractVideoId(form.videoUrl)

    if (!form.title || !videoId || !form.duration) {
      toast.error("All fields required")
      return
    }

    try {
      await CourseService.addLesson(courseId, {
        title: form.title,
        duration: Number(form.duration),
        videoId,
        isFreePreview: form.isFreePreview,
      })

      toast.success("Lesson added")
      setForm({
        title: "",
        videoUrl: "",
        duration: "",
        isFreePreview: false,
      })
      loadLessons()
    } catch {
      toast.error("Failed to add lesson")
    }
  }

  const handleEditClick = (lesson) => {
    setEditingLessonId(lesson.id)
    setEditForm({
      title: lesson.title,
      videoId: lesson.videoId,
      duration: lesson.duration,
      isFreePreview: lesson.isFreePreview,
    })
  }

  const handleUpdateLesson = async (lessonId) => {
    if (!editForm.title || !editForm.videoId || !editForm.duration) {
      toast.error("All fields required")
      return
    }

    try {
      await CourseService.updateLesson(lessonId, {
        title: editForm.title,
        videoId: editForm.videoId,
        duration: Number(editForm.duration),
        isFreePreview: editForm.isFreePreview,
      })

      toast.success("Lesson updated successfully")
      setEditingLessonId(null)
      setEditForm({})
      loadLessons()
    } catch {
      toast.error("Failed to update lesson")
    }
  }

  const handleDeleteLesson = async (lessonId) => {
    if (!window.confirm("Are you sure you want to delete this lesson?")) {
      return
    }

    try {
      await CourseService.deleteLesson(lessonId)
      toast.success("Lesson deleted successfully")
      loadLessons()
    } catch {
      toast.error("Failed to delete lesson")
    }
  }

  return (
    <div className="space-y-5">

      {/* LESSON LIST */}
      <div className="space-y-2 max-h-[420px] overflow-y-auto pr-2">
        {lessons.length === 0 && (
          <p className="text-sm text-muted">No lessons added yet</p>
        )}

        {lessons.map((lesson, index) => (
          <div
            key={lesson.id}
            className="border border-border rounded-lg bg-surface"
          >
            {/* Lesson Row */}
            <div className="flex items-center justify-between p-3">
              <div className="flex items-center gap-3 flex-1">
                <span className="w-7 h-7 flex items-center justify-center rounded-full bg-primary text-white text-sm">
                  {index + 1}
                </span>

                {editingLessonId === lesson.id ? (
                  /* Edit Mode */
                  <div className="flex-1 space-y-2">
                    <Input
                      placeholder="Lesson title"
                      value={editForm.title}
                      onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    />
                    <Input
                      placeholder="Video ID"
                      value={editForm.videoId}
                      onChange={(e) => setEditForm({ ...editForm, videoId: e.target.value })}
                    />
                    <Input
                      placeholder="Duration (minutes)"
                      value={editForm.duration}
                      onChange={(e) => setEditForm({ ...editForm, duration: e.target.value })}
                    />
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={editForm.isFreePreview}
                        onChange={(e) => setEditForm({ ...editForm, isFreePreview: e.target.checked })}
                      />
                      Free preview
                    </label>
                  </div>
                ) : (
                  /* View Mode */
                  <div>
                    <p className="font-medium">{lesson.title}</p>
                    <p className="text-xs text-muted">
                      {lesson.duration} min
                      {lesson.isFreePreview && " • Free Preview"}
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                {editingLessonId === lesson.id ? (
                  <>
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => handleUpdateLesson(lesson.id)}
                    >
                      Save
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => {
                        setEditingLessonId(null)
                        setEditForm({})
                      }}
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() =>
                        setActiveLessonId(
                          activeLessonId === lesson.id ? null : lesson.id
                        )
                      }
                    >
                      {activeLessonId === lesson.id ? "Hide" : "Preview"}
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleEditClick(lesson)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleDeleteLesson(lesson.id)}
                    >
                      Delete
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Video Preview (Only one at a time) */}
            {activeLessonId === lesson.id && editingLessonId !== lesson.id && (
              <div className="p-3 border-t bg-black rounded-b-lg">
                <iframe
                  width="100%"
                  height="180"
                  src={`https://www.youtube.com/embed/${lesson.videoId}`}
                  title={lesson.title}
                  loading="lazy"
                  frameBorder="0"
                  allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ADD LESSON */}
      <div className="border-t pt-4 space-y-3">
        <h4 className="font-semibold">Add New Lesson</h4>

        <Input
          placeholder="Lesson title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />

        <Input
          placeholder="YouTube video URL"
          value={form.videoUrl}
          onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
        />

        <Input
          placeholder="Duration (minutes)"
          value={form.duration}
          onChange={(e) => setForm({ ...form, duration: e.target.value })}
        />

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.isFreePreview}
            onChange={(e) =>
              setForm({ ...form, isFreePreview: e.target.checked })
            }
          />
          Free preview
        </label>

        <Button onClick={handleAddLesson}>Add Lesson</Button>
      </div>
    </div>
  )
}

export default LessonManager
