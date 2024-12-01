const mongoose = require("mongoose");

const treatmentPreviewSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  agentId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  // manufacturerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending",
  },
  specialComments: { type: String }, // Comments from doctor or agent.
  uploadedFiles: [
    {
      fileName: { type: String },
      fileUrl: { type: String },
      uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      uploadedAt: { type: Date, default: Date.now },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("TreatmentPreview", treatmentPreviewSchema);
