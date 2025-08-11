import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach token automatically to every request
api.interceptors.request.use((config) => {
    const isLoginRequest = config.url.endsWith("/auth/login");
    if (!isLoginRequest) {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.token) {
            config.headers.Authorization = `Bearer ${user.token}`;
        }
    }
  return config;
}, (error) => Promise.reject(error));

export default api;
