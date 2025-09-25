const Payment = require('../models/Payment');
const User = require('../models/User');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Razorpay = require('razorpay');
const { sendSubscriptionConfirmationEmail } = require('../services/emailService');

// Initialize payment gateways
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Create checkout session
const createCheckoutSession = async (req, res) => {
  try {
    const { plan, billingCycle = 'monthly', gateway } = req.body;
    const user = req.user;

    // Define pricing
    const pricing = {
      pro: { monthly: 19, yearly: 190 },
      business: { monthly: 49, yearly: 490 }
    };

    const amount = pricing[plan][billingCycle];
    if (!amount) {
      return res.status(400).json({ message: 'Invalid plan or billing cycle' });
    }

    // Create payment record
    const payment = new Payment({
      userId: user.id,
      plan,
      amount,
      currency: 'USD',
      gateway,
      transactionId: `txn_${Date.now()}_${user.id}`,
      billingCycle,
      status: 'pending',
      metadata: {
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      }
    });

    await payment.save();

    let sessionData = {};

    // Handle different payment gateways
    switch (gateway) {
      case 'stripe':
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ['card'],
          line_items: [{
            price_data: {
              currency: 'usd',
              product_data: {
                name: `EmailFlow ${plan.charAt(0).toUpperCase() + plan.slice(1)} Plan`,
                description: `${billingCycle} subscription`
              },
              unit_amount: amount * 100,
              recurring: {
                interval: billingCycle === 'yearly' ? 'year' : 'month'
              }
            },
            quantity: 1
          }],
          mode: 'subscription',
          success_url: `${process.env.FRONTEND_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${process.env.FRONTEND_URL}/payment/cancel`,
          customer_email: user.email,
          metadata: {
            userId: user.id,
            paymentId: payment._id.toString(),
            plan
          }
        });

        sessionData = {
          sessionId: session.id,
          url: session.url
        };
        break;

      case 'razorpay':
        const order = await razorpay.orders.create({
          amount: amount * 100, // Amount in paise
          currency: 'INR',
          receipt: payment.transactionId,
          notes: {
            userId: user.id,
            paymentId: payment._id.toString(),
            plan
          }
        });

        sessionData = {
          orderId: order.id,
          amount: order.amount,
          currency: order.currency,
          key: process.env.RAZORPAY_KEY_ID
        };
        break;

      case 'paypal':
        // PayPal integration would go here
        sessionData = {
          message: 'PayPal integration coming soon'
        };
        break;

      default:
        return res.status(400).json({ message: 'Unsupported payment gateway' });
    }

    res.json({
      success: true,
      paymentId: payment._id,
      ...sessionData
    });
  } catch (error) {
    console.error('Create checkout session error:', error);
    res.status(500).json({ message: 'Failed to create checkout session' });
  }
};

// Handle webhook
const handleWebhook = async (req, res) => {
  try {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        await handleSuccessfulPayment(session);
        break;

      case 'invoice.payment_succeeded':
        const invoice = event.data.object;
        await handleRecurringPayment(invoice);
        break;

      case 'customer.subscription.deleted':
        const subscription = event.data.object;
        await handleSubscriptionCancellation(subscription);
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ message: 'Webhook processing failed' });
  }
};

// Handle successful payment
const handleSuccessfulPayment = async (session) => {
  try {
    const { userId, paymentId, plan } = session.metadata;
    
    const payment = await Payment.findById(paymentId);
    const user = await User.findById(userId);

    if (payment && user) {
      // Update payment status
      await payment.markAsCompleted({
        transactionId: session.id,
        subscriptionId: session.subscription
      });

      // Update user subscription
      user.subscription.plan = plan;
      user.subscription.expiry = payment.expiresAt;
      user.subscription.stripeCustomerId = session.customer;
      user.subscription.subscriptionId = session.subscription;
      await user.save();

      // Send confirmation email
      await sendSubscriptionConfirmationEmail(user, plan, payment.amount);
    }
  } catch (error) {
    console.error('Handle successful payment error:', error);
  }
};

