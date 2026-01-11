import API from "./api";

const contestService = {
    // ---- Admin Routes ----
    getContests() {
        return API.get("/admin/contest");
    },
    createContest(payload = {}) {
        return API.post("/admin/contest", payload);
    },
    updateContest(contestId, payload = {}) {
        // Assuming editing contest not enabled in backend yet
        return API.put(`/admin/contest/${contestId}`, payload);
    },
    togglePublishContest(contestId) {
        return API.put(`/admin/contest/${contestId}/publish`);
    },

    getContestById(contestId) {
        return API.get(`/admin/contest/${contestId}`);
    },

    addContestQuestion(contestId, payload = {}) {
        return API.post(`/admin/contest/${contestId}/questions`, payload);
    }
}

export default contestService