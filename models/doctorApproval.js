// models/PatientApproval.js
const mongoose = require("mongoose");

const DoctorApprovalSchema = new mongoose.Schema({
  doctorId: {
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

const PatientApproval = mongoose.model("DoctorApproval", DoctorApprovalSchema);

module.exports = PatientApproval;