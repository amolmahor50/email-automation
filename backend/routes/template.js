const express = require("express");
const router = express.Router();

const uploads = require("../middleware/uploads");

const {
  validateTemplate,
  validateObjectId,
  validatePagination,
  handleValidationErrors,
} = require("../middleware/validation");

const {
  getTemplates,
  getTemplate,
  createTemplate,
  updateTemplate,
  deleteTemplate,
  getPopularTemplates,
  searchTemplates,
  useTemplate,
} = require("../controllers/templateController");

// Template routes
router.get("/", validatePagination, getTemplates);
router.get("/popular", getPopularTemplates);
router.get("/search", searchTemplates);
router.get("/:id", validateObjectId("id"), getTemplate);

//  use uploads.array("attachments") before validateTemplate
router.post(
  "/",
  uploads.array("attachments"),
  validateTemplate,
  createTemplate
);
router.put(
  "/:id",
  uploads.array("attachments"),
  validateTemplate,
  updateTemplate
);

router.delete("/:id", validateObjectId("id"), deleteTemplate);
router.post("/:id/use", validateObjectId("id"), useTemplate);

module.exports = router;
