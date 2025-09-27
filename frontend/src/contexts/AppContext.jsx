import React, { createContext, useContext, useState } from "react";
import { templateService } from "@/services/templateService";
import { emailService } from "@/services/emailService";

const AppContext = createContext(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [templates, setTemplates] = useState([
    {
      id: "1",
      title: "Job Application",
      body: `Dear Hiring Manager,

I am writing to express my interest in the [Position Title] position at [Company Name]. With my background in [Your Field], I believe I would be a valuable addition to your team.

I have attached my resume for your review. I would welcome the opportunity to discuss how my skills and experience align with your needs.

Thank you for your time and consideration.`,
      defaultAttachments: ["resume.pdf"],
      visibility: "global",
      category: "Career",
      createdAt: "2024-01-01T10:00:00Z",
    },
    {
      id: "2",
      title: "Business Proposal",
      body: `Dear [Client Name],

I hope this email finds you well. I am writing to present a business proposal that I believe could be mutually beneficial for both our organizations.

After researching your company and understanding your needs, I have developed a comprehensive solution that addresses your key challenges while providing significant value.

I would appreciate the opportunity to discuss this proposal in detail at your convenience.

Best regards,`,
      defaultAttachments: ["proposal.pdf"],
      visibility: "global",
      category: "Business",
      createdAt: "2024-01-02T10:00:00Z",
    },
    {
      id: "3",
      title: "Follow-up Meeting",
      body: `Dear [Name],

Thank you for taking the time to meet with me yesterday. I wanted to follow up on our discussion and provide you with the additional information you requested.

As discussed, I've attached the relevant documents and would be happy to schedule another meeting to continue our conversation.

Please let me know your availability for next week.`,
      defaultAttachments: [],
      visibility: "global",
      category: "Professional",
      createdAt: "2024-01-03T10:00:00Z",
    },
  ]);
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadTemplates = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await templateService.getTemplates();
      setTemplates(response.templates);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load templates");
    } finally {
      setLoading(false);
    }
  };

  const addTemplate = async (templateData) => {
    try {
      const newTemplate = await templateService.createTemplate(templateData);
      setTemplates((prev) => [...prev, newTemplate]);
      return newTemplate;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create template");
      throw err;
    }
  };

  const updateTemplate = async (id, updates) => {
    try {
      const updatedTemplate = await templateService.updateTemplate(id, updates);
      setTemplates((prev) =>
        prev.map((template) =>
          template._id === id ? updatedTemplate : template
        )
      );
      return updatedTemplate;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update template");
      throw err;
    }
  };

  const deleteTemplate = async (id) => {
    try {
      await templateService.deleteTemplate(id);
      setTemplates((prev) => prev.filter((template) => template.id !== id));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete template");
      throw err;
    }
  };

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
      // Reload emails to get the updated list
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
      // Reload emails to get the updated list
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
