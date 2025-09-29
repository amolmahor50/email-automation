import { AuthSteps, AuthLocalStorage } from "@/app/enum";
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL || "http://localhost:5000/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(AuthLocalStorage.TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(AuthLocalStorage.TOKEN);
      localStorage.removeItem(AuthLocalStorage.USER_REGISTER);
      window.location.href = AuthSteps.LOGIN;
    }
    return Promise.reject(error);
  }
);

export default api;
