const express = require("express");
const router = express.Router();
const multer = require("multer");

// Memory storage for MongoDB
const upload = multer({ storage: multer.memoryStorage() });

const {
  defaultAttachmentsFiles,
  getTemplates,
  getTemplate,
  createTemplate,
  updateTemplate,
  deleteTemplate,
} = require("../controllers/templateController");

const {
  validateTemplate,
  validateObjectId,
  validatePagination,
} = require("../middleware/validation");

// Template routes
router.get("/", validatePagination, getTemplates);
router.get("/:id", validateObjectId("id"), getTemplate);

// Download attachment
router.get("/:templateId/attachment/:fileId", defaultAttachmentsFiles);

router.post("/", upload.array("attachments"), validateTemplate, createTemplate);
router.put(
  "/:id",
  upload.array("attachments"),
  validateTemplate,
  updateTemplate
);
router.delete("/:id", validateObjectId("id"), deleteTemplate);

module.exports = router;
