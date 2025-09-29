const Template = require("../models/Template");
const path = require("path");

// Helper to convert defaultAttachments to attachments with URLs
const formatAttachments = (attachments) => {
  return (attachments || []).map((file) => ({
    filename: file.filename,
    originalName: file.originalName,
    path: file.path,
    size: file.size,
    url: `/uploads/${file.filename}`,
  }));
};

// Get all templates
const getTemplates = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const sort = req.query.sort || "-createdAt";
    const category = req.query.category;
    const visibility = req.query.visibility;

    const query = {
      $or: [{ visibility: "global" }, { ownerId: req.user.id }],
      isActive: true,
    };

    if (category) query.category = category;
    if (visibility) query.visibility = visibility;

    const templates = await Template.find(query)
      .populate("ownerId", "name email")
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await Template.countDocuments(query);

    // Map attachments
    const formattedTemplates = templates.map((t) => ({
      ...t.toObject(),
      attachments: formatAttachments(t.defaultAttachments),
    }));

    res.json({
      success: true,
      templates: formattedTemplates,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get templates error:", error);
    res.status(500).json({ message: "Failed to get templates" });
  }
};

// Get single template
const getTemplate = async (req, res) => {
  try {
    const template = await Template.findOne({
      _id: req.params.id,
      $or: [{ visibility: "global" }, { ownerId: req.user.id }],
      isActive: true,
    }).populate("ownerId", "name email");

    if (!template)
      return res.status(404).json({ message: "Template not found" });

    res.json({
      success: true,
      template: {
        ...template.toObject(),
        attachments: formatAttachments(template.defaultAttachments),
      },
    });
  } catch (error) {
    console.error("Get template error:", error);
    res.status(500).json({ message: "Failed to get template" });
  }
};

// Create template
const createTemplate = async (req, res) => {
  try {
    const { title, body, category, visibility, tags } = req.body;

    // Create template
    const defaultAttachments =
      req.files?.map((file) => ({
        filename: file.filename,
        originalName: file.originalname,
        path: file.path,
        size: file.size,
        url: `/uploads/${file.filename}`, // <-- fixed URL
      })) || [];

    if (visibility === "global" && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Only admins can create global templates" });
    }

    const template = new Template({
      title,
      body,
      category,
      visibility: visibility || "private",
      ownerId: visibility === "global" ? null : req.user.id,
      defaultAttachments,
      tags: tags ? [].concat(tags) : [],
    });

    await template.save();
    await template.populate("ownerId", "name email");

    res.status(201).json({
      success: true,
      message: "Template created successfully",
      template,
    });
  } catch (error) {
    console.error("Create template error:", error);
    res.status(500).json({ message: "Failed to create template" });
  }
};

// Update template
const updateTemplate = async (req, res) => {
  try {
    // Destructure from req.body
    let { title, body, category, visibility, tags } = req.body;

    // console.log("BODY:", req.body);
    // console.log("FILES:", req.files);

    // Convert tags to array if it's a string
    if (tags && typeof tags === "string") {
      tags = tags.split(",").map((t) => t.trim());
    }

    const template = await Template.findOne({
      _id: req.params.id,
      $or: [{ ownerId: req.user.id }, { visibility: "global", ownerId: null }],
    });

    if (!template)
      return res.status(404).json({ message: "Template not found" });

    if (template.visibility === "global" && req.user.role !== "admin")
      return res
        .status(403)
        .json({ message: "Only admins can update global templates" });

    if (visibility === "global" && req.user.role !== "admin")
      return res
        .status(403)
        .json({ message: "Only admins can create global templates" });

    // Update fields
    template.title = title ?? template.title;
    template.body = body ?? template.body;
    template.category = category ?? template.category;
    template.visibility = visibility ?? template.visibility;
    template.tags = tags || template.tags;

    // Merge attachments
    if (req.files && req.files.length > 0) {
      const uploadedFiles = req.files.map((file) => ({
        filename: file.filename,
        originalName: file.originalname,
        path: file.path,
        size: file.size,
        url: `/uploads/${file.filename}`,
      }));

      template.defaultAttachments = [
        ...(template.defaultAttachments || []),
        ...uploadedFiles,
      ];
    }

    if (visibility === "global") template.ownerId = null;

    await template.save();
    await template.populate("ownerId", "name email");

    res.json({
      success: true,
      message: "Template updated successfully",
      template,
    });
  } catch (error) {
    console.error("Update template error:", error);
    res.status(500).json({ message: "Failed to update template" });
  }
};

// Delete template
const deleteTemplate = async (req, res) => {
  try {
    const template = await Template.findOne({
      _id: req.params.id,
      $or: [{ ownerId: req.user.id }, { visibility: "global", ownerId: null }],
    });

    if (!template)
      return res.status(404).json({ message: "Template not found" });

    if (template.visibility === "global" && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Only admins can delete global templates" });
    }

    template.isActive = false;
    await template.save();

    res.json({ success: true, message: "Template deleted successfully" });
  } catch (error) {
    console.error("Delete template error:", error);
    res.status(500).json({ message: "Failed to delete template" });
  }
};

// Get popular templates
const getPopularTemplates = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const templates = await Template.getPopular(limit);

    res.json({ success: true, templates });
  } catch (error) {
    console.error("Get popular templates error:", error);
    res.status(500).json({ message: "Failed to get popular templates" });
  }
};

// Search templates
const searchTemplates = async (req, res) => {
  try {
    const { q, category, sort, limit } = req.query;

    const options = {
      category,
      sort: sort || { "usage.count": -1 },
      limit: parseInt(limit) || 20,
    };

    const templates = await Template.search(q, req.user.id, options);

    res.json({ success: true, templates, query: q });
  } catch (error) {
    console.error("Search templates error:", error);
    res.status(500).json({ message: "Failed to search templates" });
  }
};

// Use template
const useTemplate = async (req, res) => {
  try {
    const template = await Template.findOne({
      _id: req.params.id,
      $or: [{ visibility: "global" }, { ownerId: req.user.id }],
      isActive: true,
    });

    if (!template)
      return res.status(404).json({ message: "Template not found" });

    await template.incrementUsage(req.user.id);

    res.json({
      success: true,
      message: "Template usage recorded",
      template: {
        id: template._id,
        title: template.title,
        body: template.body,
        category: template.category,
        defaultAttachments: template.defaultAttachments,
      },
    });
  } catch (error) {
    console.error("Use template error:", error);
    res.status(500).json({ message: "Failed to use template" });
  }
};

module.exports = {
  getTemplates,
  getTemplate,
  createTemplate,
  updateTemplate,
  deleteTemplate,
  getPopularTemplates,
  searchTemplates,
  useTemplate,
};
