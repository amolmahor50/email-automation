// models/PendingUser.js
const mongoose = require("mongoose");

const PendingUserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  otp: String, // store OTP
  otpExpires: Date,
});

module.exports = mongoose.model("PendingUser", PendingUserSchema);
