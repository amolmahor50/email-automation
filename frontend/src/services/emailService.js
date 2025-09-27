import api from "./api";

export const emailService = {
  async sendEmail(data) {
    const response = await api.post("/emails/send", data);
    return response.data;
  },

  async scheduleEmail(data) {
    const response = await api.post("/emails/schedule", data);
    return response.data;
  },

  async sendBulkEmail(data) {
    const response = await api.post("/emails/bulk", data);
    return response.data;
  },

  async getEmails(filters = {}) {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value.toString());
    });

    const response = await api.get(`/emails?${params}`);
    return response.data;
  },

  async getEmail(id) {
    const response = await api.get(`/emails/${id}`);
    return response.data.email;
  },

  async getEmailAnalytics(dateRange) {
    const params = new URLSearchParams();
    if (dateRange?.startDate) params.append("startDate", dateRange.startDate);
    if (dateRange?.endDate) params.append("endDate", dateRange.endDate);

    const response = await api.get(`/emails/analytics?${params}`);
    return response.data.analytics;
  },

  async cancelScheduledEmail(id) {
    const response = await api.post(`/emails/${id}/cancel`);
    return response.data;
  },

  async resendEmail(id) {
    const response = await api.post(`/emails/${id}/resend`);
    return response.data;
  },
};
