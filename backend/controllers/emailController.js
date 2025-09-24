const Email = require('../models/Email');
const User = require('../models/User');
const Template = require('../models/Template');
const { sendEmailService } = require('../services/emailService');
const { scheduleEmailJob } = require('../services/queueService');

// Send email
const sendEmail = async (req, res) => {
  try {
    const { recipients, cc, bcc, subject, body, templateId, attachments, priority } = req.body;

    // Create email record
    const email = new Email({
      userId: req.user.id,
      templateId,
      recipients: recipients.map(email => ({ email })),
      cc: cc || [],
      bcc: bcc || [],
      subject,
      body,
      attachments: attachments || [],
      status: 'sending',
      priority: priority || 'normal',
      metadata: {
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      }
    });

    await email.save();

    // Send email
    try {
      const result = await sendEmailService({
        to: recipients,
        cc,
        bcc,
        subject,
        html: body,
        attachments
      });

      await email.markAsSent(result.messageId, result.providerMessageId);
      
      // Update user email count
      await req.user.incrementEmailCount();

      res.json({
        success: true,
        message: 'Email sent successfully',
        emailId: email._id,
        messageId: result.messageId
      });
    } catch (sendError) {
      await email.markAsFailed(sendError.message);
      throw sendError;
    }
  } catch (error) {
    console.error('Send email error:', error);
    res.status(500).json({ message: 'Failed to send email' });
  }
};

// Schedule email
const scheduleEmail = async (req, res) => {
  try {
    const { recipients, cc, bcc, subject, body, templateId, attachments, scheduledAt } = req.body;

    const scheduleDate = new Date(scheduledAt);
    if (scheduleDate <= new Date()) {
      return res.status(400).json({ message: 'Scheduled time must be in the future' });
    }

    // Create email record
    const email = new Email({
      userId: req.user.id,
      templateId,
      recipients: recipients.map(email => ({ email })),
      cc: cc || [],
      bcc: bcc || [],
      subject,
      body,
      attachments: attachments || [],
      status: 'scheduled',
      scheduledAt: scheduleDate,
      metadata: {
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      }
    });

    await email.save();

    // Schedule email job
    await scheduleEmailJob(email._id, scheduleDate);

    res.json({
      success: true,
      message: 'Email scheduled successfully',
      emailId: email._id,
      scheduledAt: scheduleDate
    });
  } catch (error) {
    console.error('Schedule email error:', error);
    res.status(500).json({ message: 'Failed to schedule email' });
  }
};

// Send bulk email
const sendBulkEmail = async (req, res) => {
  try {
    const { templateId, recipients, subject, customizations } = req.body;

    // Get template
    const template = await Template.findById(templateId);
    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }

    // Create bulk email records
    const emails = [];
    for (const recipient of recipients) {
      let emailBody = template.body;
      
      // Apply customizations
      if (customizations && customizations[recipient.email]) {
        const custom = customizations[recipient.email];
        Object.keys(custom).forEach(key => {
          emailBody = emailBody.replace(new RegExp(`\\[${key}\\]`, 'g'), custom[key]);
        });
      }

      const email = new Email({
        userId: req.user.id,
        templateId,
        recipients: [{ email: recipient.email, name: recipient.name }],
        subject,
        body: emailBody,
        status: 'sending',
        metadata: {
          ipAddress: req.ip,
          userAgent: req.get('User-Agent')
        }
      });

      emails.push(email);
    }

    // Save all emails
    await Email.insertMany(emails);

    // Send emails in batches
    const batchSize = 10;
    let successCount = 0;
    let failureCount = 0;

    for (let i = 0; i < emails.length; i += batchSize) {
      const batch = emails.slice(i, i + batchSize);
      
      await Promise.all(batch.map(async (email) => {
        try {
          const result = await sendEmailService({
            to: [email.recipients[0].email],
            subject: email.subject,
            html: email.body
          });

          await email.markAsSent(result.messageId, result.providerMessageId);
          successCount++;
        } catch (error) {
          await email.markAsFailed(error.message);
          failureCount++;
        }
      }));

      // Small delay between batches
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Update user email count
    req.user.emailStats.sent += successCount;
    req.user.emailStats.thisMonth += successCount;
    await req.user.save();

    res.json({
      success: true,
      message: 'Bulk email processing completed',
      results: {
        total: emails.length,
        successful: successCount,
        failed: failureCount
      }
    });
  } catch (error) {
    console.error('Send bulk email error:', error);
    res.status(500).json({ message: 'Failed to send bulk email' });
  }
};

