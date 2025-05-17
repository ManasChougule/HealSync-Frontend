import axios from "axios";

export default class LoginService {
    login(userData) {
        return axios.get("http://localhost:8080/registration/getUserId", {
            params: {
                email: userData.email,
                password: userData.password,
                role: userData.role,
            },
            headers: {
                "Content-Type": "application/json",
            }
        });
    }
}
