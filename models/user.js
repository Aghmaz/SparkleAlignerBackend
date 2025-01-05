const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["Patient", "Agent", "Doctor", "SuperAdmin", "Manufacturer"],
    required: true,
  },
  treatment_details: {
    type: String,
    default: null,
  },
  status: {
    type: String,
    default: null,
  },
  profile: {
    type: String,
    default: null,
  },
  dob: { type: Date },
  address: { type: String },
  nationalId: { type: String },
  createdAt: { type: Date, default: Date.now },
  isOnline: {
    type: Boolean,
    default: false,
  },
  lastSeen: {
    type: Date,
    default: Date.now,
  },
  media: [
    {
      fileUrl: { type: String, required: true },
      uploadedAt: { type: Date, default: Date.now },
    },
  ],
  deviceTokens: [
    {
      token: String,
      platform: {
        type: String,
        enum: ["android", "ios", "web"],
      },
    },
  ],
  oneSignalId: {
    type: String,
    default: null,
  },
  alignerReminders: {
    enabled: {
      type: Boolean,
      default: false,
    },
    times: [
      {
        time: String,
        type: {
          type: String,
          enum: ["wear", "remove"],
        },
      },
    ],
  },
  fcmTokens: [
    {
      type: String,
      trim: true,
    },
  ],
});

module.exports = mongoose.model("User", UserSchema);
