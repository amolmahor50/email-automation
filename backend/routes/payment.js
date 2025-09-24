const express = require('express');
const router = express.Router();
const {
  validatePayment,
  validateObjectId,
  validatePagination,
  handleValidationErrors
} = require('../middleware/validation');
const {
  createCheckoutSession,
  handleWebhook,
  getPaymentHistory,
  getPayment,
  cancelSubscription,
  updateSubscription,
  downloadInvoice
} = require('../controllers/paymentController');

// Payment routes
router.post('/create-session', validatePayment, createCheckoutSession);
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

router.get('/history', validatePagination, getPaymentHistory);
router.get('/:id', validateObjectId('id'), getPayment);
router.get('/:id/invoice', validateObjectId('id'), downloadInvoice);

// Subscription management
router.post('/cancel-subscription', cancelSubscription);
router.put('/update-subscription', updateSubscription);

module.exports = router;