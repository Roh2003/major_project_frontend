import API from "./api";

const CourseService = {
    // ---- Admin Routes ----
    getCourses() {
        return API.get("/admin/courses");
    },
    createCourse(payload = {}) {
        return API.post("/admin/courses", payload);
    },
    updateCourse(courseId, payload = {}) {
        return API.patch(`/admin/courses/${courseId}`, payload);
    },
    // There is no PATCH in backend, only PUT for publishing
    togglePublishCourse(courseId) {
        return API.put(`/admin/courses/${courseId}/publish`);
    },

    getLessonById (courseId) {
        return API.get(`/admin/courses/${courseId}/lessons`);
    },
    addLesson(courseId, payload = {}) {
        return API.post(`/admin/courses/${courseId}/lessons`, payload);
    },
  
    updateLesson(lessonId, payload = {}) {
        return API.put(`/admin/courses/lessons/${lessonId}`, payload);
    },
    deleteLesson(lessonId) {
        return API.delete(`/admin/courses/lessons/${lessonId}`);
    },

    // ---- User Routes ----
    getPublishedCourses() {
        return API.get("/courses");
    },
    getCourseDetail(courseId) {
        return API.get(`/courses/${courseId}`);
    },
    getLessonVideo(lessonId) {
        return API.get(`/lessons/${lessonId}`);
    }
}

export default CourseService;