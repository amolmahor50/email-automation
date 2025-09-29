  const mongoose = require("mongoose");

  const templateSchema = new mongoose.Schema(
    {
      title: {
        type: String,
        required: [true, "Template title is required"],
        trim: true,
        maxlength: [100, "Title cannot exceed 100 characters"],
      },
      body: {
        type: String,
        required: [true, "Template body is required"],
        maxlength: [100000, "Template body cannot exceed 10000 characters"],
      },
      category: {
        type: String,
        required: [true, "Category is required"],
        enum: ["Career", "Business", "Professional", "Personal"],
        default: "Professional",
      },
      visibility: {
        type: String,
        enum: ["global", "private"],
        default: "private",
      },
      ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: function () {
          return this.visibility === "private";
        },
      },
      defaultAttachments: [
        {
          filename: String,
          originalName: String,
          path: String,
          size: Number,
        },
      ],
      tags: [
        {
          type: String,
          trim: true,
        },
      ],
      usage: {
        count: {
          type: Number,
          default: 0,
        },
        lastUsed: Date,
        users: [
          {
            userId: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "User",
            },
            usedAt: {
              type: Date,
              default: Date.now,
            },
          },
        ],
      },
      isActive: {
        type: Boolean,
        default: true,
      },
    },
    {
      timestamps: true,
    }
  );

  // Indexes
  templateSchema.index({ ownerId: 1, visibility: 1 });
  templateSchema.index({ category: 1 });
  templateSchema.index({ visibility: 1 });
  templateSchema.index({ "usage.count": -1 });
  templateSchema.index({ title: "text", body: "text" });

  // Method to increment usage
  templateSchema.methods.incrementUsage = function (userId) {
    this.usage.count += 1;
    this.usage.lastUsed = new Date();

    // Add user to usage tracking if not already present
    const userUsage = this.usage.users.find(
      (u) => u.userId.toString() === userId.toString()
    );
    if (!userUsage) {
      this.usage.users.push({ userId, usedAt: new Date() });
    } else {
      userUsage.usedAt = new Date();
    }

    return this.save();
  };

  // Static method to get popular templates
  templateSchema.statics.getPopular = function (limit = 10) {
    return this.find({ visibility: "global", isActive: true })
      .sort({ "usage.count": -1 })
      .limit(limit)
      .populate("ownerId", "name email");
  };

  // Static method to search templates
  templateSchema.statics.search = function (query, userId, options = {}) {
    const searchQuery = {
      $and: [
        {
          $or: [{ visibility: "global" }, { ownerId: userId }],
        },
        { isActive: true },
      ],
    };

    if (query) {
      searchQuery.$and.push({
        $text: { $search: query },
      });
    }

    if (options.category) {
      searchQuery.$and.push({ category: options.category });
    }

    return this.find(searchQuery)
      .populate("ownerId", "name email")
      .sort(options.sort || { "usage.count": -1 })
      .limit(options.limit || 20);
  };

  module.exports = mongoose.model("Template", templateSchema);
