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
  Users,
  TrendingUp,
  Calendar,
} from "lucide-react";

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
      ownerId: null,
      usage: 1247,
      createdAt: "2024-01-01",
      lastUsed: "2024-01-20",
    },
    {
      id: "2",
      title: "Business Proposal",
      body: "Dear [Client Name],\n\nI hope this email finds you well. I am writing to present...",
      category: "Business",
      visibility: "global",
      ownerId: null,
      usage: 892,
      createdAt: "2024-01-02",
      lastUsed: "2024-01-19",
    },
    {
      id: "3",
      title: "Follow-up Meeting",
      body: "Dear [Name],\n\nThank you for taking the time to meet with me yesterday...",
      category: "Professional",
      visibility: "global",
      ownerId: null,
      usage: 634,
      createdAt: "2024-01-03",
      lastUsed: "2024-01-18",
    },
    {
      id: "4",
      title: "Invoice Request",
      body: "Dear [Client Name],\n\nI hope this email finds you well. Please find attached...",
      category: "Business",
      visibility: "global",
      ownerId: null,
      usage: 445,
      createdAt: "2024-01-04",
      lastUsed: "2024-01-17",
    },
    {
      id: "5",
      title: "Leave Application",
      body: "Dear [Manager Name],\n\nI am writing to request leave from [Start Date] to [End Date]...",
      category: "Professional",
      visibility: "global",
      ownerId: null,
      usage: 321,
      createdAt: "2024-01-05",
      lastUsed: "2024-01-16",
    },
  ];

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

  const templateStats = [
    {
      label: "Total Templates",
      value: templates.length.toString(),
      icon: FileText,
      color: "blue",
    },
    {
      label: "Global Templates",
      value: templates
        .filter((t) => t.visibility === "global")
        .length.toString(),
      icon: Globe,
      color: "green",
    },
    {
      label: "Total Usage",
      value: templates.reduce((sum, t) => sum + t.usage, 0).toLocaleString(),
      icon: TrendingUp,
      color: "purple",
    },
    {
      label: "Active Users",
      value: "2,847",
      icon: Users,
      color: "orange",
    },
  ];

  const handleCreateTemplate = (templateData) => {
    console.log("Creating template:", templateData);
    setShowCreateModal(false);
  };

  const handleUpdateTemplate = (templateData) => {
    console.log("Updating template:", templateData);
    setEditingTemplate(null);
  };

  const handleDeleteTemplate = (templateId) => {
    console.log("Deleting template:", templateId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Template Management
          </h1>
          <p className="text-gray-600">
            Manage global templates and monitor usage
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Create Global Template</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {templateStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                </div>
                <div className={`p-2 rounded-lg bg-${stat.color}-100`}>
                  <Icon className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category === "all"
                  ? "All Categories"
                  : category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>

          {/* Visibility Filter */}
          <select
            value={selectedVisibility}
            onChange={(e) => setSelectedVisibility(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Templates</option>
            <option value="global">Global Templates</option>
            <option value="private">Private Templates</option>
          </select>
        </div>
      </div>

      {/* Templates Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Templates ({filteredTemplates.length})
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Template
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Visibility
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usage
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Used
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTemplates.map((template) => (
                <tr key={template.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <FileText className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {template.title}
                        </div>
                        <div className="text-sm text-gray-600 truncate max-w-xs">
                          {template.body.substring(0, 60)}...
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {template.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-1">
                      {template.visibility === "global" ? (
                        <>
                          <Globe className="w-4 h-4 text-green-500" />
                          <span className="text-sm text-green-700">Global</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">Private</span>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-1">
                      <TrendingUp className="w-4 h-4 text-purple-500" />
                      <span className="font-medium text-gray-900">
                        {template.usage}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {template.lastUsed}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() =>
                          console.log("Preview template:", template.id)
                        }
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Preview"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setEditingTemplate(template)}
                        className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() =>
                          console.log("Copy template:", template.id)
                        }
                        className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                        title="Duplicate"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteTemplate(template.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Popular Templates */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">
          Most Popular Templates
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates
            .sort((a, b) => b.usage - a.usage)
            .slice(0, 6)
            .map((template) => (
              <div
                key={template.id}
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 mb-1">
                      {template.title}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {template.body.substring(0, 80)}...
                    </p>
                  </div>
                  <Globe className="w-4 h-4 text-green-500 ml-2" />
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-blue-600 font-medium">
                    {template.usage} uses
                  </span>
                  <span className="text-gray-500">{template.category}</span>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Create/Edit Modal */}
      {(showCreateModal || editingTemplate) && (
        <TemplateModal
          template={editingTemplate}
          onSave={editingTemplate ? handleUpdateTemplate : handleCreateTemplate}
          onCancel={() => {
            setShowCreateModal(false);
            setEditingTemplate(null);
          }}
        />
      )}
    </div>
  );
};

const TemplateModal = ({ template, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: template?.title || "",
    body: template?.body || "",
    category: template?.category || "Professional",
    visibility: template?.visibility || "global",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {template ? "Edit Global Template" : "Create Global Template"}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Template Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter template title"
              required
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Career">Career</option>
                <option value="Business">Business</option>
                <option value="Professional">Professional</option>
                <option value="Personal">Personal</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Visibility
              </label>
              <select
                value={formData.visibility}
                onChange={(e) =>
                  setFormData({ ...formData, visibility: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="global">Global (All Users)</option>
                <option value="private">Private</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Template Content
            </label>
            <textarea
              value={formData.body}
              onChange={(e) =>
                setFormData({ ...formData, body: e.target.value })
              }
              rows={12}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your template content..."
              required
            />
            <p className="text-sm text-gray-500 mt-1">
              Use [placeholders] for dynamic content (e.g., [Name], [Company],
              [Position])
            </p>
          </div>

          <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {template ? "Update Template" : "Create Template"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminTemplates;
