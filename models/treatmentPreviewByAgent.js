const mongoose = require("mongoose");
const treatmentPreviewByAgentSchema = new mongoose.Schema({
  agentId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  linkedPatientId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
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

module.exports = mongoose.model(
  "TreatmentPreviewByAgent",
  treatmentPreviewByAgentSchema
);
