import API from "./api";

const counselorService = {

    createCounselor(payload ={}) {
        return API.post('/admin/counselor' , payload)
    },
    getAllCounselor() {
        return API.get('/admin/counselor' )
    }

}

export default counselorService