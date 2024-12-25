// models/PatientApproval.js
const mongoose = require("mongoose");

const PatientApprovalSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Assuming you have a 'Patient' collection
    required: true,
  },
  status: {
    type: String,
    enum: ["approve", "deny"],
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const PatientApproval = mongoose.model(
  "PatientApproval",
  PatientApprovalSchema
);

module.exports = PatientApproval;
