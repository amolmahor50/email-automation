"use client";

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { templateService } from "@/services/templateService";

import {
  TypographyH2,
  TypographyH5,
  TypographyMuted,
} from "@/components/custom/Typography";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { X, Upload, Download } from "lucide-react";

import QuillEditor from "@/components/QuillEditor";
import "react-quill-new/dist/quill.snow.css";
import { useApp } from "@/contexts/AppContext";

/* ---------------- Tags Input Component ---------------- */
const TagsInput = ({ value, onChange }) => {
  const [inputValue, setInputValue] = useState("");

  const handleAddTag = () => {
    const trimmed = inputValue.trim();
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed]);
      setInputValue("");
    }
  };

  const handleRemoveTag = (tag) => onChange(value.filter((t) => t !== tag));

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Add a tag and press Enter"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAddTag();
            }
          }}
        />
        <Button type="button" onClick={handleAddTag}>
          Add
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {value.map((tag, i) => (
          <span
            key={i}
            className="bg-gray-200 px-3 py-1 rounded-full flex items-center gap-1 text-sm"
          >
            {tag}
            <X
              className="w-4 h-4 cursor-pointer text-red-500"
              onClick={() => handleRemoveTag(tag)}
            />
          </span>
        ))}
      </div>
    </div>
  );
};

/* ---------------- Main Edit Template Component ---------------- */
const EditTemplate = () => {
  const { loading, setLoading, updateTemplate } = useApp();
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    body: "",
    category: "Professional",
    visibility: "private",
    attachments: [], // existing + new files
    tags: [], // existing + new tags
  });

  /* ---------------- Fetch Template ---------------- */
  useEffect(() => {
    const fetchTemplate = async () => {
      setLoading(true);
      try {
        const template = await templateService.getTemplate(id);

        // Map attachments to include url for download
        const attachmentsWithUrl = (template.defaultAttachments || []).map(
          (file) => ({
            ...file,
            url: `/api/templates/${template._id}/attachment/${file._id}`,
            isNew: false, // mark as existing file
          })
        );

        setFormData({
          title: template.title || "",
          body: template.body || "",
          category: template.category || "Professional",
          visibility: template.visibility || "private",
          attachments: attachmentsWithUrl,
          tags: template.tags || [],
        });
      } catch (err) {
        console.error(err);
        toast.error("Failed to load template");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchTemplate();
  }, [id]);

  /* ---------------- Handle File Upload ---------------- */
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({
      ...prev,
      attachments: [...prev.attachments, ...files],
    }));
  };

  /* ---------------- Remove Attachment ---------------- */
  const removeAttachment = (index) => {
    setFormData((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index),
    }));
  };

  /* ---------------- Submit Updated Template ---------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = new FormData();
      payload.append("title", formData.title);
      payload.append("body", formData.body);
      payload.append("category", formData.category);
      payload.append("visibility", formData.visibility);
      payload.append("tags", JSON.stringify(formData.tags));

      // Only append new files
      formData.attachments.forEach((file) => {
        if (file.isNew) {
          payload.append("attachments", file.file);
        }
      });

      await updateTemplate(id, payload);
      toast.success("Template updated!");
      navigate("/templates");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to update template");
    }
  };

  /* ---------------- Download Attachment ---------------- */
  const downloadFile = (file) => {
    if (file.isNew) {
      // new file from input
      const link = document.createElement("a");
      link.href = URL.createObjectURL(file.file);
      link.download = file.file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      // existing file from MongoDB
      const link = document.createElement("a");
      link.href = file.url;
      link.download = file.originalName || file.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );

  return (
    <div className="space-y-6">
      <TypographyH2>Edit Template</TypographyH2>
      <Card className="p-4 md:p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
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
              value={formData.category}
              onValueChange={(v) => setFormData({ ...formData, category: v })}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {["Career", "Business", "Professional", "Personal"].map(
                  (cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Tags */}
          <div className="grid gap-2">
            <Label>Tags</Label>
            <TagsInput
              value={formData.tags}
              onChange={(tags) => setFormData({ ...formData, tags })}
            />
          </div>

          {/* Body + Preview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Body</Label>
              <QuillEditor
                value={formData.body}
                onChange={(value) => setFormData({ ...formData, body: value })}
              />
            </div>
            <div className="space-y-2 mt-22 md:mt-0">
              <Label>Preview</Label>
              <div
                className="prose max-w-full h-[200px] md:h-[250px] overflow-y-auto border rounded p-2 text-sm"
                dangerouslySetInnerHTML={{
                  __html:
                    formData.body || "<p>Body content will appear here...</p>",
                }}
              />
            </div>
          </div>

          {/* Attachments */}
          <div className="grid gap-2">
            <Label>Attachments</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 space-y-2 text-center">
              <Upload className="w-10 h-10 text-gray-400 mx-auto" />
              <TypographyH5>Upload Documents</TypographyH5>
              <TypographyMuted className="text-xs md:text-sm">
                Drag and drop files here or click to browse. Supported: PDF,
                DOC, DOCX, CSV, JPG, PNG
              </TypographyMuted>
              <Input
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.csv,.jpg,.jpeg,.png"
                className="hidden"
                id="file-upload"
                onChange={handleFileChange}
              />
              <label
                htmlFor="file-upload"
                className="bg-primary text-white px-4 py-2 rounded-full hover:bg-primary/90 transition-colors cursor-pointer inline-block text-sm"
              >
                Choose Files
              </label>
            </div>

            {formData.attachments.map((file, idx) => {
              const fileType = file.isNew ? file.file.type : file.mimeType;
              const fileName = file.isNew
                ? file.file.name
                : file.originalName || file.filename;

              return (
                <div
                  key={idx}
                  className="border p-2 rounded flex flex-col gap-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs truncate max-w-[150px]">
                      {fileName}
                    </span>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => downloadFile(file)}
                        className="text-green-500"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeAttachment(idx)}
                        className="text-red-500"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {fileType.startsWith("image/") && (
                    <img
                      src={
                        file.isNew ? URL.createObjectURL(file.file) : file.url
                      }
                      alt={fileName}
                      className="max-h-40 w-full object-cover rounded border"
                    />
                  )}

                  {fileType === "application/pdf" && (
                    <iframe
                      src={
                        file.isNew ? URL.createObjectURL(file.file) : file.url
                      }
                      className="w-full h-40 border rounded"
                      title={fileName}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row justify-end gap-2 pt-4">
            <Button
              variant="outline"
              type="button"
              onClick={() => navigate("/templates")}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button type="submit" className="w-full sm:w-auto">
              Update Template
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default EditTemplate;
