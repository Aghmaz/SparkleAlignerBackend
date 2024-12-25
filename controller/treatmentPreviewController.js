const TreatmentPreview = require("../models/treatmentPreview");

// Create a new treatment preview
exports.createTreatmentPreview = async (req, res) => {
  try {
    console.log("=======");
    console.log(req.body, "====================");
    console.log("=======");
    const treatmentPreview = new TreatmentPreview(req.body);
    const savedPreview = await treatmentPreview.save();
    res.status(201).json(savedPreview);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all treatment previews
exports.getAllTreatmentPreviews = async (req, res) => {
  try {
    const previews = await TreatmentPreview.find()
      .populate("patientId")
      .populate("doctorId")
      .populate("agentId")
      .populate("manufacturerId");
    res.status(200).json(previews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a specific treatment preview by ID
exports.getTreatmentPreviewById = async (req, res) => {
  try {
    const preview = await TreatmentPreview.find({
      manufacturerId: req.params.id,
    })
      .populate("patientId")
      // .populate("doctorId")
      .populate("agentId")
      .populate("manufacturerId");
    console.log(preview, "=================");
    if (!preview)
      return res.status(404).json({ message: "Treatment preview not found" });
    res.status(200).json(preview);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a treatment preview
exports.updateTreatmentPreview = async (req, res) => {
  try {
    const updatedPreview = await TreatmentPreview.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    console.log('updatedPreview==============',updatedPreview)
    if (!updatedPreview)
      return res.status(404).json({ message: "Treatment preview not found" });
    res.status(200).json(updatedPreview);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a treatment preview
exports.deleteTreatmentPreview = async (req, res) => {
  try {
    const deletedPreview = await TreatmentPreview.findByIdAndDelete(
      req.params.id
    );
    if (!deletedPreview)
      return res.status(404).json({ message: "Treatment preview not found" });
    res.status(200).json({ message: "Treatment preview deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