// Get emails
const getEmails = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const status = req.query.status;
    const sort = req.query.sort || '-createdAt';

    const query = { userId: req.user.id };
    if (status) {
      query.status = status;
    }

    const emails = await Email.find(query)
      .populate('templateId', 'title category')
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await Email.countDocuments(query);

    res.json({
      success: true,
      emails,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get emails error:', error);
    res.status(500).json({ message: 'Failed to get emails' });
  }
};

// Get single email
const getEmail = async (req, res) => {
  try {
    const email = await Email.findOne({
      _id: req.params.id,
      userId: req.user.id
    }).populate('templateId', 'title category');

    if (!email) {
      return res.status(404).json({ message: 'Email not found' });
    }

    res.json({
      success: true,
      email
    });
  } catch (error) {
    console.error('Get email error:', error);
    res.status(500).json({ message: 'Failed to get email' });
  }
};

// Get email analytics
const getEmailAnalytics = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const dateRange = {};
    if (startDate) dateRange.start = startDate;
    if (endDate) dateRange.end = endDate;

    const analytics = await Email.getAnalytics(req.user.id, dateRange);

    res.json({
      success: true,
      analytics: analytics[0] || {
        totalEmails: 0,
        sentEmails: 0,
        totalOpens: 0,
        totalClicks: 0,
        openRate: 0,
        clickRate: 0
      }
    });
  } catch (error) {
    console.error('Get email analytics error:', error);
    res.status(500).json({ message: 'Failed to get email analytics' });
  }
};

// Track email open
const trackEmailOpen = async (req, res) => {
  try {
    const email = await Email.findById(req.params.id);
    if (!email) {
      return res.status(404).send('Email not found');
    }

    await email.trackOpen({
      userAgent: req.get('User-Agent'),
      ip: req.ip
    });

    // Return 1x1 transparent pixel
    const pixel = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
      'base64'
    );

    res.writeHead(200, {
      'Content-Type': 'image/png',
      'Content-Length': pixel.length,
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    });
    res.end(pixel);
  } catch (error) {
    console.error('Track email open error:', error);
    res.status(500).send('Tracking failed');
  }
};

// Track email click
const trackEmailClick = async (req, res) => {
  try {
    const { url } = req.query;
    const email = await Email.findById(req.params.id);
    
    if (!email) {
      return res.status(404).json({ message: 'Email not found' });
    }

    await email.trackClick(url, {
      userAgent: req.get('User-Agent'),
      ip: req.ip
    });

    // Redirect to original URL
    res.redirect(url || '/');
  } catch (error) {
    console.error('Track email click error:', error);
    res.status(500).json({ message: 'Tracking failed' });
  }
};

// Cancel scheduled email
const cancelScheduledEmail = async (req, res) => {
  try {
    const email = await Email.findOne({
      _id: req.params.id,
      userId: req.user.id,
      status: 'scheduled'
    });

    if (!email) {
      return res.status(404).json({ message: 'Scheduled email not found' });
    }

    email.status = 'cancelled';
    await email.save();

    res.json({
      success: true,
      message: 'Scheduled email cancelled successfully'
    });
  } catch (error) {
    console.error('Cancel scheduled email error:', error);
    res.status(500).json({ message: 'Failed to cancel scheduled email' });
  }
};

// Resend email
const resendEmail = async (req, res) => {
  try {
    const originalEmail = await Email.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!originalEmail) {
      return res.status(404).json({ message: 'Email not found' });
    }

    // Create new email record
    const email = new Email({
      userId: req.user.id,
      templateId: originalEmail.templateId,
      recipients: originalEmail.recipients,
      cc: originalEmail.cc,
      bcc: originalEmail.bcc,
      subject: originalEmail.subject,
      body: originalEmail.body,
      attachments: originalEmail.attachments,
      status: 'sending',
      metadata: {
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
        originalEmailId: originalEmail._id
      }
    });

    await email.save();

    // Send email
    try {
      const result = await sendEmailService({
        to: originalEmail.recipients.map(r => r.email),
        cc: originalEmail.cc.map(r => r.email),
        bcc: originalEmail.bcc.map(r => r.email),
        subject: originalEmail.subject,
        html: originalEmail.body,
        attachments: originalEmail.attachments
      });

      await email.markAsSent(result.messageId, result.providerMessageId);
      await req.user.incrementEmailCount();

      res.json({
        success: true,
        message: 'Email resent successfully',
        emailId: email._id
      });
    } catch (sendError) {
      await email.markAsFailed(sendError.message);
      throw sendError;
    }
  } catch (error) {
    console.error('Resend email error:', error);
    res.status(500).json({ message: 'Failed to resend email' });
  }
};

module.exports = {
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
};