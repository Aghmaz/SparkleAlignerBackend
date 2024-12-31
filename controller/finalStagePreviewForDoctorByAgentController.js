// controllers/finalStagePreviewController.js
const FinalStagePreviewForDoctorByAgent = require("../models/finalStagePreviewforDoctorByAgent");

// Create a new final stage preview for doctor by agent
const createFinalStagePreview = async (req, res) => {
  try {
    const { agentId, doctorId, linkedPatientId, uploadedFiles } = req.body;

    if (!agentId || !doctorId || !linkedPatientId) {
      return res
        .status(400)
        .json({ message: "Agent, Doctor and Linked Patient IDs are required." });
    }

    const newPreview = new FinalStagePreviewForDoctorByAgent({
      agentId,
      doctorId,
      linkedPatientId,
      uploadedFiles,
    });

    await newPreview.save();
    res
      .status(201)
      .json({ message: "Preview created successfully.", preview: newPreview });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while creating preview." });
  }
};

// Get all final stage previews
const getAllFinalStagePreviews = async (req, res) => {
  try {
    const previews = await FinalStagePreviewForDoctorByAgent.find()
      .populate("agentId", "name email")
      .populate("doctorId", "name email")
      .populate("linkedPatientId", "name email");
    res.status(200).json({ previews });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while fetching previews." });
  }
};

// Get a specific final stage preview by ID
const getFinalStagePreviewById = async (req, res) => {
  try {
    const preview = await FinalStagePreviewForDoctorByAgent.find({
      doctorId: req.params.id,
    })
      .populate("agentId", "name email")
      .populate("doctorId", "name email")
      .populate("linkedPatientId", "name email");
    if (!preview) {
      return res.status(404).json({ message: "Preview not found." });
    }

    res.status(200).json({ preview });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Server error while fetching the preview." });
  }
};

// Update a final stage preview by ID
const updateFinalStagePreview = async (req, res) => {
  try {
    const { agentId, doctorId, linkedPatientId, uploadedFiles } = req.body;

    const updatedPreview =
      await FinalStagePreviewForDoctorByAgent.findByIdAndUpdate(
        req.params.id,
        { agentId, doctorId, linkedPatientId, uploadedFiles },
        { new: true }
      );

    if (!updatedPreview) {
      return res.status(404).json({ message: "Preview not found." });
    }

    res.status(200).json({
      message: "Preview updated successfully.",
      preview: updatedPreview,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while updating preview." });
  }
};

// Delete a final stage preview by ID
const deleteFinalStagePreview = async (req, res) => {
  try {
    const preview = await FinalStagePreviewForDoctorByAgent.findByIdAndDelete(
      req.params.id
    );

    if (!preview) {
      return res.status(404).json({ message: "Preview not found." });
    }

    res.status(200).json({ message: "Preview deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while deleting preview." });
  }
};

module.exports = {
  createFinalStagePreview,
  getAllFinalStagePreviews,
  getFinalStagePreviewById,
  updateFinalStagePreview,
  deleteFinalStagePreview,
};
