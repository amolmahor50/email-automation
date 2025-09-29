"use client";

import React, { useState } from "react";
import { useApp } from "@/contexts/AppContext";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

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
import { Upload, X } from "lucide-react";

import QuillEditor from "@/components/QuillEditor";
import "react-quill-new/dist/quill.snow.css";

const CreateTemplate = () => {
  const { addTemplate } = useApp();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    body: "",
    category: "Professional",
    visibility: "private",
    attachments: [],
  });

  // Handle multiple file upload
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({
      ...prev,
      attachments: [...prev.attachments, ...files],
    }));
  };

  // Remove file
  const removeAttachment = (index) => {
    const updated = [...formData.attachments];
    updated.splice(index, 1);
    setFormData((prev) => ({ ...prev, attachments: updated }));
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.body) {
      toast.error("Please fill all required fields.");
      return;
    }

    try {
      const payload = new FormData();
      payload.append("title", formData.title);
      payload.append("body", formData.body);
      payload.append("category", formData.category);
      payload.append("visibility", formData.visibility);
      formData.attachments.forEach((file) =>
        payload.append("attachments", file)
      );

      await addTemplate(payload);
      toast.success("Template created!");
      navigate("/templates");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create template");
    }
  };

  return (
    <div className="space-y-6">
      <TypographyH2>Create Template</TypographyH2>
      <Card>
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
                <SelectItem value="Career">Career</SelectItem>
                <SelectItem value="Business">Business</SelectItem>
                <SelectItem value="Professional">Professional</SelectItem>
                <SelectItem value="Personal">Personal</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Body (Rich Text Editor + Preview) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Body</Label>
              <div className="min-h-[200px]">
                <QuillEditor
                  value={formData.body}
                  onChange={(value) =>
                    setFormData({ ...formData, body: value })
                  }
                />
              </div>
            </div>
            <div className="space-y-2 mt-22 md:mt-0">
              <Label>Preview</Label>
              <div
                className="prose max-w-full h-[200px] md:h-[255px] overflow-y-auto border p-2 text-sm"
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
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 space-y-3 text-center">
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

            {formData.attachments.length > 0 && (
              <>
                <TypographyH5>Attachments</TypographyH5>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {formData.attachments.map((file, index) => {
                    const isImage = file.type.startsWith("image/");
                    const isPDF = file.type === "application/pdf";
                    const isCSV =
                      file.type === "text/csv" ||
                      file.name.toLowerCase().endsWith(".csv");

                    return (
                      <div
                        key={index}
                        className="border p-2 rounded flex flex-col gap-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs truncate max-w-[150px]">
                            {file.name}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeAttachment(index)}
                            className="text-red-500"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        {isImage && (
                          <img
                            src={URL.createObjectURL(file)}
                            alt={file.name}
                            className="max-h-40 w-full object-cover rounded border"
                          />
                        )}

                        {isPDF && (
                          <iframe
                            src={URL.createObjectURL(file)}
                            className="w-full h-40 border rounded"
                            title={file.name}
                          />
                        )}

                        {isCSV && (
                          <div className="p-2 bg-gray-100 rounded text-xs">
                            CSV File: {file.name}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </>
            )}
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
              Create Template
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default CreateTemplate;
