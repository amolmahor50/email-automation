const express = require('express');
const router = express.Router();
const { requireAdmin } = require('../middleware/auth');
const {
  validateAdminUserUpdate,
  validateTemplate,
  validateObjectId,
  validatePagination,
  validateDateRange,
  handleValidationErrors
} = require('../middleware/validation');
const {
  getDashboardStats,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  suspendUser,
  activateUser,
  getSystemLogs,
  getRevenueAnalytics,
  getEmailAnalytics,
  createGlobalTemplate,
  updateGlobalTemplate,
  deleteGlobalTemplate,
  getSystemSettings,
  updateSystemSettings
} = require('../controllers/adminController');

// Apply admin middleware to all routes
router.use(requireAdmin);

// Dashboard
router.get('/dashboard', getDashboardStats);

// User management
router.get('/users', validatePagination, getUsers);
router.get('/users/:id', validateObjectId('id'), getUser);
router.put('/users/:id', validateObjectId('id'), validateAdminUserUpdate, updateUser);
router.delete('/users/:id', validateObjectId('id'), deleteUser);
router.post('/users/:id/suspend', validateObjectId('id'), suspendUser);
router.post('/users/:id/activate', validateObjectId('id'), activateUser);

// Analytics
router.get('/revenue', validateDateRange, getRevenueAnalytics);
router.get('/emails', validateDateRange, getEmailAnalytics);

// Template management
router.post('/templates', validateTemplate, createGlobalTemplate);
router.put('/templates/:id', validateObjectId('id'), validateTemplate, updateGlobalTemplate);
router.delete('/templates/:id', validateObjectId('id'), deleteGlobalTemplate);

// System management
router.get('/logs', validatePagination, getSystemLogs);
router.get('/settings', getSystemSettings);
router.put('/settings', updateSystemSettings);

module.exports = router;