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
    enum: ["client", "agent", "doctor"],
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
});

module.exports = mongoose.model("User", UserSchema);
