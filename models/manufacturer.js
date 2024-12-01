const mongoose = require("mongoose");
const manufacturerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  contactEmail: { type: String, required: true },
  linkedPatients: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  uploadedPreviews: [
    { type: mongoose.Schema.Types.ObjectId, ref: "TreatmentPreview" },
  ],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Manufacturer", manufacturerSchema);
