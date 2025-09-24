const User = require('../models/User');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../../uploads/documents');
    try {
      await fs.mkdir(uploadPath, { recursive: true });
      cb(null, uploadPath);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `${req.user.id}-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|txt/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only images, PDFs, and documents are allowed.'));
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
    files: 5
  },
  fileFilter
});

// Get user profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        subscription: user.subscription,
        profile: user.profile,
        emailStats: user.emailStats,
        isEmailVerified: user.isEmailVerified,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Failed to get profile' });
  }
};

// Update user profile
const updateProfile = async (req, res) => {
  try {
    const { name, profile } = req.body;
    const user = await User.findById(req.user.id);

    if (name) user.name = name;
    if (profile) {
      user.profile = { ...user.profile, ...profile };
    }

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        subscription: user.subscription,
        profile: user.profile,
        emailStats: user.emailStats,
        isEmailVerified: user.isEmailVerified,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Failed to update profile' });
  }
};

// Upload documents
const uploadDocuments = async (req, res) => {
  try {
    upload.array('documents', 5)(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ message: err.message });
      }

      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: 'No files uploaded' });
      }

      const user = await User.findById(req.user.id);
      
      // Add new documents to user profile
      const newDocuments = req.files.map(file => ({
        filename: file.filename,
        originalName: file.originalname,
        path: file.path,
        size: file.size,
        uploadDate: new Date()
      }));

      user.profile.documents.push(...newDocuments);
      await user.save();

      res.json({
        success: true,
        message: 'Documents uploaded successfully',
        documents: newDocuments
      });
    });
  } catch (error) {
    console.error('Upload documents error:', error);
    res.status(500).json({ message: 'Failed to upload documents' });
  }
};

// Get user documents
const getDocuments = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({
      success: true,
      documents: user.profile.documents
    });
  } catch (error) {
    console.error('Get documents error:', error);
    res.status(500).json({ message: 'Failed to get documents' });
  }
};

// Delete document
const deleteDocument = async (req, res) => {
  try {
    const { documentId } = req.params;
    const user = await User.findById(req.user.id);

    const documentIndex = user.profile.documents.findIndex(
      doc => doc._id.toString() === documentId
    );

    if (documentIndex === -1) {
      return res.status(404).json({ message: 'Document not found' });
    }

    const document = user.profile.documents[documentIndex];

    // Delete file from filesystem
    try {
      await fs.unlink(document.path);
    } catch (fileError) {
      console.error('Failed to delete file:', fileError);
      // Continue with database deletion even if file deletion fails
    }

    // Remove from database
    user.profile.documents.splice(documentIndex, 1);
    await user.save();

    res.json({
      success: true,
      message: 'Document deleted successfully'
    });
  } catch (error) {
    console.error('Delete document error:', error);
    res.status(500).json({ message: 'Failed to delete document' });
  }
};

// Get user statistics
const getStats = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    // Get additional stats from related collections
    const Email = require('../models/Email');
    const Template = require('../models/Template');
    
    const [emailStats, templateStats] = await Promise.all([
      Email.getAnalytics(req.user.id),
      Template.countDocuments({ ownerId: req.user.id, isActive: true })
    ]);

    res.json({
      success: true,
      stats: {
        emailStats: emailStats[0] || {
          totalEmails: 0,
          sentEmails: 0,
          totalOpens: 0,
          totalClicks: 0,
          openRate: 0,
          clickRate: 0
        },
        templateCount: templateStats,
        subscription: user.subscription,
        monthlyEmailUsage: {
          used: user.emailStats.thisMonth,
          limit: user.subscription.plan === 'free' ? 50 : 
                 user.subscription.plan === 'pro' ? 500 : 5000
        }
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Failed to get statistics' });
  }
};

// Update notification preferences
const updateNotificationPreferences = async (req, res) => {
  try {
    const { preferences } = req.body;
    const user = await User.findById(req.user.id);

    user.profile.notificationPreferences = {
      ...user.profile.notificationPreferences,
      ...preferences
    };

    await user.save();

    res.json({
      success: true,
      message: 'Notification preferences updated successfully',
      preferences: user.profile.notificationPreferences
    });
  } catch (error) {
    console.error('Update notification preferences error:', error);
    res.status(500).json({ message: 'Failed to update notification preferences' });
  }
};

// Deactivate account
const deactivateAccount = async (req, res) => {
  try {
    const { password } = req.body;
    const user = await User.findById(req.user.id).select('+password');

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    user.isActive = false;
    await user.save();

    res.json({
      success: true,
      message: 'Account deactivated successfully'
    });
  } catch (error) {
    console.error('Deactivate account error:', error);
    res.status(500).json({ message: 'Failed to deactivate account' });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  uploadDocuments,
  getDocuments,
  deleteDocument,
  getStats,
  updateNotificationPreferences,
  deactivateAccount
};