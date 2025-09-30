"use client";

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
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

import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { TypographyH2, TypographyH4 } from "@/components/custom/Typography";
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

export default function TemplatesList() {
  const { templates, deleteTemplate, loadTemplates, loading } = useApp();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedVisibility, setSelectedVisibility] = useState("all");
  const [deleteTarget, setDeleteTarget] = useState(null);

  const categories = ["all", "Career", "Business", "Professional", "Personal"];

  useEffect(() => {
    loadTemplates().catch((err) =>
      toast.error(err.message || "Failed to load templates")
    );
  }, []);

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      template.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.body?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" ||
      template.category?.toLowerCase() === selectedCategory.toLowerCase();
    const matchesVisibility =
      selectedVisibility === "all" ||
      template.visibility === selectedVisibility;
    return matchesSearch && matchesCategory && matchesVisibility;
  });

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteTemplate(deleteTarget);
      toast.success("Template deleted!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete template");
    } finally {
      setDeleteTarget(null);
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
        <Button onClick={() => navigate("/templates/create")}>
          <Plus /> New Template
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
            <SelectValue placeholder="All Categories" />
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
        {filteredTemplates.map((template) => (
          <Card key={template._id} className="flex flex-col gap-4 p-4">
            <CardHeader className="flex flex-row p-0 items-start justify-between space-y-0">
              <div>
                <Link
                  to={`/templates/${template._id}/edit`}
                  className="hover:text-primary hover:underline underline-offset-4 mb-3"
                >
                  <TypographyH4 className="flex capitalize items-center gap-2">
                    {template.title}
                    {template.visibility === "global" ? (
                      <>
                        <Globe className="w-4 h-4 text-green-500" />
                        <span className="text-xs text-gray-500">
                          by{" "}
                          {template.ownerId?.name ||
                            template.ownerId ||
                            "Unknown"}
                        </span>
                      </>
                    ) : (
                      <Lock className="w-4 h-4 text-gray-400" />
                    )}
                  </TypographyH4>
                </Link>
                <span className="capitalize text-sm bg-blue-300 mt-2 rounded-full px-3 w-fit">
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
                  <DropdownMenuItem
                    onClick={() =>
                      navigate(`/templates/${template._id}/preview`)
                    }
                  >
                    <Eye /> Preview
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Copy /> Use Template
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => navigate(`/templates/${template._id}/edit`)}
                  >
                    <Edit3 /> Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setDeleteTarget(template._id)}
                    className="text-red-600"
                  >
                    <Trash2 /> Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>

            <div className="flex-1">
              <p className="text-sm text-gray-600 line-clamp-3">
                {template.body}
              </p>
            </div>

            {/* {template?.defaultAttachments?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2 text-xs">
                {template.defaultAttachments.map((file, i) => {
                  const url = `/api/templates/file/${file.fileId}`;
                  return (
                    <a
                      key={i}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline flex items-center gap-1"
                    >
                      <Paperclip className="w-3 h-3" />
                      {file.filename}
                    </a>
                  );
                })}
              </div>
            )} */}

            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <div className="flex items-center gap-1">
                <FileText className="w-4 h-4" />{" "}
                {template?.defaultAttachments?.length || 0} attachments
              </div>
              <span>{new Date(template.createdAt).toLocaleDateString()}</span>
            </div>
          </Card>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-16">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium">No templates found</h3>
          <p className="text-sm text-gray-500">
            Try adjusting filters or create a new one.
          </p>
          <Button
            className="mt-4"
            onClick={() => navigate("/templates/create")}
          >
            <Plus /> Create Template
          </Button>
        </div>
      )}

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
}
