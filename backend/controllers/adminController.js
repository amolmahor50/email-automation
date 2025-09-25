const User = require("../models/User");
const Email = require("../models/Email");
const Template = require("../models/Template");
const Payment = require("../models/Payment");

// Get dashboard statistics
const getDashboardStats = async (req, res) => {
  try {
    const [
      totalUsers,
      activeUsers,
      totalEmails,
      totalTemplates,
      revenueData,
      recentUsers,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ isActive: true }),
      Email.countDocuments({ status: "sent" }),
      Template.countDocuments({ isActive: true }),
      Payment.aggregate([
        { $match: { status: "completed" } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
      User.find({ role: "user" })
        .sort({ createdAt: -1 })
        .limit(5)
        .select("name email subscription.plan isActive createdAt"),
    ]);

    const totalRevenue = revenueData[0]?.total || 0;

    // Get monthly revenue
    const monthlyRevenue = await Payment.aggregate([
      {
        $match: {
          status: "completed",
          createdAt: {
            $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
      },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    res.json({
      success: true,
      stats: {
        totalUsers,
        activeUsers,
        totalEmails,
        totalTemplates,
        totalRevenue,
        monthlyRevenue: monthlyRevenue[0]?.total || 0,
        recentUsers,
      },
    });
  } catch (error) {
    console.error("Get dashboard stats error:", error);
    res.status(500).json({ message: "Failed to get dashboard statistics" });
  }
};

// Get users with pagination and filters
const getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const sort = req.query.sort || "-createdAt";

    // Build query
    const query = {};
    if (req.query.status) {
      query.isActive = req.query.status === "active";
    }
    if (req.query.plan) {
      query["subscription.plan"] = req.query.plan;
    }
    if (req.query.search) {
      query.$or = [
        { name: { $regex: req.query.search, $options: "i" } },
        { email: { $regex: req.query.search, $options: "i" } },
      ];
    }

    const users = await User.find(query)
      .select("-password")
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({ message: "Failed to get users" });
  }
};

// Get single user
const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get user's email statistics
    const emailStats = await Email.aggregate([
      { $match: { userId: user._id } },
      {
        $group: {
          _id: null,
          totalEmails: { $sum: 1 },
          sentEmails: { $sum: { $cond: [{ $eq: ["$status", "sent"] }, 1, 0] } },
          totalOpens: { $sum: "$analytics.opens" },
          totalClicks: { $sum: "$analytics.clicks" },
        },
      },
    ]);

    // Get user's payment history
    const payments = await Payment.find({ userId: user._id })
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      user: {
        ...user.toObject(),
        emailStats: emailStats[0] || {
          totalEmails: 0,
          sentEmails: 0,
          totalOpens: 0,
          totalClicks: 0,
        },
        recentPayments: payments,
      },
    });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ message: "Failed to get user" });
  }
};

// Update user
const updateUser = async (req, res) => {
  try {
    const { role, subscription, isActive, profile } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update fields
    if (role) user.role = role;
    if (subscription) {
      user.subscription = { ...user.subscription, ...subscription };
    }
    if (typeof isActive === "boolean") user.isActive = isActive;
    if (profile) {
      user.profile = { ...user.profile, ...profile };
    }

    await user.save();

    res.json({
      success: true,
      message: "User updated successfully",
      user: user.toObject(),
    });
  } catch (error) {
    console.error("Update user error:", error);
    res.status(500).json({ message: "Failed to update user" });
  }
};

// Delete user
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Soft delete by deactivating
    user.isActive = false;
    await user.save();

    res.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ message: "Failed to delete user" });
  }
};

// Suspend user
const suspendUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isActive = false;
    await user.save();

    res.json({
      success: true,
      message: "User suspended successfully",
    });
  } catch (error) {
    console.error("Suspend user error:", error);
    res.status(500).json({ message: "Failed to suspend user" });
  }
};

// Activate user
const activateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isActive = true;
    await user.save();

    res.json({
      success: true,
      message: "User activated successfully",
    });
  } catch (error) {
    console.error("Activate user error:", error);
    res.status(500).json({ message: "Failed to activate user" });
  }
};

// Get revenue analytics
const getRevenueAnalytics = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const matchQuery = { status: "completed" };
    if (startDate || endDate) {
      matchQuery.createdAt = {};
      if (startDate) matchQuery.createdAt.$gte = new Date(startDate);
      if (endDate) matchQuery.createdAt.$lte = new Date(endDate);
    }

    const analytics = await Payment.getRevenueAnalytics(
      startDate || endDate ? { start: startDate, end: endDate } : {}
    );

    // Get monthly trend
    const monthlyTrend = await Payment.getMonthlyRevenueTrend(12);

    res.json({
      success: true,
      analytics: {
        ...analytics[0],
        monthlyTrend,
      },
    });
  } catch (error) {
    console.error("Get revenue analytics error:", error);
    res.status(500).json({ message: "Failed to get revenue analytics" });
  }
};

