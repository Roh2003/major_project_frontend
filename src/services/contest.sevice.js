import API from "./api";

const contestService = {
    // ========================================
    // ADMIN ROUTES
    // ========================================
    
    // Get all contests (admin)
    getContests() {
        return API.get("/admin/contest");
    },
    
    // Create contest
    createContest(payload = {}) {
        return API.post("/admin/contest", {
            ...payload,
            durationMinutes: Number(payload.durationMinutes || 0),
            firstRankCredits: Number(payload.firstRankCredits || 0),
            secondRankCredits: Number(payload.secondRankCredits || 0),
            thirdRankCredits: Number(payload.thirdRankCredits || 0),
        });
    },
    
    // Update contest
    updateContest(contestId, payload = {}) {
        return API.put(`/admin/contest/${contestId}`, {
            ...payload,
            durationMinutes: Number(payload.durationMinutes || 0),
            firstRankCredits: Number(payload.firstRankCredits || 0),
            secondRankCredits: Number(payload.secondRankCredits || 0),
            thirdRankCredits: Number(payload.thirdRankCredits || 0),
        });
    },
    
    // Publish/Unpublish contest
    togglePublishContest(contestId) {
        return API.put(`/admin/contest/${contestId}/publish`);
    },
    
    // Get contest by ID (admin)
    getContestById(contestId) {
        return API.get(`/admin/contest/${contestId}`);
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