const Template = require("../models/Template");

const defaultAttachmentsFiles = async (req, res) => {
  try {
    const { templateId, fileId } = req.params;
    const template = await Template.findById(templateId);

    if (!template) return res.status(404).send("Template not found");

    const file = template.defaultAttachments.id(fileId);
    if (!file) return res.status(404).send("File not found");

    res.set({
      "Content-Type": file.mimeType,
      "Content-Disposition": `attachment; filename="${file.originalName}"`,
    });

    res.send(file.data); // send buffer directly
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to download file");
  }
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

    res.json({
      success: true,
      templates,
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

    res.json({ success: true, template });
  } catch (error) {
    console.error("Get template error:", error);
    res.status(500).json({ message: "Failed to get template" });
  }
};

// Create template
const createTemplate = async (req, res) => {
  try {
    let { title, body, category, visibility, tags } = req.body;

    if (typeof tags === "string") {
      try {
        tags = JSON.parse(tags);
        if (!Array.isArray(tags)) tags = [];
      } catch (err) {
        tags = [];
      }
    } else if (!Array.isArray(tags)) {
      tags = [];
    }

    const defaultAttachments =
      req.files?.map((file) => ({
        filename: file.originalname,
        originalName: file.originalname,
        size: file.size,
        mimeType: file.mimetype,
        data: file.buffer,
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
      tags,
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
    let { title, body, category, visibility, tags } = req.body;

    if (typeof tags === "string") {
      try {
        tags = JSON.parse(tags);
        if (!Array.isArray(tags)) tags = [];
      } catch (err) {
        tags = [];
      }
    } else if (!Array.isArray(tags)) {
      tags = [];
    }

    const template = await Template.findOne({
      _id: req.params.id,
      $or: [{ ownerId: req.user.id }, { visibility: "global", ownerId: null }],
    });

    if (!template)
      return res.status(404).json({ message: "Template not found" });

    if (template.visibility === "global" && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Only admins can update global templates" });
    }

    template.title = title ?? template.title;
    template.body = body ?? template.body;
    template.category = category ?? template.category;
    template.visibility = visibility ?? template.visibility;
    template.tags = tags.length > 0 ? tags : template.tags;

    if (req.files && req.files.length > 0) {
      const uploadedFiles = req.files.map((file) => ({
        filename: file.originalname,
        originalName: file.originalname,
        size: file.size,
        mimeType: file.mimetype,
        data: file.buffer,
      }));

      template.defaultAttachments.push(...uploadedFiles);
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

// Popular / Search / Use remain same
module.exports = {
  defaultAttachmentsFiles,
  getTemplates,
  getTemplate,
  createTemplate,
  updateTemplate,
  deleteTemplate,
};
