import React, { createContext, useContext, useState } from "react";
import { templateService } from "@/services/templateService";
import { emailService } from "@/services/emailService";

const AppContext = createContext(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within an AppProvider");
  return context;
};

export const AppProvider = ({ children }) => {
  const [templates, setTemplates] = useState([]);
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadTemplates = async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await templateService.getTemplates(filters);
      setTemplates(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load templates");
    } finally {
      setLoading(false);
    }
  };

  const addTemplate = async (formData) => {
    try {
      const newTemplate = await templateService.createTemplate(formData);
      setTemplates((prev) => [...prev, newTemplate]);
      return newTemplate;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create template");
      throw err;
    }
  };

  const updateTemplate = async (id, formData) => {
    try {
      const updated = await templateService.updateTemplate(id, formData);
      setTemplates((prev) =>
        prev.map((t) => (t._id === id || t.id === id ? updated : t))
      );
      return updated;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update template");
      throw err;
    }
  };

  const deleteTemplate = async (id) => {
    try {
      await templateService.deleteTemplate(id);
      setTemplates((prev) => prev.filter((t) => t._id !== id && t.id !== id));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete template");
      throw err;
    }
  };

  // Emails
  const loadEmails = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await emailService.getEmails();
      setEmails(response.emails);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load emails");
    } finally {
      setLoading(false);
    }
  };

  const sendEmail = async (emailData) => {
    try {
      await emailService.sendEmail(emailData);
      await loadEmails();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send email");
      throw err;
    }
  };

  const scheduleEmail = async (emailData, scheduleDate) => {
    try {
      await emailService.scheduleEmail({
        ...emailData,
        scheduledAt: scheduleDate.toISOString(),
      });
      await loadEmails();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to schedule email");
      throw err;
    }
  };

  return (
    <AppContext.Provider
      value={{
        templates,
        emails,
        loading,
        setLoading,
        error,
        loadTemplates,
        addTemplate,
        updateTemplate,
        deleteTemplate,
        loadEmails,
        sendEmail,
        scheduleEmail,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
