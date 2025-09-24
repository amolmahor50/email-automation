const express = require('express');
const router = express.Router();
const {
  validateTemplate,
  validateObjectId,
  validatePagination,
  handleValidationErrors
} = require('../middleware/validation');
const {
  getTemplates,
  getTemplate,
  createTemplate,
  updateTemplate,
  deleteTemplate,
  getPopularTemplates,
  searchTemplates,
  useTemplate
} = require('../controllers/templateController');

// Template routes
router.get('/', validatePagination, getTemplates);
router.get('/popular', getPopularTemplates);
router.get('/search', searchTemplates);
router.get('/:id', validateObjectId('id'), getTemplate);
router.post('/', validateTemplate, createTemplate);
router.put('/:id', validateObjectId('id'), validateTemplate, updateTemplate);
router.delete('/:id', validateObjectId('id'), deleteTemplate);
router.post('/:id/use', validateObjectId('id'), useTemplate);

module.exports = router;