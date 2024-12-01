const mongoose = require("mongoose");

const alignerTrackerSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  alignerSteps: [
    {
      stepNumber: { type: Number, required: true },
      startDate: { type: Date },
      endDate: { type: Date },
      completedHours: { type: Number, default: 0 },
      status: {
        type: String,
        enum: ["In Progress", "Completed"],
        default: "In Progress",
      },
    },
  ],
  progressPhotos: [
    {
      stepNumber: { type: Number, required: true },
      photoUrl: { type: String },
      uploadedAt: { type: Date, default: Date.now },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("AlignerTracker", alignerTrackerSchema);
