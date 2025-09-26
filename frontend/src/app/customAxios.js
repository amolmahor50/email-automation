// src/api/auth.js
import axios from "axios";

// Create a custom axios instance
export const API = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor to attach token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
