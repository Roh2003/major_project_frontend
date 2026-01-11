import API from "./api";

const UserService = {
  AddUser(payload = {}) {
    console.log([{payload: payload, type: typeof payload}]);
    return API.post("/api/user/auth/register", payload);
  },
  EditUser(payload = {}) {
    console.log(payload instanceof FormData);
    console.log([{payload: payload, type: typeof payload}]);
    return API.patch(`/api/auth/user/${payload.id}`, payload.data);
  },
  GetUserById(id) { 
    return API.get(`/api/auth/user/${id}`);
  },
  loginUser(payload = {}) {
    return API.post("/api/user/auth/login", payload);
  },
  deleteUser(id) {
    return API.delete(`/api/auth/user/${id}`);
  } 
};

export default UserService;