// Handle recurring payment
const handleRecurringPayment = async (invoice) => {
  try {
    const subscription = await stripe.subscriptions.retrieve(invoice.subscription);
    const customer = await stripe.customers.retrieve(subscription.customer);
    
    const user = await User.findOne({ email: customer.email });
    if (user) {
      // Create new payment record for recurring payment
      const payment = new Payment({
        userId: user._id,
        plan: user.subscription.plan,
        amount: invoice.amount_paid / 100,
        currency: invoice.currency.toUpperCase(),
        gateway: 'stripe',
        transactionId: invoice.id,
        gatewayTransactionId: invoice.payment_intent,
        status: 'completed',
        subscriptionId: subscription.id,
        customerId: customer.id,
        isRecurring: true
      });

      await payment.save();

      // Update subscription expiry
      const nextBilling = new Date(subscription.current_period_end * 1000);
      user.subscription.expiry = nextBilling;
      await user.save();
    }
  } catch (error) {
    console.error('Handle recurring payment error:', error);
  }
};

// Handle subscription cancellation
const handleSubscriptionCancellation = async (subscription) => {
  try {
    const user = await User.findOne({ 'subscription.subscriptionId': subscription.id });
    if (user) {
      user.subscription.plan = 'free';
      user.subscription.subscriptionId = null;
      await user.save();
    }
  } catch (error) {
    console.error('Handle subscription cancellation error:', error);
  }
};

// Get payment history
const getPaymentHistory = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const query = { userId: req.user.id };
    
    if (req.query.status) {
      query.status = req.query.status;
    }
    
    if (req.query.gateway) {
      query.gateway = req.query.gateway;
    }

    const payments = await Payment.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Payment.countDocuments(query);

    res.json({
      success: true,
      payments,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get payment history error:', error);
    res.status(500).json({ message: 'Failed to get payment history' });
  }
};

// Get single payment
const getPayment = async (req, res) => {
  try {
    const payment = await Payment.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    res.json({
      success: true,
      payment
    });
  } catch (error) {
    console.error('Get payment error:', error);
    res.status(500).json({ message: 'Failed to get payment' });
  }
};

// Download invoice
const downloadInvoice = async (req, res) => {
  try {
    const payment = await Payment.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    if (!payment.invoice || !payment.invoice.url) {
      return res.status(404).json({ message: 'Invoice not available' });
    }

    // Redirect to invoice URL or serve file
    res.redirect(payment.invoice.url);
  } catch (error) {
    console.error('Download invoice error:', error);
    res.status(500).json({ message: 'Failed to download invoice' });
  }
};

// Cancel subscription
const cancelSubscription = async (req, res) => {
  try {
    const user = req.user;
    
    if (!user.subscription.subscriptionId) {
      return res.status(400).json({ message: 'No active subscription found' });
    }

    // Cancel subscription with payment gateway
    if (user.subscription.subscriptionId.startsWith('sub_')) {
      // Stripe subscription
      await stripe.subscriptions.del(user.subscription.subscriptionId);
    }

    // Update user subscription
    user.subscription.plan = 'free';
    user.subscription.subscriptionId = null;
    await user.save();

    res.json({
      success: true,
      message: 'Subscription cancelled successfully'
    });
  } catch (error) {
    console.error('Cancel subscription error:', error);
    res.status(500).json({ message: 'Failed to cancel subscription' });
  }
};

// Update subscription
const updateSubscription = async (req, res) => {
  try {
    const { plan, billingCycle } = req.body;
    const user = req.user;

    if (!user.subscription.subscriptionId) {
      return res.status(400).json({ message: 'No active subscription found' });
    }

    // Update subscription with payment gateway
    if (user.subscription.subscriptionId.startsWith('sub_')) {
      // Stripe subscription update logic would go here
      // This is a simplified version
      user.subscription.plan = plan;
      await user.save();
    }

    res.json({
      success: true,
      message: 'Subscription updated successfully',
      subscription: user.subscription
    });
  } catch (error) {
    console.error('Update subscription error:', error);
    res.status(500).json({ message: 'Failed to update subscription' });
  }
};

module.exports = {
  createCheckoutSession,
  handleWebhook,
  getPaymentHistory,
  getPayment,
  downloadInvoice,
  cancelSubscription,
  updateSubscription
};