import api from "./api";

export const templateService = {
  async getTemplates(filters = {}) {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value.toString());
    });

    const response = await api.get(`/templates?${params}`);
    return response.data;
  },

  async getTemplate(id) {
    const response = await api.get(`/templates/${id}`);
    return response.data.template;
  },

  async createTemplate(data) {
    const response = await api.post("/templates", data);
    return response.data.template;
  },

  async updateTemplate(id, data) {
    const response = await api.put(`/templates/${id}`, data);
    return response.data.template;
  },

  async deleteTemplate(id) {
    const response = await api.delete(`/templates/${id}`);
    return response.data;
  },

  async getPopularTemplates(limit = 10) {
    const response = await api.get(`/templates/popular?limit=${limit}`);
    return response.data.templates;
  },

  async searchTemplates(query, options = {}) {
    const params = new URLSearchParams({ q: query });
    if (options.category) params.append("category", options.category);
    if (options.limit) params.append("limit", options.limit.toString());

    const response = await api.get(`/templates/search?${params}`);
    return response.data.templates;
  },

  async useTemplate(id) {
    const response = await api.post(`/templates/${id}/use`);
    return response.data.template;
  },
};
