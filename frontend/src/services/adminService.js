import api from "./api";

export const adminService = {
  async getDashboardStats() {
    const response = await api.get("/admin/dashboard");
    return response.data.stats;
  },

  async getUsers(filters = {}) {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value.toString());
    });

    const response = await api.get(`/admin/users?${params}`);
    return response.data;
  },

  async getUser(id) {
    const response = await api.get(`/admin/users/${id}`);
    return response.data.user;
  },

  async updateUser(id, data) {
    const response = await api.put(`/admin/users/${id}`, data);
    return response.data.user;
  },

  async deleteUser(id) {
    const response = await api.delete(`/admin/users/${id}`);
    return response.data;
  },

  async suspendUser(id) {
    const response = await api.post(`/admin/users/${id}/suspend`);
    return response.data;
  },

  async activateUser(id) {
    const response = await api.post(`/admin/users/${id}/activate`);
    return response.data;
  },

  async getRevenueAnalytics(dateRange) {
    const params = new URLSearchParams();
    if (dateRange?.startDate) params.append("startDate", dateRange.startDate);
    if (dateRange?.endDate) params.append("endDate", dateRange.endDate);

    const response = await api.get(`/admin/revenue?${params}`);
    return response.data.analytics;
  },

  async getEmailAnalytics(dateRange) {
    const params = new URLSearchParams();
    if (dateRange?.startDate) params.append("startDate", dateRange.startDate);
    if (dateRange?.endDate) params.append("endDate", dateRange.endDate);

    const response = await api.get(`/admin/emails?${params}`);
    return response.data.analytics;
  },

  async createGlobalTemplate(data) {
    const response = await api.post("/admin/templates", data);
    return response.data.template;
  },

  async updateGlobalTemplate(id, data) {
    const response = await api.put(`/admin/templates/${id}`, data);
    return response.data.template;
  },

  async deleteGlobalTemplate(id) {
    const response = await api.delete(`/admin/templates/${id}`);
    return response.data;
  },

  async getSystemSettings() {
    const response = await api.get("/admin/settings");
    return response.data.settings;
  },

  async updateSystemSettings(settings) {
    const response = await api.put("/admin/settings", settings);
    return response.data.settings;
  },

  async getSystemLogs(filters = {}) {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value.toString());
    });

    const response = await api.get(`/admin/logs?${params}`);
    return response.data;
  },
};
