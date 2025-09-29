const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || "your-secret-key", {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

// Verify JWT token
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Access token required" });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key"
    );
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    if (!user.isActive) {
      return res.status(401).json({ message: "Account is deactivated" });
    }

    if (user.isLocked) {
      return res.status(401).json({ message: "Account is temporarily locked" });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }
    return res.status(500).json({ message: "Token verification failed" });
  }
};

// Check if user is admin
const requireAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
};

// Check subscription plan
const requirePlan = (plans) => {
  return (req, res, next) => {
    if (!plans.includes(req.user.subscription.plan)) {
      return res.status(403).json({
        message: "Upgrade required",
        requiredPlans: plans,
        currentPlan: req.user.subscription.plan,
      });
    }
    next();
  };
};

// Check if user can send emails
const checkEmailLimit = async (req, res, next) => {
  try {
    if (!req.user.canSendEmail()) {
      const limits = {
        free: 50,
        pro: 500,
        business: 5000,
      };

      return res.status(429).json({
        message: "Monthly email limit reached",
        limit: limits[req.user.subscription.plan],
        used: req.user.emailStats.thisMonth,
        plan: req.user.subscription.plan,
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({ message: "Error checking email limit" });
  }
};

// Rate limiting for sensitive operations
const sensitiveOperationLimit = (windowMs = 15 * 60 * 1000, max = 5) => {
  const attempts = new Map();

  return (req, res, next) => {
    const key = `${req.ip}-${req.user.id}`;
    const now = Date.now();
    const windowStart = now - windowMs;

    if (!attempts.has(key)) {
      attempts.set(key, []);
    }

    const userAttempts = attempts.get(key);
    const recentAttempts = userAttempts.filter((time) => time > windowStart);

    if (recentAttempts.length >= max) {
      return res.status(429).json({
        message: "Too many attempts, please try again later",
        retryAfter: Math.ceil((recentAttempts[0] + windowMs - now) / 1000),
      });
    }

    recentAttempts.push(now);
    attempts.set(key, recentAttempts);

    next();
  };
};

module.exports = {
  generateToken,
  authenticateToken,
  requireAdmin,
  requirePlan,
  checkEmailLimit,
  sensitiveOperationLimit,
};
