const Bull = require('bull');
const Redis = require('redis');
const { sendEmailService } = require('./emailService');
const Email = require('../models/Email');

// Create Redis connection
const redisClient = Redis.createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

redisClient.on('error', (err) => {
  console.error('Redis connection error:', err);
});

redisClient.on('connect', () => {
  console.log('Connected to Redis');
});

// Create email queue
const emailQueue = new Bull('email queue', {
  redis: {
    port: process.env.REDIS_PORT || 6379,
    host: process.env.REDIS_HOST || 'localhost',
    password: process.env.REDIS_PASSWORD || undefined
  },
  defaultJobOptions: {
    removeOnComplete: 100,
    removeOnFail: 50,
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000
    }
  }
});

// Process email jobs
emailQueue.process('send-email', async (job) => {
  const { emailId } = job.data;
  
  try {
    const email = await Email.findById(emailId);
    if (!email) {
      throw new Error('Email not found');
    }

    if (email.status !== 'scheduled') {
      console.log(`Email ${emailId} is not in scheduled status, skipping`);
      return;
    }

    // Send the email
    const result = await sendEmailService({
      to: email.recipients.map(r => r.email),
      cc: email.cc?.map(r => r.email),
      bcc: email.bcc?.map(r => r.email),
      subject: email.subject,
      html: email.body,
      attachments: email.attachments
    });

    // Mark as sent
    await email.markAsSent(result.messageId, result.providerMessageId);
    
    console.log(`Email ${emailId} sent successfully`);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error(`Failed to send email ${emailId}:`, error);
    
    // Mark as failed
    const email = await Email.findById(emailId);
    if (email) {
      await email.markAsFailed(error.message);
    }
    
    throw error;
  }
});

// Process bulk email jobs
emailQueue.process('send-bulk-email', async (job) => {
  const { emails } = job.data;
  const results = { successful: 0, failed: 0 };
  
  for (const emailData of emails) {
    try {
      const result = await sendEmailService(emailData);
      results.successful++;
      
      // Update email status if emailId is provided
      if (emailData.emailId) {
        const email = await Email.findById(emailData.emailId);
        if (email) {
          await email.markAsSent(result.messageId, result.providerMessageId);
        }
      }
    } catch (error) {
      console.error('Failed to send bulk email:', error);
      results.failed++;
      
      // Update email status if emailId is provided
      if (emailData.emailId) {
        const email = await Email.findById(emailData.emailId);
        if (email) {
          await email.markAsFailed(error.message);
        }
      }
    }
    
    // Small delay between emails to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  return results;
});

// Queue event listeners
emailQueue.on('completed', (job, result) => {
  console.log(`Job ${job.id} completed with result:`, result);
});

emailQueue.on('failed', (job, err) => {
  console.error(`Job ${job.id} failed:`, err.message);
});

emailQueue.on('stalled', (job) => {
  console.warn(`Job ${job.id} stalled`);
});

// Schedule email job
const scheduleEmailJob = async (emailId, scheduleDate) => {
  try {
    const delay = new Date(scheduleDate).getTime() - Date.now();
    
    if (delay <= 0) {
      throw new Error('Schedule date must be in the future');
    }
    
    const job = await emailQueue.add('send-email', 
      { emailId }, 
      { 
        delay,
        jobId: `email-${emailId}`,
        removeOnComplete: true,
        removeOnFail: false
      }
    );
    
    console.log(`Email ${emailId} scheduled for ${scheduleDate}`);
    return job;
  } catch (error) {
    console.error('Failed to schedule email:', error);
    throw error;
  }
};

// Add bulk email job
const addBulkEmailJob = async (emails) => {
  try {
    const job = await emailQueue.add('send-bulk-email', 
      { emails }, 
      { 
        removeOnComplete: true,
        removeOnFail: false
      }
    );
    
    console.log(`Bulk email job added with ${emails.length} emails`);
    return job;
  } catch (error) {
    console.error('Failed to add bulk email job:', error);
    throw error;
  }
};

// Cancel scheduled email job
const cancelScheduledEmailJob = async (emailId) => {
  try {
    const jobId = `email-${emailId}`;
    const job = await emailQueue.getJob(jobId);
    
    if (job) {
      await job.remove();
      console.log(`Cancelled scheduled email job for email ${emailId}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Failed to cancel scheduled email:', error);
    throw error;
  }
};

// Get queue stats
const getQueueStats = async () => {
  try {
    const [waiting, active, completed, failed, delayed] = await Promise.all([
      emailQueue.getWaiting(),
      emailQueue.getActive(),
      emailQueue.getCompleted(),
      emailQueue.getFailed(),
      emailQueue.getDelayed()
    ]);
    
    return {
      waiting: waiting.length,
      active: active.length,
      completed: completed.length,
      failed: failed.length,
      delayed: delayed.length
    };
  } catch (error) {
    console.error('Failed to get queue stats:', error);
    return {
      waiting: 0,
      active: 0,
      completed: 0,
      failed: 0,
      delayed: 0
    };
  }
};

// Clean old jobs
const cleanOldJobs = async () => {
  try {
    await emailQueue.clean(24 * 60 * 60 * 1000, 'completed'); // Clean completed jobs older than 24 hours
    await emailQueue.clean(7 * 24 * 60 * 60 * 1000, 'failed'); // Clean failed jobs older than 7 days
    console.log('Old jobs cleaned successfully');
  } catch (error) {
    console.error('Failed to clean old jobs:', error);
  }
};

// Schedule periodic cleanup
setInterval(cleanOldJobs, 60 * 60 * 1000); // Run every hour

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('Shutting down email queue...');
  await emailQueue.close();
  await redisClient.quit();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('Shutting down email queue...');
  await emailQueue.close();
  await redisClient.quit();
  process.exit(0);
});

module.exports = {
  emailQueue,
  scheduleEmailJob,
  addBulkEmailJob,
  cancelScheduledEmailJob,
  getQueueStats,
  cleanOldJobs
};