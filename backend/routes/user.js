const express = require('express');
const router = express.Router();
const {
  validateUserUpdate,
  validateObjectId,
  handleValidationErrors
} = require('../middleware/validation');
const { sensitiveOperationLimit } = require('../middleware/auth');
const {
  getProfile,
  updateProfile,
  uploadDocuments,
  getDocuments,
  deleteDocument,
  getStats,
  updateNotificationPreferences,
  deactivateAccount
} = require('../controllers/userController');

// Profile routes
router.get('/profile', getProfile);
router.put('/profile', validateUserUpdate, updateProfile);
router.get('/stats', getStats);

// Document routes
router.post('/documents', uploadDocuments);
router.get('/documents', getDocuments);
router.delete('/documents/:documentId', validateObjectId('documentId'), deleteDocument);

// Settings routes
router.put('/notifications', updateNotificationPreferences);
router.post('/deactivate', 
  sensitiveOperationLimit(15 * 60 * 1000, 3), // 3 attempts per 15 minutes
  deactivateAccount
);

module.exports = router;