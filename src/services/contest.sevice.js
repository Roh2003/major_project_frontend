import API from "./api";

const contestService = {
    // ========================================
    // ADMIN ROUTES
    // ========================================
    
    // Get all contests (admin)
    getContests() {
        return API.get("/admin/contest/admin");
    },
    
    // Create contest
    createContest(payload = {}) {
        return API.post("/admin/contest", payload);
    },
    
    // Update contest
    updateContest(contestId, payload = {}) {
        return API.put(`/admin/contest/${contestId}`, payload);
    },
    
    // Publish/Unpublish contest
    togglePublishContest(contestId) {
        return API.put(`/admin/contest/${contestId}/publish`);
    },
    
    // Get contest by ID (admin)
    getContestById(contestId) {
        return API.get(`/admin/contest/admin/${contestId}`);
    },
    
    // ========================================
    // QUESTION MANAGEMENT
    // ========================================
    
    // Add question to contest
    addContestQuestion(contestId, payload = {}) {
        return API.post(`/admin/contest/${contestId}/questions`, payload);
    },
    
    // ========================================
    // USER ROUTES (if needed in admin dashboard)
    // ========================================
    
    // Get published contests
    getPublishedContests() {
        return API.get("/admin/contest/published");
    },
    
    // Get contest details with questions
    getContestDetails(contestId) {
        return API.get(`/admin/contest/${contestId}/details`);
    }
}

export default contestService