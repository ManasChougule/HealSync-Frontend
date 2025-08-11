import axios from "axios";
import api from './api';
export default class LoginService {
    login(userData) {
        return api.post('/auth/login', userData);
    }
}
