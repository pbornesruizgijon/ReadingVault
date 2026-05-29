import axios from "axios";

// 1. Solo la URL base (asegúrate de que en Railway sea: https://...)
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

// 2. Construimos la ruta de forma limpia
const API_URL = `${BASE_URL.replace(/\/$/, "")}/api/auth`;

axios.interceptors.request.use(/* ... tu código igual ... */);

const register = (userData) => {
    return axios.post(`${API_URL}/registro`, userData);
};

const login = (email, password) => {
    return axios.post(`${API_URL}/login`, {
        email,
        password
    });
};

export default {
    register,
    login
};