const express = require('express');
const router = express.Router();
const {
  validateUserRegistration,
  validateUserLogin,
  handleValidationErrors
} = require('../middleware/validation');
const { authenticateToken, sensitiveOperationLimit } = require('../middleware/auth');
const {
  register,
  login,
  getMe,
  verifyEmail,
  forgotPassword,
  resetPassword,
  changePassword,
  logout
} = require('../controllers/authController');

// Public routes
router.post('/register', validateUserRegistration, register);
router.post('/login', validateUserLogin, login);
router.post('/verify-email', verifyEmail);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Protected routes
router.get('/me', authenticateToken, getMe);
router.post('/change-password', 
  authenticateToken, 
  sensitiveOperationLimit(),
  changePassword
);
router.post('/logout', authenticateToken, logout);

module.exports = router;