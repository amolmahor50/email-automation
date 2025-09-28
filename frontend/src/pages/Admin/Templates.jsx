import React, { useState } from "react";
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
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  TypographyH2,
  TypographyH3,
  TypographyMuted,
} from "@/components/custom/Typography";

import Icon from "@/components/custom/Icon";

const AdminTemplates = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedVisibility, setSelectedVisibility] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);

  const templates = [
    {
      id: "1",
      title: "Job Application",
      body: "Dear Hiring Manager,\n\nI am writing to express my interest in the [Position Title] position...",
      category: "Career",
      visibility: "global",
      usage: 1247,
      lastUsed: "2024-01-20",
    },
    {
      id: "2",
      title: "Business Proposal",
      body: "Dear [Client Name],\n\nI hope this email finds you well...",
      category: "Business",
      visibility: "global",
      usage: 892,
      lastUsed: "2024-01-19",
    },
    {
      id: "3",
      title: "Follow-up Meeting",
      body: "Dear [Name],\n\nThank you for taking the time...",
      category: "Professional",
      visibility: "global",
      usage: 634,
      lastUsed: "2024-01-18",
    },
    {
      id: "4",
      title: "Invoice Request",
      body: "Dear [Client Name],\n\nI hope this email finds you well...",
      category: "Business",
      visibility: "global",
      usage: 445,
      lastUsed: "2024-01-17",
    },
    {
      id: "5",
      title: "Leave Application",
      body: "Dear [Manager Name],\n\nI am writing to request leave...",
      category: "Professional",
      visibility: "global",
      usage: 321,
      lastUsed: "2024-01-16",
    },
  ];

  const categories = ["all", "Career", "Business", "Professional", "Personal"];

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

  const templateStats = [
    {
      label: "Total Templates",
      value: templates.length.toString(),
      icon: "FileText",
    },
    {
      label: "Global Templates",
      value: templates
        .filter((t) => t.visibility === "global")
        .length.toString(),
      icon: "Globe",
    },
    {
      label: "Total Usage",
      value: templates.reduce((sum, t) => sum + t.usage, 0).toLocaleString(),
      icon: "TrendingUp",
    },
    {
      label: "Active Users",
      value: "2,847",
      icon: "Users",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <TypographyH2>Template Management</TypographyH2>

        <Button onClick={() => setShowCreateModal(true)}>
          <Icon name="Plus" size={20} /> Create Global Template
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {templateStats.map((stat, i) => (
          <div
            key={i}
            className="space-x-4 rounded-md bg-card p-6 flex items-center"
          >
            <div className="p-3 rounded-full bg-gray-100">
              <Icon name={stat?.icon} size={20} />
            </div>
            <div>
              <TypographyMuted>{stat.label}</TypographyMuted>
              <TypographyH3>{stat.value}</TypographyH3>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <Card className="rounded-none md:p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Icon
              name="Search"
              size={16}
              className="absolute left-3 top-3 text-muted-foreground"
            />
            <Input
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((c) => (
                <SelectItem key={c} value={c}>
                  {c === "all"
                    ? "All Categories"
                    : c.charAt(0).toUpperCase() + c.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={selectedVisibility}
            onValueChange={setSelectedVisibility}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Visibility" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Templates</SelectItem>
              <SelectItem value="global">Global Templates</SelectItem>
              <SelectItem value="private">Private Templates</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Table */}
      <Card>
        <TypographyH3>Templates ({filteredTemplates.length})</TypographyH3>
        <div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Template</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Visibility</TableHead>
                <TableHead>Usage</TableHead>
                <TableHead>Last Used</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTemplates.map((template) => (
                <TableRow key={template.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Icon
                        name="FileText"
                        size={20}
                        className="text-primary"
                      />
                      <div>
                        <p className="font-medium">{template.title}</p>
                        <p className="text-sm text-muted-foreground truncate max-w-xs">
                          {template.body.substring(0, 60)}...
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{template.category}</TableCell>
                  <TableCell>
                    {template.visibility === "global" ? (
                      <div className="flex items-center gap-1 text-green-600">
                        <Icon name="Globe" size={20} /> Global
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-gray-500">
                        <Icon name="Lock" size={20} /> Private
                      </div>
                    )}
                  </TableCell>
                  <TableCell>{template.usage}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {template.lastUsed}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon">
                        <Icon name="Eye" size={20} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditingTemplate(template)}
                      >
                        <Icon name="Edit3" size={20} />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Icon
                          name="Trash2"
                          size={20}
                          className="text-red-600"
                        />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Popular Templates */}
      <Card>
        <div>
          <TypographyH3>Most Popular Templates</TypographyH3>
          <TypographyMuted>
            Frequently used templates across the system
          </TypographyMuted>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates
            .sort((a, b) => b.usage - a.usage)
            .slice(0, 6)
            .map((template) => (
              <div key={template.id} className="p-4 border rounded-md">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{template.title}</p>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {template.body}
                    </p>
                  </div>
                  <Icon name="Globe" size={20} className="text-green-600" />
                </div>
                <div className="flex justify-between text-sm mt-3">
                  <span className="text-primary font-medium">
                    {template.usage} uses
                  </span>
                  <span className="text-muted-foreground">
                    {template.category}
                  </span>
                </div>
              </div>
            ))}
        </div>
      </Card>

      {/* Create/Edit Modal */}
      <TemplateModal
        template={editingTemplate}
        open={showCreateModal || !!editingTemplate}
        onOpenChange={(val) => {
          if (!val) {
            setShowCreateModal(false);
            setEditingTemplate(null);
          }
        }}
      />
    </div>
  );
};

const TemplateModal = ({ template, open, onOpenChange }) => {
  const [formData, setFormData] = useState({
    title: template?.title || "",
    body: template?.body || "",
    category: template?.category || "Professional",
    visibility: template?.visibility || "global",
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[75vh] overflow-y-auto">
        <div className="space-y-4">
          <TypographyH3>
            {template ? "Edit Global Template" : "Create Global Template"}
          </TypographyH3>
          <div className="grid gap-2">
            <Label>Template Title</Label>
            <Input
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="Enter template title"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Category</Label>
              <Select
                value={formData.category}
                onValueChange={(val) =>
                  setFormData({ ...formData, category: val })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Career">Career</SelectItem>
                  <SelectItem value="Business">Business</SelectItem>
                  <SelectItem value="Professional">Professional</SelectItem>
                  <SelectItem value="Personal">Personal</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Visibility</Label>
              <Select
                value={formData.visibility}
                onValueChange={(val) =>
                  setFormData({ ...formData, visibility: val })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="global">Global (All Users)</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Template Content</Label>
            <Textarea
              rows={10}
              value={formData.body}
              onChange={(e) =>
                setFormData({ ...formData, body: e.target.value })
              }
              placeholder="Enter template content..."
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button>{template ? "Update Template" : "Create Template"}</Button>
            <Button variant="destructive" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdminTemplates;
