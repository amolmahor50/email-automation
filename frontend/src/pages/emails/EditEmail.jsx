import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Send, FileText, Calendar, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  TypographyH2,
  TypographyH3,
  TypographyMuted,
  TypographyH5,
} from "@/components/custom/Typography";
import Icon from "@/components/custom/Icon";
import { emailService } from "@/services/emailService";

const EditEmail = () => {
  const { id } = useParams();
  const [emailData, setEmailData] = useState({
    recipients: "",
    cc: "",
    subject: "",
    body: "",
    attachments: [],
    scheduleDate: "",
    bulkRecipients: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const aiSuggestions = [
    "Make it more professional",
    "Add a call to action",
    "Improve grammar and tone",
    "Make it shorter and concise",
  ];

  // Fetch email by id
  useEffect(() => {
    const fetchEmail = async () => {
      try {
        const response = await emailService.getEmail(id);
        setEmailData({
          recipients:
            response?.recipients?.map((r) => r.email).join(", ") || "",
          cc: response?.cc?.map((r) => r.email).join(", ") || "",
          subject: response?.subject || "",
          body: response?.body || "",
          attachments: response?.attachments || [],
          scheduleDate: "",
          bulkRecipients: "",
        });
      } catch (error) {
        console.error("Failed to fetch email:", error);
      }
    };
    fetchEmail();
  }, [id]);

  // Common handlers
  const handleSend = async () => {
    try {
      setLoading(true);
      await emailService.sendEmail(emailData);
      setMessage("Email sent successfully!");
    } catch (err) {
      console.error(err);
      setMessage("Failed to send email.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDraft = async () => {
    try {
      setLoading(true);
      await emailService.saveDraft(emailData);
      setMessage("Draft saved successfully!");
    } catch (err) {
      console.error(err);
      setMessage("Failed to save draft.");
    } finally {
      setLoading(false);
    }
  };

  const handleSchedule = async () => {
    if (!emailData.scheduleDate) {
      setMessage("Please select a schedule date.");
      return;
    }
    try {
      setLoading(true);
      await emailService.scheduleEmail(emailData);
      setMessage("Email scheduled successfully!");
    } catch (err) {
      console.error(err);
      setMessage("Failed to schedule email.");
    } finally {
      setLoading(false);
    }
  };

  const handleBulkSend = async () => {
    if (!emailData.bulkRecipients) {
      setMessage("Please enter bulk recipients.");
      return;
    }
    try {
      setLoading(true);
      await emailService.sendBulkEmail({
        ...emailData,
        recipients: emailData.bulkRecipients.split(",").map((r) => r.trim()),
      });
      setMessage("Bulk email sent successfully!");
    } catch (err) {
      console.error(err);
      setMessage("Failed to send bulk email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
        <div className="space-y-1">
          <TypographyH2>Edit Email</TypographyH2>
          <TypographyMuted>Edit and send professional emails</TypographyMuted>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline">
            <Icon name="Eye" size={20} /> Preview
          </Button>
          <Button onClick={handleSaveDraft} disabled={loading}>
            <Icon name="Save" size={20} /> Save Draft
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Compose Area */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <TypographyH3>Email Details</TypographyH3>
            <div className="space-y-4">
              {/* Recipients */}
              <div className="grid gap-2">
                <Label>
                  To <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={emailData.recipients}
                  onChange={(e) =>
                    setEmailData({ ...emailData, recipients: e.target.value })
                  }
                  placeholder="recipient@example.com"
                />
              </div>

              {/* CC */}
              <div className="grid gap-2">
                <Label>CC (optional)</Label>
                <Input
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
                  value={emailData.subject}
                  onChange={(e) =>
                    setEmailData({ ...emailData, subject: e.target.value })
                  }
                  placeholder="Enter email subject"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {/* Schedule */}
                <div className="grid gap-2">
                  <Label>Schedule Email</Label>
                  <Input
                    type="datetime-local"
                    value={emailData.scheduleDate}
                    onChange={(e) =>
                      setEmailData({
                        ...emailData,
                        scheduleDate: e.target.value,
                      })
                    }
                  />
                  <Button onClick={handleSchedule} disabled={loading}>
                    Schedule
                  </Button>
                </div>

                {/* Bulk send */}
                <div className="grid gap-2">
                  <Label>Bulk Recipients (comma separated)</Label>
                  <Textarea
                    rows={3}
                    value={emailData.bulkRecipients}
                    onChange={(e) =>
                      setEmailData({
                        ...emailData,
                        bulkRecipients: e.target.value,
                      })
                    }
                  />
                  <Button onClick={handleBulkSend} disabled={loading}>
                    Send Bulk Email
                  </Button>
                </div>
              </div>

              {/* Body */}
              <div className="grid gap-2">
                <Label>
                  Message <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  rows={12}
                  value={emailData.body}
                  onChange={(e) =>
                    setEmailData({ ...emailData, body: e.target.value })
                  }
                  placeholder="Write your email content here..."
                />
              </div>

              {/* Attachments */}
              <div className="grid gap-2">
                <Label>Attachments</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 space-y-3 text-center">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                  <TypographyH5>Upload Documents</TypographyH5>
                  <TypographyMuted>
                    Drag and drop files or click to browse. Supported: PDF, DOC,
                    DOCX
                  </TypographyMuted>
                  <label className="bg-primary text-white px-4 py-2 rounded-full cursor-pointer inline-block">
                    Choose Files
                  </label>
                </div>
              </div>
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button onClick={handleSend} disabled={loading}>
              <Send className="w-4 h-4" /> Send Email
            </Button>
          </div>

          {message && <p className="text-green-600 mt-2">{message}</p>}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <div className="flex items-center space-x-2">
              <Icon name="Wand2" size={20} className="text-purple-600" />
              <TypographyH3>AI Assistant</TypographyH3>
              <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                Pro
              </span>
            </div>
            <div className="space-y-2">
              {aiSuggestions.map((s, i) => (
                <button
                  key={i}
                  className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EditEmail;
