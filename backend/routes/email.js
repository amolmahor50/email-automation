const express = require('express');
const router = express.Router();
const {
  validateEmail,
  validateBulkEmail,
  validateObjectId,
  validatePagination,
  validateDateRange,
  handleValidationErrors
} = require('../middleware/validation');
const { checkEmailLimit, requirePlan } = require('../middleware/auth');
const {
  sendEmail,
  scheduleEmail,
  sendBulkEmail,
  getEmails,
  getEmail,
  getEmailAnalytics,
  trackEmailOpen,
  trackEmailClick,
  cancelScheduledEmail,
  resendEmail
} = require('../controllers/emailController');

// Email routes
router.post('/send', validateEmail, checkEmailLimit, sendEmail);
router.post('/schedule', 
  validateEmail, 
  requirePlan(['pro', 'business']), 
  checkEmailLimit, 
  scheduleEmail
);
router.post('/bulk', 
  validateBulkEmail, 
  requirePlan(['business']), 
  sendBulkEmail
);

router.get('/', validatePagination, getEmails);
router.get('/analytics', validateDateRange, getEmailAnalytics);
router.get('/:id', validateObjectId('id'), getEmail);

// Email tracking
router.get('/track/open/:id', trackEmailOpen);
router.get('/track/click/:id', trackEmailClick);

// Email management
router.post('/:id/cancel', validateObjectId('id'), cancelScheduledEmail);
router.post('/:id/resend', validateObjectId('id'), checkEmailLimit, resendEmail);

module.exports = router;