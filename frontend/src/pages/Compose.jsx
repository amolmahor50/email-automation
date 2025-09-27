import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import {
  Send,
  Paperclip,
  FileText,
  Users,
  Calendar,
  Wand2,
  Save,
  Eye,
  CheckCircle2,
} from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Compose = () => {
  const { templates, sendEmail, scheduleEmail, loadTemplates } = useApp();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [emailData, setEmailData] = useState({
    recipients: "",
    cc: "",
    subject: "",
    body: "",
    attachments: [],
  });

  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    loadTemplates();
  }, []);

  // Auto-insert signature
  useEffect(() => {
    if (
      user?.profile?.signature &&
      !emailData.body.includes(user.profile.signature)
    ) {
      setEmailData((prev) => ({
        ...prev,
        body: prev.body
          ? prev.body + "\n\n" + user.profile.signature
          : user.profile?.signature || "",
      }));
    }
  }, [user?.profile?.signature]);

  const handleTemplateSelect = (templateId) => {
    const template = templates.find((t) => t.id === templateId);
    if (template) {
      setEmailData((prev) => ({
        ...prev,
        subject: template.title,
        body:
          template.body +
          (user?.profile?.signature ? "\n\n" + user.profile.signature : ""),
      }));
      setSelectedTemplate(templateId);
    }
  };

  const handleSend = async () => {
    setIsSending(true);
    try {
      await sendEmail({
        recipients: emailData.recipients.split(",").map((r) => r.trim()),
        subject: emailData.subject,
        body: emailData.body,
        templateId: selectedTemplate || undefined,
        attachments: emailData.attachments,
      });

      toast.success("Email sent successfully!");
      navigate("/history");
    } catch (error) {
      toast.error("Failed to send email");
    } finally {
      setIsSending(false);
    }
  };

  const handleSchedule = async () => {
    try {
      const scheduleDateTime = new Date(`${scheduleDate}T${scheduleTime}`);

      await scheduleEmail(
        {
          recipients: emailData.recipients.split(",").map((r) => r.trim()),
          subject: emailData.subject,
          body: emailData.body,
          templateId: selectedTemplate || undefined,
          attachments: emailData.attachments,
        },
        scheduleDateTime
      );

      toast.success("Email scheduled successfully!");
      setShowScheduleModal(false);
      navigate("/history");
    } catch (error) {
      toast.error("Failed to schedule email");
    }
  };

  const aiSuggestions = [
    "Make it more professional",
    "Add a call to action",
    "Improve grammar and tone",
    "Make it shorter and concise",
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Compose Email</h1>
          <p className="text-gray-600">Create and send professional emails</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowPreview(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Eye className="w-4 h-4" />
            <span>Preview</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
            <Save className="w-4 h-4" />
            <span>Save Draft</span>
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Compose Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Template Selection */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900">Choose Template</h2>
              <button
                onClick={() => navigate("/templates")}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                Manage Templates
              </button>
            </div>
            <select
              value={selectedTemplate}
              onChange={(e) => handleTemplateSelect(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Start from scratch</option>
              {templates.map((template) => (
                <option key={template.id} value={template.id}>
                  {template.title} ({template.category})
                </option>
              ))}
            </select>
          </div>

          {/* Email Form */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="font-semibold text-gray-900">Email Details</h2>
            </div>
            <div className="p-6 space-y-4">
              {/* Recipients */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  To <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={emailData.recipients}
                    onChange={(e) =>
                      setEmailData({ ...emailData, recipients: e.target.value })
                    }
                    placeholder="recipient@example.com, another@example.com"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              {/* CC */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CC (optional)
                </label>
                <input
                  type="text"
                  value={emailData.cc}
                  onChange={(e) =>
                    setEmailData({ ...emailData, cc: e.target.value })
                  }
                  placeholder="cc@example.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={emailData.subject}
                  onChange={(e) =>
                    setEmailData({ ...emailData, subject: e.target.value })
                  }
                  placeholder="Enter email subject"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Body */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={emailData.body}
                  onChange={(e) =>
                    setEmailData({ ...emailData, body: e.target.value })
                  }
                  rows={12}
                  placeholder="Write your email content here..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Attachments */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Attachments
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                  <Paperclip className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-2">
                    Drop files here or click to browse
                  </p>
                  <button className="text-sm text-blue-600 hover:text-blue-700">
                    Select Files
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleSend}
              disabled={
                !emailData.recipients ||
                !emailData.subject ||
                !emailData.body ||
                isSending
              }
              className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
            >
              {isSending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Send Email</span>
                </>
              )}
            </button>

            {user?.subscription.plan !== "free" && (
              <button
                onClick={() => setShowScheduleModal(true)}
                className="flex-1 bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center space-x-2"
              >
                <Calendar className="w-4 h-4" />
                <span>Schedule Send</span>
              </button>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* AI Writing Assistant */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Wand2 className="w-5 h-5 text-purple-600" />
              <h3 className="font-semibold text-gray-900">AI Assistant</h3>
              {user?.subscription.plan === "free" && (
                <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                  Pro
                </span>
              )}
            </div>

            <div className="space-y-2">
              {aiSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm transition-colors"
                  disabled={user?.subscription.plan === "free"}
                >
                  {suggestion}
                </button>
              ))}
            </div>

            {user?.subscription.plan === "free" && (
              <div className="mt-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                <p className="text-sm text-purple-800 mb-2">
                  Upgrade to Pro for AI writing assistance
                </p>
                <button
                  onClick={() => navigate("/pricing")}
                  className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                >
                  View Plans →
                </button>
              </div>
            )}
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Quick Stats</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Word count</span>
                <span className="text-sm font-medium">
                  {emailData.body.split(" ").length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Characters</span>
                <span className="text-sm font-medium">
                  {emailData.body.length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  Estimated read time
                </span>
                <span className="text-sm font-medium">
                  {Math.max(
                    1,
                    Math.ceil(emailData.body.split(" ").length / 200)
                  )}{" "}
                  min
                </span>
              </div>
            </div>
          </div>

          {/* Recent Templates */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">
              Recent Templates
            </h3>
            <div className="space-y-2">
              {templates.slice(0, 3).map((template) => (
                <button
                  key={template.id}
                  onClick={() => handleTemplateSelect(template.id)}
                  className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium truncate">
                      {template.title}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {template.category}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Schedule Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                Schedule Email
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time
                </label>
                <input
                  type="time"
                  value={scheduleTime}
                  onChange={(e) => setScheduleTime(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowScheduleModal(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSchedule}
                disabled={!scheduleDate || !scheduleTime}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Schedule Email
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                Email Preview
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-4 mb-6">
                <div>
                  <strong>To:</strong> {emailData.recipients || "No recipients"}
                </div>
                {emailData.cc && (
                  <div>
                    <strong>CC:</strong> {emailData.cc}
                  </div>
                )}
                <div>
                  <strong>Subject:</strong> {emailData.subject || "No subject"}
                </div>
              </div>

              <div className="border rounded-lg p-4 bg-gray-50">
                <pre className="whitespace-pre-wrap text-sm text-gray-800 font-sans">
                  {emailData.body || "No content"}
                </pre>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setShowPreview(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Compose;
