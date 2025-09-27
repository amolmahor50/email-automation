"use client";

import { useState, useEffect } from "react";
import {
  FileText,
  Plus,
  Search,
  Globe,
  Lock,
  Edit3,
  Trash2,
  Eye,
  Copy,
  MoreVertical,
  Paperclip,
  X,
} from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "react-hot-toast";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  TypographyH2,
  TypographyH3,
  TypographyH4,
} from "@/components/custom/Typography";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

// ✅ Reusable Lucide Icon wrapper
import Icon from "@/components/custom/Icon";

const Templates = () => {
  const {
    templates,
    addTemplate,
    updateTemplate,
    deleteTemplate,
    loadTemplates,
    loading,
  } = useApp();

  const { user } = useAuth();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedVisibility, setSelectedVisibility] = useState("all");
  const [openModal, setOpenModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);

  //  delete dialog
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    loadTemplates();
  }, []);

  const categories = ["all", "career", "business", "professional", "personal"];

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.body.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" ||
      template.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesVisibility =
      selectedVisibility === "all" ||
      template.visibility === selectedVisibility;

    return matchesSearch && matchesCategory && matchesVisibility;
  });

  const handleCreateTemplate = async (data) => {
    try {
      await addTemplate({ ...data, visibility: "private" });
      toast.success("Template created!");
      setOpenModal(false);
    } catch {
      toast.error("Failed to create template");
    }
  };

  const handleUpdateTemplate = async (data) => {
    if (editingTemplate) {
      try {
        await updateTemplate(editingTemplate?._id, data);
        toast.success("Template updated!");
        setEditingTemplate(null);
        setOpenModal(false);
      } catch {
        toast.error("Failed to update template");
      }
    }
  };

  const confirmDelete = async () => {
    if (deleteTarget) {
      try {
        await deleteTemplate(deleteTarget);
        toast.success("Template deleted!");
      } catch {
        toast.error("Failed to delete template");
      } finally {
        setDeleteTarget(null);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <TypographyH2>Email Templates</TypographyH2>
        <Button onClick={() => setOpenModal(true)}>
          <Plus />
          New Template
        </Button>
      </div>

      {/* Filters */}
      <Card className="flex flex-col md:flex-row gap-4 p-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>

        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full md:w-40">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((c) => (
              <SelectItem key={c} value={c}>
                {c === "all" ? "All Categories" : c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={selectedVisibility}
          onValueChange={setSelectedVisibility}
        >
          <SelectTrigger className="w-full md:w-40">
            <SelectValue placeholder="Visibility" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="global">Global</SelectItem>
            <SelectItem value="private">My Templates</SelectItem>
          </SelectContent>
        </Select>
      </Card>

      {/* Templates Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredTemplates.map((template, index) => (
          <Card key={index} className="flex flex-col gap-4 p-4">
            <CardHeader className="flex flex-row p-0 items-start justify-between space-y-0">
              <div>
                <TypographyH4 className="flex items-center gap-2">
                  {template.title}
                  {template.visibility === "global" ? (
                    <Globe className="w-4 h-4 text-green-500" />
                  ) : (
                    <Lock className="w-4 h-4 text-gray-400" />
                  )}
                </TypographyH4>
                <span className="capitalize text-sm bg-blue-300 mt-6 rounded-full px-3 w-fit">
                  {template.category}
                </span>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Eye /> Preview
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Copy /> Use Template
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      setEditingTemplate(template);
                      setOpenModal(true);
                    }}
                  >
                    <Edit3 /> Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setDeleteTarget(template.id)}
                    className="text-red-600"
                  >
                    <Trash2 className="text-red-600" /> Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>

            <div className="flex-1">
              <p className="text-sm text-gray-600 line-clamp-3">
                {template.body}
              </p>
            </div>

            {/* Attachments */}
            {template.attachments?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2 text-xs">
                {template.attachments.map((file, i) => (
                  <span
                    key={i}
                    className="flex items-center gap-1 bg-gray-100 rounded px-2 py-1"
                  >
                    <Paperclip className="w-3 h-3" />
                    {file.name}
                  </span>
                ))}
              </div>
            )}

            <div className="flex justify-between text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <FileText className="w-4 h-4" />
                {template.attachments?.length || 0} attachments
              </div>
              <span>{new Date(template.createdAt).toLocaleDateString()}</span>
            </div>
          </Card>
        ))}
      </div>

      {/* Empty state */}
      {filteredTemplates.length === 0 && (
        <div className="text-center py-16">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium">No templates found</h3>
          <p className="text-sm text-gray-500">
            Try adjusting filters or create a new one.
          </p>
          <Button className="mt-4" onClick={() => setOpenModal(true)}>
            <Plus /> Create Template
          </Button>
        </div>
      )}

      {/* Modal */}
      {openModal && (
        <TemplateModal
          template={editingTemplate}
          onSave={editingTemplate ? handleUpdateTemplate : handleCreateTemplate}
          onCancel={() => {
            setOpenModal(false);
            setEditingTemplate(null);
          }}
        />
      )}

      {/*  Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={() => setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Template</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this template? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteTarget(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={confirmDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

const TemplateModal = ({ template, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: template?.title || "",
    body: template?.body || "",
    category: template?.category || "professional",
    attachments: template?.attachments || [],
  });

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData({
      ...formData,
      attachments: [...formData.attachments, ...files],
    });
  };

  const removeAttachment = (index) => {
    const updated = [...formData.attachments];
    updated.splice(index, 1);
    setFormData({ ...formData, attachments: updated });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open onOpenChange={onCancel}>
      <DialogContent className="max-h-[75vh] overflow-y-auto">
        <TypographyH3>
          {template ? "Edit Template" : "Create Template"}
        </TypographyH3>
        <DialogHeader>
          <DialogTitle></DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div className="grid gap-2">
            <Label>Title</Label>
            <Input
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
            />
          </div>

          {/* Category */}
          <div className="grid gap-2">
            <Label>Category</Label>
            <Select
              value={formData.category.toLowerCase()}
              onValueChange={(v) => setFormData({ ...formData, category: v })}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="career">Career</SelectItem>
                <SelectItem value="business">Business</SelectItem>
                <SelectItem value="professional">Professional</SelectItem>
                <SelectItem value="personal">Personal</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Body */}
          <div className="grid gap-2">
            <Label>Email Body</Label>
            <Textarea
              value={formData.body}
              onChange={(e) =>
                setFormData({ ...formData, body: e.target.value })
              }
              rows={8}
              required
            />
          </div>

          {/* Attachments */}
          <div className="grid gap-2">
            <Label>Attachments</Label>
            <Input
              type="file"
              multiple
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
            />
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.attachments.map((file, index) => (
                <span
                  key={index}
                  className="flex items-center gap-2 bg-gray-100 px-2 py-1 rounded text-sm"
                >
                  <Paperclip className="w-4 h-4" />
                  {file.name}
                  <button
                    type="button"
                    onClick={() => removeAttachment(index)}
                    className="text-red-500"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={onCancel} type="button">
              Cancel
            </Button>
            <Button type="submit">{template ? "Update" : "Create"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default Templates;
