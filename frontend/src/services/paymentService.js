import api from "./api";

export const paymentService = {
  async createCheckoutSession(data) {
    const response = await api.post("/payments/create-session", data);
    return response.data;
  },

  async getPaymentHistory(filters = {}) {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value.toString());
    });

    const response = await api.get(`/payments/history?${params}`);
    return response.data;
  },

  async getPayment(id) {
    const response = await api.get(`/payments/${id}`);
    return response.data.payment;
  },

  async downloadInvoice(id) {
    const response = await api.get(`/payments/${id}/invoice`, {
      responseType: "blob",
    });

    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `invoice-${id}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },

  async cancelSubscription() {
    const response = await api.post("/payments/cancel-subscription");
    return response.data;
  },

  async updateSubscription(data) {
    const response = await api.put("/payments/update-subscription", data);
    return response.data;
  },
};
