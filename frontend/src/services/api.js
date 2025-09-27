import axios from "axios";
import { AuthLocalStorage, AuthSteps } from "@/app/enum";

// Create axios instance with base configuration
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

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle unauthorized
    if (error.response?.status === 401) {
      localStorage.removeItem(AuthLocalStorage.TOKEN);
      localStorage.removeItem(AuthLocalStorage.USER_REGISTER);
      window.location.href = AuthSteps.LOGIN;
    }

    // Handle rate limiting (429)
    if (error.response?.status === 429 && !originalRequest._retry) {
      originalRequest._retry = true;

      // get "Retry-After" header if backend sends it
      const retryAfter = error.response.headers["retry-after"];
      const delay = retryAfter ? parseInt(retryAfter, 10) * 1000 : 3000; // fallback 3s

      console.warn(`429 Too Many Requests – retrying after ${delay / 1000}s`);

      await new Promise((resolve) => setTimeout(resolve, delay));
      return api(originalRequest);
    }

    return Promise.reject(error);
  }
);

export default api;
