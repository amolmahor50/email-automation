import { API } from "@/app/customAxios";

// ================== Auth API Functions ==================

// Register
export const register = async (userData) => {
  const res = await API.post("/auth/register", userData);
  if (res.data.token) {
    localStorage.setItem("token", res.data.token);
  }
  return res.data;
};

// Login
export const login = async (credentials) => {
  const res = await API.post("/auth/login", credentials);
  if (res.data.token) {
    localStorage.setItem("token", res.data.token);
  }
  return res.data;
};

// Logout
export const logout = () => {
  localStorage.removeItem("token");
  return { success: true, message: "Logged out successfully" };
};

// Get current user
export const getMe = async () => {
  const res = await API.get("/auth/me");
  return res.data;
};

// Verify email
export const verifyEmail = async (token) => {
  const res = await API.post("/auth/verify-email", { token });
  return res.data;
};

// Forgot password
export const forgotPassword = async (email) => {
  const res = await API.post("/auth/forgot-password", { email });
  return res.data;
};

// Reset password
export const resetPassword = async (token, password) => {
  const res = await API.post("/auth/reset-password", { token, password });
  return res.data;
};

// Change password
export const changePassword = async (currentPassword, newPassword) => {
  const res = await API.post("/auth/change-password", {
    currentPassword,
    newPassword,
  });
  return res.data;
};
