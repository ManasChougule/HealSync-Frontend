import api from "./api";
export default class RegisterService {
    saveUser(userData) {
        return api.post('/auth/registration', userData);
    }
}