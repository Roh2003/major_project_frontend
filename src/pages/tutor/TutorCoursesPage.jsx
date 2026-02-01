"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { BookOpen, Plus, Edit, Trash2, Eye, Clock, CheckCircle } from "lucide-react"
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"
import Button from "../../components/common/Button"
import CourseService from "../../services/course.service"

console.log("[TutorCoursesPage] Component is being rendered!")

const TutorCoursesPage = () => {
    console.log("[TutorCoursesPage] Component function called")
    const navigate = useNavigate()
    const [courses, setCourses] = useState([])
    const [loading, setLoading] = useState(true)
    const tutorUser = JSON.parse(localStorage.getItem("tutorUser") || "{}")

    useEffect(() => {
        fetchCourses()
        console.log("yes course page is loading")
    }, [])

    const fetchCourses = async () => {
        try {
            console.log("[TutorCoursesPage] Fetching courses...")
            console.log("[TutorCoursesPage] Tutor user:", tutorUser)
            
            const response = await CourseService.getCourses()
            console.log("[TutorCoursesPage] API response:", response)

            // Filter courses created by this tutor
            const allCourses = response.data.data || []
            console.log("[TutorCoursesPage] All courses:", allCourses)
            
            const tutorCourses = allCourses.filter(
                course => course.tutorId === tutorUser.id
            )
            console.log("[TutorCoursesPage] Tutor courses:", tutorCourses)
            
            setCourses(tutorCourses)
        } catch (error) {
            console.error("[TutorCoursesPage] Error fetching courses:", error)
            toast.error("Failed to load courses")
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (courseId) => {
        if (!window.confirm("Are you sure you want to delete this course?")) return

        try {
            const token = localStorage.getItem("tutorToken")
            await CourseService.deleteCourse(token, courseId)
            toast.success("Course deleted successfully")
            fetchCourses()
        } catch (error) {
            console.error("Error deleting course:", error)
            toast.error("Failed to delete course")
        }
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-text-primary mb-2">My Courses</h1>
                    <p className="text-text-secondary">Manage your uploaded courses</p>
                </div>

                <Button
                    variant="primary"
                    icon={Plus}
                    onClick={() => navigate("/tutor/dashboard/courses/add")}
                >
                    Add New Course
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-br from-secondary/10 to-secondary/5 border border-secondary/20 rounded-xl p-6"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-secondary/20 rounded-lg flex items-center justify-center">
                            <BookOpen className="w-6 h-6 text-secondary" />
                        </div>
                        <div>
                            <p className="text-sm text-text-muted">Total Courses</p>
                            <p className="text-2xl font-bold text-text-primary">{courses.length}</p>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-gradient-to-br from-success/10 to-success/5 border border-success/20 rounded-xl p-6"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-success/20 rounded-lg flex items-center justify-center">
                            <CheckCircle className="w-6 h-6 text-success" />
                        </div>
                        <div>
                            <p className="text-sm text-text-muted">Published</p>
                            <p className="text-2xl font-bold text-text-primary">
                                {courses.filter(c => c.isPublished).length}
                            </p>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-gradient-to-br from-warning/10 to-warning/5 border border-warning/20 rounded-xl p-6"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-warning/20 rounded-lg flex items-center justify-center">
                            <Clock className="w-6 h-6 text-warning" />
                        </div>
                        <div>
                            <p className="text-sm text-text-muted">Pending Approval</p>
                            <p className="text-2xl font-bold text-text-primary">
                                {courses.filter(c => !c.isPublished).length}
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Courses Table/List */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white border border-border rounded-xl shadow-sm overflow-hidden"
            >
                {loading ? (
                    <div className="p-12 text-center">
                        <div className="animate-spin w-8 h-8 border-4 border-secondary border-t-transparent rounded-full mx-auto mb-4" />
                        <p className="text-text-muted">Loading courses...</p>
                    </div>
                ) : courses.length === 0 ? (
                    <div className="p-12 text-center">
                        <BookOpen className="w-16 h-16 text-text-muted mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-text-primary mb-2">No courses yet</h3>
                        <p className="text-text-muted mb-6">Start by creating your first course!</p>
                        <Button
                            variant="primary"
                            icon={Plus}
                            onClick={() => navigate("/tutor/dashboard/courses/add")}
                        >
                            Create Course
                        </Button>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-surface">
                                <tr>
                                    <th className="text-left py-4 px-6 text-sm font-semibold text-text-secondary">Course</th>
                                    <th className="text-left py-4 px-6 text-sm font-semibold text-text-secondary">Price</th>
                                    <th className="text-left py-4 px-6 text-sm font-semibold text-text-secondary">Level</th>
                                    <th className="text-left py-4 px-6 text-sm font-semibold text-text-secondary">Status</th>
                                    <th className="text-left py-4 px-6 text-sm font-semibold text-text-secondary">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {courses.map((course) => (
                                    <tr key={course.id} className="border-t border-border hover:bg-surface/50 transition-colors">
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 bg-gradient-to-br from-secondary to-secondary-dark rounded-lg flex items-center justify-center flex-shrink-0">
                                                    <BookOpen className="w-6 h-6 text-white" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-text-primary">{course.title}</p>
                                                    <p className="text-sm text-text-muted">{course.category}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className="font-semibold text-text-primary">${course.price}</span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className="px-3 py-1 bg-secondary/10 text-secondary rounded-full text-xs font-medium">
                                                {course.level}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6">
                                            {course.isPublished ? (
                                                <span className="inline-flex items-center gap-1 px-3 py-1 bg-success/10 text-success rounded-full text-xs font-medium">
                                                    <CheckCircle className="w-3 h-3" />
                                                    Published
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 px-3 py-1 bg-warning/10 text-warning rounded-full text-xs font-medium">
                                                    <Clock className="w-3 h-3" />
                                                    Pending Review
                                                </span>
                                            )}
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => navigate(`/tutor/dashboard/courses/edit/${course.id}`)}
                                                    className="p-2 text-secondary hover:bg-secondary/10 rounded-lg transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => navigate(`/tutor/dashboard/courses/${course.id}/lessons`)}
                                                    className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                                                    title="Manage Lessons"
                                                >
                                                    <BookOpen className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(course.id)}
                                                    className="p-2 text-error hover:bg-error/10 rounded-lg transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </motion.div>

            {/* Info Note */}
            <div className="bg-info/10 border border-info/20 rounded-xl p-4">
                <p className="text-sm text-info">
                    <strong>Note:</strong> After uploading a course, it will be reviewed by our admin team before being published to students.
                </p>
            </div>
        </div>
    )
}

export default TutorCoursesPage
