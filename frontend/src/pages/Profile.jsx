import React, { useState, useEffect } from "react";
import {
  User,
  FileText,
  Upload,
  Camera,
  Save,
  Trash2,
  Key,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { authService } from "@/services/authService";
import { userService } from "@/services/userService";
import { toast } from "react-hot-toast";
import {
  TypographyH1,
  TypographyH3,
  TypographyH5,
  TypographyMuted,
} from "@/components/custom/Typography";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

// ---------------------- Profile Header ----------------------
const ProfileHeader = ({ profileData, user }) => {
  return (
    <Card className="flex flex-col gap-6  md:flex-row items-center">
      <div className="relative">
        {profileData.profilePicture ? (
          <img
            src={profileData.profilePicture}
            alt={user?.name}
            className="w-24 h-24 rounded-full object-cover"
          />
        ) : (
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-gray-400" />
          </div>
        )}
        <button className="absolute -bottom-1 -right-1 bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 transition-colors">
          <Camera className="w-4 h-4" />
        </button>
      </div>
      <div className="flex-1 space-y-1">
        <TypographyH3>{user?.name}</TypographyH3>
        <TypographyMuted>{user?.email}</TypographyMuted>
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            user?.subscription.plan === "pro"
              ? "bg-purple-100 text-purple-800"
              : user?.subscription.plan === "business"
              ? "bg-blue-100 text-blue-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {user?.subscription.plan?.toUpperCase()} Plan
        </span>
      </div>
      <div className="text-right mt-2 md:mt-0">
        <div className="text-sm text-gray-500">Member since</div>
        <div className="font-medium">
          {new Date(user?.createdAt || "")?.toLocaleDateString()}
        </div>
      </div>
    </Card>
  );
};

// ---------------------- Personal Info ----------------------
const PersonalInfo = ({ profileData, setProfileData, handleSave }) => {
  return (
    <Card className="space-y-6 gap-0">
      <TypographyH3>Personal Information</TypographyH3>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="grid gap-2">
          <Label>Full Name</Label>
          <Input
            type="text"
            value={profileData.name}
            onChange={(e) =>
              setProfileData({ ...profileData, name: e.target.value })
            }
          />
        </div>
        <div className="grid gap-2">
          <Label>Email Address</Label>
          <Input type="email" value={profileData.email} disabled />
        </div>
        <div className="grid gap-2">
          <Label>Company Name</Label>
          <Input
            type="text"
            value={profileData.co}
            onChange={(e) =>
              setProfileData({ ...profileData, co: e.target.value })
            }
            placeholder="Your co name"
          />
        </div>
        <div className="grid gap-2">
          <Label>Phone Number</Label>
          <Input
            type="tel"
            value={profileData.contact}
            onChange={(e) =>
              setProfileData({ ...profileData, contact: e.target.value })
            }
            placeholder="Your phone number"
          />
        </div>
      </div>
      <div className="grid gap-2">
        <Label>Email Signature</Label>
        <Textarea
          value={profileData.signature}
          onChange={(e) =>
            setProfileData({ ...profileData, signature: e.target.value })
          }
          rows={4}
          placeholder="Your email signature"
        />
      </div>
      <Button onClick={handleSave} className="sm:w-fit w-full">
        <Save className="w-4 h-4 mr-2" /> Save Changes
      </Button>
    </Card>
  );
};

// ---------------------- Document Storage ----------------------
const DocumentStorage = ({
  documents,
  handleFileUpload,
  handleDeleteDocument,
}) => {
  return (
    <Card className="space-y-6 gap-0">
      <TypographyH3>Document Storage</TypographyH3>
      <div className="grid md:grid-cols-2 gap-4">
        {documents.map((doc, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">
                    {doc.originalName || doc}
                  </div>
                  <div className="text-sm text-gray-500">PDF Document</div>
                </div>
              </div>
              <button
                onClick={() => handleDeleteDocument(doc.id || doc)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
        {documents.length === 0 && (
          <div className="text-center py-12 space-y-4 col-span-full">
            <FileText className="w-16 h-16 text-gray-300 mx-auto" />
            <TypographyH5>No documents uploaded</TypographyH5>
            <TypographyMuted>
              Upload your resume, certificates, or other documents to use as
              email attachments.
            </TypographyMuted>
            <Button>Upload First Document</Button>
          </div>
        )}
      </div>
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 space-y-3 text-center">
        <Upload className="w-12 h-12 text-gray-400 mx-auto" />
        <TypographyH5>Upload Documents</TypographyH5>
        <TypographyMuted>
          Drag and drop files here or click to browse. Supported formats: PDF,
          DOC, DOCX
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
    </Card>
  );
};

// ---------------------- Notifications ----------------------
const Notifications = ({ notifications, handleNotificationChange }) => {
  return (
    <Card className="space-y-6 gap-0">
      <TypographyH3>Notification Preferences</TypographyH3>
      {Object.entries(notifications).map(([key, value]) => (
        <div
          key={key}
          className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
        >
          <div>
            <div className="font-medium text-gray-900">
              {key === "emailSent" && "Email Sent Notifications"}
              {key === "emailOpened" && "Email Opened Notifications"}
              {key === "weeklyReport" && "Weekly Analytics Report"}
              {key === "marketingEmails" && "Marketing Emails"}
            </div>
            <div className="text-sm text-gray-600">
              {key === "emailSent" && "Get notified when your emails are sent"}
              {key === "emailOpened" &&
                "Get notified when recipients open your emails"}
              {key === "weeklyReport" && "Receive weekly performance reports"}
              {key === "marketingEmails" &&
                "Receive updates about new features and tips"}
            </div>
          </div>
          <Switch
            checked={value}
            onCheckedChange={(checked) =>
              handleNotificationChange(key, checked)
            }
          />
        </div>
      ))}
    </Card>
  );
};

// ---------------------- Security Settings ----------------------
const SecuritySettings = ({
  openChangePass,
  setOpenChangePass,
  openDelete,
  setOpenDelete,
  handleChangePassword,
  handleDeleteAccount,
}) => {
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  return (
    <Card className="space-y-6 gap-0">
      <TypographyH3>Security Settings</TypographyH3>

      <div className="space-y-4">
        <div className="border border-gray-200 rounded-lg p-6 flex md:items-center gap-4 md:flex-row flex-col justify-between">
          <div>
            <h4 className="font-medium text-gray-900">Change Password</h4>
            <p className="text-sm text-gray-600">
              Update your account password
            </p>
          </div>
          <Button variant="secondary" onClick={() => setOpenChangePass(true)}>
            <Key /> Change Password
          </Button>
        </div>

        <div className="border border-gray-200 rounded-lg p-6 flex md:items-center gap-4 md:flex-row flex-col justify-between">
          <div>
            <h4 className="font-medium text-gray-900">
              Two-Factor Authentication
            </h4>
            <p className="text-sm text-gray-600">
              Add an extra layer of security to your account
            </p>
          </div>
          <Button className="bg-green-600 hover:bg-green-700 transition-colors">
            Enable 2FA
          </Button>
        </div>

        <div className="border border-gray-200 rounded-lg p-6 flex md:items-center gap-4 md:flex-row flex-col justify-between">
          <div>
            <h4 className="font-medium text-gray-900">Active Sessions</h4>
            <p className="text-sm text-gray-600">
              Manage devices that are signed in to your account
            </p>
          </div>
          <Button variant="secondary">View Sessions</Button>
        </div>

        <div className="border border-gray-200 rounded-lg p-6 flex md:items-center gap-4 md:flex-row flex-col justify-between">
          <div>
            <h4 className="font-medium text-red-900">Delete Account</h4>
            <p className="text-sm text-red-700">
              Permanently delete your account and all data
            </p>
          </div>
          <Button variant="destructive" onClick={() => setOpenDelete(true)}>
            Delete Account
          </Button>
        </div>
      </div>

      {/* Change Password Dialog */}
      <Dialog open={openChangePass} onOpenChange={setOpenChangePass}>
        <DialogContent>
          <TypographyH3>Change Password</TypographyH3>
          <DialogHeader>
            <DialogTitle></DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label>Old Password</Label>
              <Input
                type="password"
                placeholder="Old Password"
                value={oldPass}
                onChange={(e) => setOldPass(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label>Password</Label>
              <Input
                type="password"
                placeholder="New Password"
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label>Confirm Password</Label>
              <Input
                type="password"
                placeholder="Confirm Password"
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={() =>
                handleChangePassword(oldPass, newPass, confirmPass)
              }
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Account Dialog */}
      <Dialog open={openDelete} onOpenChange={setOpenDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Account</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to permanently delete your account?</p>
          <DialogFooter>
            <Button variant="destructive" onClick={handleDeleteAccount}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

// ---------------------- Main Profile Component ----------------------
const Profile = () => {
  const { user, updateProfile: updateAuthProfile } = useAuth();
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    co: user?.profile?.co || "",
    contact: user?.profile?.contact || "",
    signature: user?.profile?.signature || "",
    profilePicture: user?.profile?.profilePicture || "",
  });
  const [documents, setDocuments] = useState([]);
  const [notifications, setNotifications] = useState({
    emailSent: true,
    emailOpened: true,
    weeklyReport: false,
    marketingEmails: true,
  });

  const [openChangePass, setOpenChangePass] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      const docs = await userService.getDocuments();
      setDocuments(docs);
    } catch (error) {
      toast.error("Failed to load documents");
    }
  };

  const handleSave = async () => {
    try {
      await userService.updateProfile({
        name: profileData.name,
        profile: {
          co: profileData.co,
          contact: profileData.contact,
          signature: profileData.signature,
          profilePicture: profileData.profilePicture,
        },
      });
      updateAuthProfile(profileData);
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  const handleFileUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    try {
      await userService.uploadDocuments(files);
      toast.success("Documents uploaded successfully!");
      loadDocuments();
    } catch (error) {
      toast.error("Failed to upload documents");
    }
  };

  const handleDeleteDocument = async (id) => {
    if (!confirm("Are you sure you want to delete this document?")) return;
    try {
      await userService.deleteDocument(id);
      toast.success("Document deleted successfully!");
      loadDocuments();
    } catch (error) {
      toast.error("Failed to delete document");
    }
  };

  const handleNotificationChange = async (key, value) => {
    const updated = { ...notifications, [key]: value };
    setNotifications(updated);
    try {
      await userService.updateNotificationPreferences(updated);
      toast.success("Notification preferences updated!");
    } catch (error) {
      toast.error("Failed to update notification preferences");
    }
  };

  const handleChangePassword = async (oldPass, newPass, confirmPass) => {
    if (newPass !== confirmPass) return toast.error("Passwords do not match");
    try {
      await authService.changePassword(oldPass, newPass);
      toast.success("Password changed successfully!");
      setOpenChangePass(false);
    } catch (error) {
      toast.error("Failed to change password");
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await userService.deleteAccount();
      toast.success("Account deleted successfully!");
      setOpenDelete(false);
      // logout or redirect logic here
    } catch (error) {
      toast.error("Failed to delete account");
    }
  };

  return (
    <div className="space-y-6">
      <TypographyH1>Profile Settings</TypographyH1>

      <ProfileHeader profileData={profileData} user={user} />
      <PersonalInfo
        profileData={profileData}
        setProfileData={setProfileData}
        handleSave={handleSave}
      />
      <DocumentStorage
        documents={documents}
        handleFileUpload={handleFileUpload}
        handleDeleteDocument={handleDeleteDocument}
      />
      <Notifications
        notifications={notifications}
        handleNotificationChange={handleNotificationChange}
      />
      <SecuritySettings
        openChangePass={openChangePass}
        setOpenChangePass={setOpenChangePass}
        openDelete={openDelete}
        setOpenDelete={setOpenDelete}
        handleChangePassword={handleChangePassword}
        handleDeleteAccount={handleDeleteAccount}
      />
    </div>
  );
};

export default Profile;
