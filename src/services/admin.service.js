import API from "./api";

const AdminService = {
    adminLogin(payload = {}) {
        return API.post("/user/auth/admin/login", payload);
    }
}

export default AdminService