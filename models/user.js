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
    enum: ["Patient", "Agent", "Doctor"],
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
  media: [
    {
      fileUrl: { type: String, required: true },
      uploadedAt: { type: Date, default: Date.now },
    },
  ],
});

module.exports = mongoose.model("User", UserSchema);
