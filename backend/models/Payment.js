const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  plan: {
    type: String,
    enum: ['pro', 'business'],
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'USD',
    uppercase: true
  },
  gateway: {
    type: String,
    enum: ['stripe', 'razorpay', 'paypal'],
    required: true
  },
  transactionId: {
    type: String,
    required: true,
    unique: true
  },
  gatewayTransactionId: String,
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['card', 'bank_transfer', 'wallet', 'upi'],
    default: 'card'
  },
  billingCycle: {
    type: String,
    enum: ['monthly', 'yearly'],
    default: 'monthly'
  },
  subscriptionId: String,
  customerId: String,
  invoice: {
    number: String,
    url: String,
    pdfPath: String
  },
  metadata: {
    ipAddress: String,
    userAgent: String,
    country: String,
    paymentMethodDetails: mongoose.Schema.Types.Mixed,
    gatewayResponse: mongoose.Schema.Types.Mixed
  },
  refund: {
    amount: Number,
    reason: String,
    refundId: String,
    refundedAt: Date
  },
  webhookEvents: [{
    eventType: String,
    eventId: String,
    processedAt: Date,
    data: mongoose.Schema.Types.Mixed
  }],
  expiresAt: Date,
  nextBillingDate: Date,
  isRecurring: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Indexes
paymentSchema.index({ userId: 1, createdAt: -1 });
paymentSchema.index({ transactionId: 1 });
paymentSchema.index({ gatewayTransactionId: 1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ gateway: 1 });
paymentSchema.index({ subscriptionId: 1 });
paymentSchema.index({ expiresAt: 1 });

// Method to mark payment as completed
paymentSchema.methods.markAsCompleted = function(gatewayData = {}) {
  this.status = 'completed';
  this.gatewayTransactionId = gatewayData.transactionId;
  this.metadata.gatewayResponse = gatewayData;
  
  // Set expiry and next billing date
  const now = new Date();
  if (this.billingCycle === 'yearly') {
    this.expiresAt = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate());
    this.nextBillingDate = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate());
  } else {
    this.expiresAt = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());
    this.nextBillingDate = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());
  }
  
  return this.save();
};

// Method to mark payment as failed
paymentSchema.methods.markAsFailed = function(reason, gatewayData = {}) {
  this.status = 'failed';
  this.metadata.failureReason = reason;
  this.metadata.gatewayResponse = gatewayData;
  return this.save();
};

// Method to process refund
paymentSchema.methods.processRefund = function(amount, reason, refundId) {
  this.status = 'refunded';
  this.refund = {
    amount: amount || this.amount,
    reason,
    refundId,
    refundedAt: new Date()
  };
  return this.save();
};

// Static method to get revenue analytics
paymentSchema.statics.getRevenueAnalytics = function(dateRange = {}) {
  const matchQuery = { status: 'completed' };
  
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
        totalRevenue: { $sum: '$amount' },
        totalTransactions: { $sum: 1 },
        averageOrderValue: { $avg: '$amount' },
        planBreakdown: {
          $push: {
            plan: '$plan',
            amount: '$amount'
          }
        },
        gatewayBreakdown: {
          $push: {
            gateway: '$gateway',
            amount: '$amount'
          }
        }
      }
    },
    {
      $project: {
        _id: 0,
        totalRevenue: 1,
        totalTransactions: 1,
        averageOrderValue: { $round: ['$averageOrderValue', 2] },
        planBreakdown: 1,
        gatewayBreakdown: 1
      }
    }
  ]);
};

// Static method to get monthly revenue trend
paymentSchema.statics.getMonthlyRevenueTrend = function(months = 12) {
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - months);
  
  return this.aggregate([
    {
      $match: {
        status: 'completed',
        createdAt: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' }
        },
        revenue: { $sum: '$amount' },
        transactions: { $sum: 1 }
      }
    },
    {
      $sort: { '_id.year': 1, '_id.month': 1 }
    },
    {
      $project: {
        _id: 0,
        year: '$_id.year',
        month: '$_id.month',
        revenue: 1,
        transactions: 1,
        monthName: {
          $arrayElemAt: [
            ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
             'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            '$_id.month'
          ]
        }
      }
    }
  ]);
};

module.exports = mongoose.model('Payment', paymentSchema);