// Get email analytics
const getEmailAnalytics = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const matchQuery = {};
    if (startDate || endDate) {
      matchQuery.createdAt = {};
      if (startDate) matchQuery.createdAt.$gte = new Date(startDate);
      if (endDate) matchQuery.createdAt.$lte = new Date(endDate);
    }

    const analytics = await Email.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: null,
          totalEmails: { $sum: 1 },
          sentEmails: { $sum: { $cond: [{ $eq: ["$status", "sent"] }, 1, 0] } },
          scheduledEmails: {
            $sum: { $cond: [{ $eq: ["$status", "scheduled"] }, 1, 0] },
          },
          failedEmails: {
            $sum: { $cond: [{ $eq: ["$status", "failed"] }, 1, 0] },
          },
          totalOpens: { $sum: "$analytics.opens" },
          totalClicks: { $sum: "$analytics.clicks" },
          uniqueOpens: {
            $sum: { $cond: [{ $gt: ["$analytics.opens", 0] }, 1, 0] },
          },
        },
      },
      {
        $project: {
          _id: 0,
          totalEmails: 1,
          sentEmails: 1,
          scheduledEmails: 1,
          failedEmails: 1,
          totalOpens: 1,
          totalClicks: 1,
          uniqueOpens: 1,
          openRate: {
            $cond: [
              { $gt: ["$sentEmails", 0] },
              {
                $multiply: [{ $divide: ["$uniqueOpens", "$sentEmails"] }, 100],
              },
              0,
            ],
          },
          clickRate: {
            $cond: [
              { $gt: ["$sentEmails", 0] },
              {
                $multiply: [{ $divide: ["$totalClicks", "$sentEmails"] }, 100],
              },
              0,
            ],
          },
        },
      },
    ]);

    res.json({
      success: true,
      analytics: analytics[0] || {
        totalEmails: 0,
        sentEmails: 0,
        scheduledEmails: 0,
        failedEmails: 0,
        totalOpens: 0,
        totalClicks: 0,
        uniqueOpens: 0,
        openRate: 0,
        clickRate: 0,
      },
    });
  } catch (error) {
    console.error("Get email analytics error:", error);
    res.status(500).json({ message: "Failed to get email analytics" });
  }
};

// Create global template
const createGlobalTemplate = async (req, res) => {
  try {
    const { title, body, category, tags } = req.body;

    const template = new Template({
      title,
      body,
      category,
      visibility: "global",
      ownerId: null,
      tags: tags || [],
    });

    await template.save();

    res.status(201).json({
      success: true,
      message: "Global template created successfully",
      template,
    });
  } catch (error) {
    console.error("Create global template error:", error);
    res.status(500).json({ message: "Failed to create global template" });
  }
};

// Update global template
const updateGlobalTemplate = async (req, res) => {
  try {
    const { title, body, category, tags } = req.body;

    const template = await Template.findOne({
      _id: req.params.id,
      visibility: "global",
    });

    if (!template) {
      return res.status(404).json({ message: "Global template not found" });
    }

    template.title = title || template.title;
    template.body = body || template.body;
    template.category = category || template.category;
    template.tags = tags || template.tags;

    await template.save();

    res.json({
      success: true,
      message: "Global template updated successfully",
      template,
    });
  } catch (error) {
    console.error("Update global template error:", error);
    res.status(500).json({ message: "Failed to update global template" });
  }
};

// Delete global template
const deleteGlobalTemplate = async (req, res) => {
  try {
    const template = await Template.findOne({
      _id: req.params.id,
      visibility: "global",
    });

    if (!template) {
      return res.status(404).json({ message: "Global template not found" });
    }

    template.isActive = false;
    await template.save();

    res.json({
      success: true,
      message: "Global template deleted successfully",
    });
  } catch (error) {
    console.error("Delete global template error:", error);
    res.status(500).json({ message: "Failed to delete global template" });
  }
};

// Get system settings
const getSystemSettings = async (req, res) => {
  try {
    // This would typically come from a settings collection
    // For now, return default settings
    const settings = {
      general: {
        siteName: "EmailFlow",
        siteDescription: "Professional Email Automation Platform",
        supportEmail: "support@emailflow.com",
        maxFileSize: 10,
        allowedFileTypes: "pdf,doc,docx,jpg,png",
        maintenanceMode: false,
      },
      email: {
        smtpHost: process.env.SMTP_HOST || "smtp.gmail.com",
        smtpPort: process.env.SMTP_PORT || 587,
        smtpUser: process.env.SMTP_USER || "",
        fromName: process.env.FROM_NAME || "EmailFlow",
        fromEmail: process.env.FROM_EMAIL || "",
        dailyLimit: 10000,
        enableTracking: true,
      },
      limits: {
        freeEmailLimit: 50,
        proEmailLimit: 500,
        businessEmailLimit: 5000,
        maxTemplatesPerUser: 50,
        maxAttachmentSize: 25,
      },
    };

    res.json({
      success: true,
      settings,
    });
  } catch (error) {
    console.error("Get system settings error:", error);
    res.status(500).json({ message: "Failed to get system settings" });
  }
};

// Update system settings
const updateSystemSettings = async (req, res) => {
  try {
    const settings = req.body;

    // In a real application, you would save these to a database
    // For now, just return success

    res.json({
      success: true,
      message: "System settings updated successfully",
      settings,
    });
  } catch (error) {
    console.error("Update system settings error:", error);
    res.status(500).json({ message: "Failed to update system settings" });
  }
};

// Get system logs
const getSystemLogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;

    // This would typically come from a logs collection or file system
    // For now, return mock data
    const logs = [
      {
        id: "1",
        level: "info",
        message: "User login successful",
        timestamp: new Date(),
        userId: "user123",
        ip: "192.168.1.1",
      },
      {
        id: "2",
        level: "error",
        message: "Email sending failed",
        timestamp: new Date(Date.now() - 3600000),
        userId: "user456",
        ip: "192.168.1.2",
      },
    ];

    res.json({
      success: true,
      logs,
      pagination: {
        page,
        limit,
        total: logs.length,
        pages: Math.ceil(logs.length / limit),
      },
    });
  } catch (error) {
    console.error("Get system logs error:", error);
    res.status(500).json({ message: "Failed to get system logs" });
  }
};

module.exports = {
  getDashboardStats,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  suspendUser,
  activateUser,
  getRevenueAnalytics,
  getEmailAnalytics,
  createGlobalTemplate,
  updateGlobalTemplate,
  deleteGlobalTemplate,
  getSystemSettings,
  updateSystemSettings,
  getSystemLogs,
};
