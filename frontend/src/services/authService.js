import { AuthLocalStorage } from "@/app/enum";
import api from "./api";

export const authService = {
  async login(data) {
    const response = await api.post("/auth/login", data);
    const { token, user } = response.data;
    localStorage.setItem(AuthLocalStorage.TOKEN, token);
    localStorage.setItem(AuthLocalStorage.USER_REGISTER, JSON.stringify(user));
    return { token, user };
  },

  async signup(data) {
    const response = await api.post("/auth/register", data);
    const { token, user } = response.data;
    localStorage.setItem(AuthLocalStorage.TOKEN, token);
    localStorage.setItem(AuthLocalStorage.USER_REGISTER, JSON.stringify(user));
    return { token, user };
  },

  async getMe() {
    const response = await api.get("/auth/me");
    return response.data.user;
  },

  async logout() {
    await api.post("/auth/logout");
    localStorage.removeItem(AuthLocalStorage.TOKEN);
    localStorage.removeItem(AuthLocalStorage.USER_REGISTER);
  },

  async forgotPassword(email) {
    const response = await api.post("/auth/forgot-password", { email });
    return response.data;
  },

  async resetPassword(token, password) {
    const response = await api.post("/auth/reset-password", {
      token,
      password,
    });
    return response.data;
  },

  async changePassword(currentPassword, newPassword) {
    const response = await api.post("/auth/change-password", {
      currentPassword,
      newPassword,
    });
    return response.data;
  },

  async verifyEmail(token) {
    const response = await api.post("/auth/verify-email", { token });
    return response.data;
  },
};
