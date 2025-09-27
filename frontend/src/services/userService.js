import api from "./api";

export const userService = {
  async getProfile() {
    const response = await api.get("/user/profile");
    return response.data.user;
  },

  async updateProfile(data) {
    const response = await api.put("/user/profile", data);
    return response.data.user;
  },

  async uploadDocuments(files) {
    const formData = new FormData();
    Array.from(files).forEach((file) => {
      formData.append("documents", file);
    });

    const response = await api.post("/user/documents", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.documents;
  },

  async getDocuments() {
    const response = await api.get("/user/documents");
    return response.data.documents;
  },

  async deleteDocument(documentId) {
    const response = await api.delete(`/user/documents/${documentId}`);
    return response.data;
  },

  async getStats() {
    const response = await api.get("/user/stats");
    return response.data.stats;
  },

  async updateNotificationPreferences(preferences) {
    const response = await api.put("/user/notifications", { preferences });
    return response.data;
  },

  async deactivateAccount(password) {
    const response = await api.post("/user/deactivate", { password });
    return response.data;
  },
};
