import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { Send, FileText, Users, Calendar, Upload } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";
import {
  TypographyH2,
  TypographyH3,
  TypographyMuted,
  TypographyH5,
  TypographySmall,
} from "@/components/custom/Typography";
import Icon from "@/components/custom/Icon";

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

  // Handle file upload
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setEmailData((prev) => ({
      ...prev,
      attachments: [...prev.attachments, ...files],
    }));
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
      <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
        <div className="space-y-1">
          <TypographyH2>Compose Email</TypographyH2>
          <TypographyMuted>Create and send professional emails</TypographyMuted>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={() => setShowPreview(true)}>
            <Icon name="Eye" size={20} />
            Preview
          </Button>
          <Button>
            <Icon name="Save" size={20} />
            Save Draft
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Compose Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Template Selection */}
          <Card className="md:p-4">
            <div className="flex items-center justify-between">
              <TypographyH3>Choose Template</TypographyH3>
              <Button variant="link" onClick={() => navigate("/templates")}>
                Manage Templates
              </Button>
            </div>
            <Select
              value={selectedTemplate || undefined}
              onValueChange={(value) => handleTemplateSelect(value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Start from scratch" />
              </SelectTrigger>
              <SelectContent>
                {templates?.map((template) => (
                  <SelectItem
                    key={template.id || template._id}
                    value={template.id || template._id}
                  >
                    {template.title} ({template.category})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Card>

          {/* Email Form */}
          <Card>
            <TypographyH3>Email Details</TypographyH3>
            <div className="space-y-4">
              {/* Recipients */}
              <div className="grid gap-2">
                <Label>
                  To <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="text"
                  value={emailData.recipients}
                  onChange={(e) =>
                    setEmailData({ ...emailData, recipients: e.target.value })
                  }
                  placeholder="recipient@example.com, another@example.com"
                />
              </div>

              {/* CC */}
              <div className="grid gap-2">
                <Label>CC (optional)</Label>
                <Input
                  type="text"
                  value={emailData.cc}
                  onChange={(e) =>
                    setEmailData({ ...emailData, cc: e.target.value })
                  }
                  placeholder="cc@example.com"
                />
              </div>

              {/* Subject */}
              <div className="grid gap-2">
                <Label>
                  Subject <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="text"
                  value={emailData.subject}
                  onChange={(e) =>
                    setEmailData({ ...emailData, subject: e.target.value })
                  }
                  placeholder="Enter email subject"
                  required
                />
              </div>

              {/* Body */}
              <div className="grid gap-2">
                <Label>
                  Message <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  value={emailData.body}
                  onChange={(e) =>
                    setEmailData({ ...emailData, body: e.target.value })
                  }
                  rows={12}
                  placeholder="Write your email content here..."
                  required
                />
              </div>

              {/* Attachments */}
              <div className="grid gap-2">
                <Label>Attachments</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 space-y-3 text-center">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                  <TypographyH5>Upload Documents</TypographyH5>
                  <TypographyMuted>
                    Drag and drop files here or click to browse. Supported
                    formats: PDF, DOC, DOCX
                  </TypographyMuted>
                  <Input
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.jpg,.png"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="bg-primary text-white px-4 py-2 rounded-full hover:bg-primary transition-colors cursor-pointer inline-block"
                  >
                    Choose Files
                  </label>
                </div>
              </div>
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={handleSend}
              disabled={
                !emailData.recipients ||
                !emailData.subject ||
                !emailData.body ||
                isSending
              }
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
            </Button>

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
          <Card>
            <div className="flex items-center space-x-2">
              <Icon name="Wand2" size={20} className="text-purple-600" />
              <TypographyH3>AI Assistant</TypographyH3>
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
              <Link
                to="/subscription"
                className="p-3 cursor-pointer bg-purple-50 border border-purple-200 rounded-lg"
              >
                <p className="text-sm text-purple-800 mb-2">
                  Upgrade to Pro for AI writing assistance
                </p>
                <button
                  onClick={() => navigate("/pricing")}
                  className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                >
                  View Plans →
                </button>
              </Link>
            )}
          </Card>

          {/* Quick Stats */}
          <Card>
            <TypographyH3>Quick Stats</TypographyH3>
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
          </Card>

          {/* Recent Templates */}
          <Card>
            <TypographyH3>Recent Templates</TypographyH3>
            <div className="space-y-2">
              {templates.slice(0, 3).map((template) => (
                <button
                  key={template.id}
                  onClick={() => handleTemplateSelect(template.id)}
                  className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-gray-400" />
                    <TypographySmall className="truncate capitalize">
                      {template.title}
                    </TypographySmall>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {template.category}
                  </div>
                </button>
              ))}
            </div>
          </Card>
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
              <div className="grid gap-2">
                <Label>Date</Label>
                <input
                  type="date"
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label>Time</Label>
                <input
                  type="time"
                  value={scheduleTime}
                  onChange={(e) => setScheduleTime(e.target.value)}
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
