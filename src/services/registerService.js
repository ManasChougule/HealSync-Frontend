import axios from "axios"

export default class RegisterService {
    saveUser(userData) {
        return axios.post("http://localhost:8080/registration/registration", userData, {
            headers: {
                "Content-Type": "application/json",
            }
        });
    }
}