import API from "./api";

const resourceService = {
  // Get all resources with optional filters
  getAllResources(params = {}) {
    return API.get("/resource", { params });
  },

  // Get resource statistics
  getResourceStats() {
    return API.get("/resource/stats");
  },

  // Get a single resource by ID
  getResourceById(id) {
    return API.get(`/resource/${id}`);
  },

  // Create a new resource
  createResource(payload = {}) {
    return API.post("/resource", payload);
  },

  // Update a resource
  updateResource(id, payload = {}) {
    return API.patch(`/resource/${id}`, payload);
  },

  // Delete a resource
  deleteResource(id) {
    return API.delete(`/resource/${id}`);
  },

  // Increment download count
  incrementDownload(id) {
    return API.post(`/resource/${id}/download`);
  },
};

export default resourceService;
