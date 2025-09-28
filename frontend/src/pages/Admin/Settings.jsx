import React, { useState } from "react";
import Icon from "@/components/custom/Icon";
import {
  TypographyH2,
  TypographyH3,
  TypographySmall,
} from "@/components/custom/Typography";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const statCard = [
  {
    icon: "CheckCircle2",
    label: "System Status",
    status: "All systems operational",
    color: "green",
  },
  {
    icon: "Database",
    label: "Database",
    status: "Connected",
    color: "blue",
  },
  {
    icon: "Mail",
    label: "Email Service",
    status: "Active",
    color: "purple",
  },
  {
    icon: "CreditCard",
    label: "Payment Gateway",
    status: "Connected",
    color: "orange",
  },
];

const securityConfigration = [
  {
    label: "Email Verification",
    description: "Require users to verify their email address",
    key: "requireEmailVerification",
  },
  {
    label: "Two-Factor Authentication",
    description: "Enable 2FA for all users",
    key: "enableTwoFactor",
  },
  {
    label: "Strong Password Policy",
    description: "Require complex passwords",
    key: "requireStrongPassword",
  },
];

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    general: {
      siteName: "EmailFlow",
      siteDescription: "Professional Email Automation Platform",
      supportEmail: "support@emailflow.com",
      maxFileSize: 10,
      allowedFileTypes: "pdf,doc,docx,jpg,png",
      maintenanceMode: false,
    },
    email: {
      smtpHost: "smtp.emailflow.com",
      smtpPort: 587,
      smtpUser: "noreply@emailflow.com",
      smtpPassword: "••••••••",
      fromName: "EmailFlow",
      fromEmail: "noreply@emailflow.com",
      dailyLimit: 10000,
      enableTracking: true,
    },
    security: {
      requireEmailVerification: true,
      enableTwoFactor: false,
      sessionTimeout: 24,
      maxLoginAttempts: 5,
      passwordMinLength: 8,
      requireStrongPassword: true,
    },
    notifications: {
      newUserSignup: true,
      paymentReceived: true,
      systemErrors: true,
      weeklyReports: true,
      maintenanceAlerts: true,
    },
    limits: {
      freeEmailLimit: 50,
      proEmailLimit: 500,
      businessEmailLimit: 5000,
      maxTemplatesPerUser: 50,
      maxAttachmentSize: 25,
    },
  });

  const handleSave = (section) => {
    console.log(`Saving ${section} settings:`, settings[section]);
    // Implement actual save functionality here
  };

  const handleInputChange = (section, field, value) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <TypographyH2>System Settings</TypographyH2>

      {/* System Status */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {statCard?.map((item) => (
          <div
            key={item.label}
            className="bg-card rounded-md p-4 flex flex-col"
          >
            <div className="flex items-center space-x-2">
              <Icon
                name={item.icon}
                size={20}
                className={`text-${item.color}-500 w-5 h-5`}
              />
              <span className="font-medium text-gray-900">{item.label}</span>
            </div>
            <p className={`text-sm text-${item.color}-600 mt-1`}>
              {item.status}
            </p>
          </div>
        ))}
      </div>

      <div className="space-y-6">
        {/* General Settings */}
        <Card>
          <TypographyH3>General Settings</TypographyH3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="grid gap-2">
              <Label>Site Name</Label>
              <Input
                value={settings.general.siteName}
                onChange={(e) =>
                  handleInputChange("general", "siteName", e.target.value)
                }
              />
            </div>
            <div className="grid gap-2">
              <Label>Support Email</Label>
              <Input
                type="email"
                value={settings.general.supportEmail}
                onChange={(e) =>
                  handleInputChange("general", "supportEmail", e.target.value)
                }
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Site Description</Label>
            <Textarea
              value={settings.general.siteDescription}
              onChange={(e) =>
                handleInputChange("general", "siteDescription", e.target.value)
              }
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="grid gap-2">
              <Label>Max File Size (MB)</Label>
              <Input
                type="number"
                value={settings.general.maxFileSize}
                onChange={(e) =>
                  handleInputChange(
                    "general",
                    "maxFileSize",
                    parseInt(e.target.value)
                  )
                }
              />
            </div>
            <div className="grid gap-2">
              <Label>Allowed File Types</Label>
              <Input
                value={settings.general.allowedFileTypes}
                onChange={(e) =>
                  handleInputChange(
                    "general",
                    "allowedFileTypes",
                    e.target.value
                  )
                }
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              checked={settings.general.maintenanceMode}
              onCheckedChange={(value) =>
                handleInputChange("general", "maintenanceMode", value)
              }
            />
            <Label className="mb-0">Enable Maintenance Mode</Label>
          </div>

          <Button
            className="w-full sm:w-fit"
            onClick={() => handleSave("general")}
          >
            <Icon name="Save" size={20} /> Save General Settings
          </Button>
        </Card>

        {/* Email Settings */}
        <Card>
          <TypographyH3>Email Configuration</TypographyH3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="grid gap-2">
              <Label>SMTP Host</Label>
              <Input
                value={settings.email.smtpHost}
                onChange={(e) =>
                  handleInputChange("email", "smtpHost", e.target.value)
                }
              />
            </div>
            <div className="grid gap-2">
              <Label>SMTP Port</Label>
              <Input
                type="number"
                value={settings.email.smtpPort}
                onChange={(e) =>
                  handleInputChange(
                    "email",
                    "smtpPort",
                    parseInt(e.target.value)
                  )
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="grid gap-2">
              <Label>SMTP Username</Label>
              <Input
                value={settings.email.smtpUser}
                onChange={(e) =>
                  handleInputChange("email", "smtpUser", e.target.value)
                }
              />
            </div>
            <div className="grid gap-2">
              <Label>SMTP Password</Label>
              <Input
                type="password"
                value={settings.email.smtpPassword}
                onChange={(e) =>
                  handleInputChange("email", "smtpPassword", e.target.value)
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="grid gap-2">
              <Label>From Name</Label>
              <Input
                value={settings.email.fromName}
                onChange={(e) =>
                  handleInputChange("email", "fromName", e.target.value)
                }
              />
            </div>
            <div className="grid gap-2">
              <Label>From Email</Label>
              <Input
                type="email"
                value={settings.email.fromEmail}
                onChange={(e) =>
                  handleInputChange("email", "fromEmail", e.target.value)
                }
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Daily Email Limit</Label>
            <Input
              type="number"
              value={settings.email.dailyLimit}
              onChange={(e) =>
                handleInputChange(
                  "email",
                  "dailyLimit",
                  parseInt(e.target.value)
                )
              }
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              checked={settings.email.enableTracking}
              onCheckedChange={(value) =>
                handleInputChange("email", "enableTracking", value)
              }
            />
            <Label className="mb-0">Enable Email Tracking</Label>
          </div>

          <Button
            className="w-full sm:w-fit"
            onClick={() => handleSave("email")}
          >
            <Icon name="Save" size={20} /> Save Email Settings
          </Button>
        </Card>

        {/* Security Settings */}
        <Card>
          <TypographyH3>Security Configuration</TypographyH3>
          <div className="space-y-4">
            {securityConfigration?.map((item) => (
              <div
                key={item.key}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div>
                  <TypographySmall>{item.label}</TypographySmall>
                  <div className="text-sm text-gray-600">
                    {item.description}
                  </div>
                </div>
                <Switch
                  checked={settings.security[item.key]}
                  onCheckedChange={(value) =>
                    handleInputChange("security", item.key, value)
                  }
                />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="grid gap-2">
              <Label>Session Timeout (hours)</Label>
              <Input
                type="number"
                value={settings.security.sessionTimeout}
                onChange={(e) =>
                  handleInputChange(
                    "security",
                    "sessionTimeout",
                    parseInt(e.target.value)
                  )
                }
              />
            </div>
            <div className="grid gap-2">
              <Label>Max Login Attempts</Label>
              <Input
                type="number"
                value={settings.security.maxLoginAttempts}
                onChange={(e) =>
                  handleInputChange(
                    "security",
                    "maxLoginAttempts",
                    parseInt(e.target.value)
                  )
                }
              />
            </div>
            <div className="grid gap-2">
              <Label>Min Password Length</Label>
              <Input
                type="number"
                value={settings.security.passwordMinLength}
                onChange={(e) =>
                  handleInputChange(
                    "security",
                    "passwordMinLength",
                    parseInt(e.target.value)
                  )
                }
              />
            </div>
          </div>

          <Button
            className="w-full sm:w-fit"
            onClick={() => handleSave("security")}
          >
            <Icon name="Save" size={20} /> Save Security Settings
          </Button>
        </Card>

        {/* Notification Settings */}
        <Card>
          <TypographyH3>Notification Preferences</TypographyH3>
          <div className="space-y-4">
            {Object.entries(settings.notifications).map(([key, value]) => (
              <div
                key={key}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div>
                  <TypographySmall className="capitalize">
                    {key.replace(/([A-Z])/g, " $1").trim()}
                  </TypographySmall>
                  <div className="text-sm text-gray-600">
                    {key === "newUserSignup" &&
                      "Get notified when new users sign up"}
                    {key === "paymentReceived" &&
                      "Get notified when payments are received"}
                    {key === "systemErrors" &&
                      "Get notified about system errors"}
                    {key === "weeklyReports" && "Receive weekly system reports"}
                    {key === "maintenanceAlerts" &&
                      "Get notified about maintenance schedules"}
                  </div>
                </div>
                <Switch
                  checked={value}
                  onCheckedChange={(value) =>
                    handleInputChange("notifications", key, value)
                  }
                />
              </div>
            ))}
          </div>

          <Button
            className="w-full sm:w-fit"
            onClick={() => handleSave("notifications")}
          >
            <Icon name="Save" size={20} /> Save Notification Settings
          </Button>
        </Card>

        {/* Limits Settings */}
        <Card>
          <TypographyH3>System Limits</TypographyH3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="grid gap-2">
              <Label>Free Plan Email Limit (per month)</Label>
              <Input
                type="number"
                value={settings.limits.freeEmailLimit}
                onChange={(e) =>
                  handleInputChange(
                    "limits",
                    "freeEmailLimit",
                    parseInt(e.target.value)
                  )
                }
              />
            </div>
            <div className="grid gap-2">
              <Label>Pro Plan Email Limit (per month)</Label>
              <Input
                type="number"
                value={settings.limits.proEmailLimit}
                onChange={(e) =>
                  handleInputChange(
                    "limits",
                    "proEmailLimit",
                    parseInt(e.target.value)
                  )
                }
              />
            </div>
            <div className="grid gap-2">
              <Label>Business Plan Email Limit (per month)</Label>
              <Input
                type="number"
                value={settings.limits.businessEmailLimit}
                onChange={(e) =>
                  handleInputChange(
                    "limits",
                    "businessEmailLimit",
                    parseInt(e.target.value)
                  )
                }
              />
            </div>
            <div className="grid gap-2">
              <Label>Max Templates Per User</Label>
              <Input
                type="number"
                value={settings.limits.maxTemplatesPerUser}
                onChange={(e) =>
                  handleInputChange(
                    "limits",
                    "maxTemplatesPerUser",
                    parseInt(e.target.value)
                  )
                }
              />
            </div>
            <div className="md:col-span-2 grid gap-2">
              <Label>Max Attachment Size (MB)</Label>
              <Input
                type="number"
                value={settings.limits.maxAttachmentSize}
                onChange={(e) =>
                  handleInputChange(
                    "limits",
                    "maxAttachmentSize",
                    parseInt(e.target.value)
                  )
                }
              />
            </div>
          </div>

          <Button
            className="w-full sm:w-fit"
            onClick={() => handleSave("limits")}
          >
            <Icon name="Save" size={20} /> Save Limit Settings
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default AdminSettings;
