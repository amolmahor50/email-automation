const mongoose = require('mongoose');

const emailSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  templateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Template'
  },
  recipients: [{
    email: {
      type: String,
      required: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    name: String,
    status: {
      type: String,
      enum: ['pending', 'sent', 'delivered', 'opened', 'clicked', 'bounced', 'failed'],
      default: 'pending'
    }
  }],
  cc: [{
    email: String,
    name: String
  }],
  bcc: [{
    email: String,
    name: String
  }],
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    maxlength: [200, 'Subject cannot exceed 200 characters']
  },
  body: {
    type: String,
    required: [true, 'Email body is required'],
    maxlength: [50000, 'Email body cannot exceed 50000 characters']
  },
  attachments: [{
    filename: String,
    originalName: String,
    path: String,
    size: Number,
    mimeType: String
  }],
  status: {
    type: String,
    enum: ['draft', 'scheduled', 'sending', 'sent', 'failed', 'cancelled'],
    default: 'draft'
  },
  scheduledAt: Date,
  sentAt: Date,
  analytics: {
    opens: {
      type: Number,
      default: 0
    },
    clicks: {
      type: Number,
      default: 0
    },
    bounces: {
      type: Number,
      default: 0
    },
    openEvents: [{
      timestamp: Date,
      userAgent: String,
      ip: String,
      location: String
    }],
    clickEvents: [{
      timestamp: Date,
      url: String,
      userAgent: String,
      ip: String,
      location: String
    }]
  },
  metadata: {
    messageId: String,
    provider: {
      type: String,
      enum: ['nodemailer', 'sendgrid', 'mailgun'],
      default: 'nodemailer'
    },
    providerMessageId: String,
    ipAddress: String,
    userAgent: String
  },
  bulkEmailId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BulkEmail'
  },
  priority: {
    type: String,
    enum: ['low', 'normal', 'high'],
    default: 'normal'
  },
  tags: [String],
  isTest: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Indexes
emailSchema.index({ userId: 1, createdAt: -1 });
emailSchema.index({ status: 1 });
emailSchema.index({ scheduledAt: 1 });
emailSchema.index({ 'recipients.email': 1 });
emailSchema.index({ templateId: 1 });
emailSchema.index({ bulkEmailId: 1 });

// Method to track email open
emailSchema.methods.trackOpen = function(data = {}) {
  this.analytics.opens += 1;
  this.analytics.openEvents.push({
    timestamp: new Date(),
    userAgent: data.userAgent,
    ip: data.ip,
    location: data.location
  });
  
  // Update recipient status
  if (data.recipientEmail) {
    const recipient = this.recipients.find(r => r.email === data.recipientEmail);
    if (recipient && recipient.status === 'sent') {
      recipient.status = 'opened';
    }
  }
  
  return this.save();
};

// Method to track email click
emailSchema.methods.trackClick = function(url, data = {}) {
  this.analytics.clicks += 1;
  this.analytics.clickEvents.push({
    timestamp: new Date(),
    url,
    userAgent: data.userAgent,
    ip: data.ip,
    location: data.location
  });
  
  // Update recipient status
  if (data.recipientEmail) {
    const recipient = this.recipients.find(r => r.email === data.recipientEmail);
    if (recipient && ['sent', 'opened'].includes(recipient.status)) {
      recipient.status = 'clicked';
    }
  }
  
  return this.save();
};

// Method to mark as sent
emailSchema.methods.markAsSent = function(messageId, providerMessageId) {
  this.status = 'sent';
  this.sentAt = new Date();
  this.metadata.messageId = messageId;
  this.metadata.providerMessageId = providerMessageId;
  
  // Update all recipients to sent status
  this.recipients.forEach(recipient => {
    if (recipient.status === 'pending') {
      recipient.status = 'sent';
    }
  });
  
  return this.save();
};

// Method to mark as failed
emailSchema.methods.markAsFailed = function(error) {
  this.status = 'failed';
  this.metadata.error = error;
  
  // Update all recipients to failed status
  this.recipients.forEach(recipient => {
    if (recipient.status === 'pending') {
      recipient.status = 'failed';
    }
  });
  
  return this.save();
};

// Static method to get analytics for user
emailSchema.statics.getAnalytics = function(userId, dateRange = {}) {
  const matchQuery = { userId };
  
  if (dateRange.start || dateRange.end) {
    matchQuery.createdAt = {};
    if (dateRange.start) matchQuery.createdAt.$gte = new Date(dateRange.start);
    if (dateRange.end) matchQuery.createdAt.$lte = new Date(dateRange.end);
  }
  
  return this.aggregate([
    { $match: matchQuery },
    {
      $group: {
        _id: null,
        totalEmails: { $sum: 1 },
        sentEmails: {
          $sum: { $cond: [{ $eq: ['$status', 'sent'] }, 1, 0] }
        },
        totalOpens: { $sum: '$analytics.opens' },
        totalClicks: { $sum: '$analytics.clicks' },
        totalBounces: { $sum: '$analytics.bounces' },
        uniqueOpens: {
          $sum: { $cond: [{ $gt: ['$analytics.opens', 0] }, 1, 0] }
        }
      }
    },
    {
      $project: {
        _id: 0,
        totalEmails: 1,
        sentEmails: 1,
        totalOpens: 1,
        totalClicks: 1,
        totalBounces: 1,
        uniqueOpens: 1,
        openRate: {
          $cond: [
            { $gt: ['$sentEmails', 0] },
            { $multiply: [{ $divide: ['$uniqueOpens', '$sentEmails'] }, 100] },
            0
          ]
        },
        clickRate: {
          $cond: [
            { $gt: ['$sentEmails', 0] },
            { $multiply: [{ $divide: ['$totalClicks', '$sentEmails'] }, 100] },
            0
          ]
        },
        bounceRate: {
          $cond: [
            { $gt: ['$sentEmails', 0] },
            { $multiply: [{ $divide: ['$totalBounces', '$sentEmails'] }, 100] },
            0
          ]
        }
      }
    }
  ]);
};

module.exports = mongoose.model('Email', emailSchema);