const mongoose = require("mongoose");
const TreatmentPreviewByAgent = require("../models/treatmentPreviewByAgent"); // Assuming your model file is in the models folder

// CREATE: Create a new TreatmentPreviewByAgent document
const createTreatmentPreviewByAgent = async (req, res) => {
  try {
    const { agentId, linkedPatients, uploadedFiles } = req.body;

    // Creating a new document
    const newTreatmentPreview = new TreatmentPreviewByAgent({
      agentId,
      linkedPatients,
      uploadedFiles,
    });

    // Save to the database
    const savedTreatmentPreview = await newTreatmentPreview.save();
    res.status(201).json({
      message: "Treatment Preview by Agent created successfully!",
      data: savedTreatmentPreview,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error creating Treatment Preview by Agent", error });
  }
};

// READ: Get all TreatmentPreviewByAgent documents
const getAllTreatmentPreviewByAgent = async (req, res) => {
  try {
    const treatmentPreviews = await TreatmentPreviewByAgent.find()
      .populate("agentId", "name email") // Adjust according to the User schema
      .populate("linkedPatients", "name email")
      .populate("uploadedFiles.uploadedBy", "name email"); // Populating uploadedBy (if needed)

    res.status(200).json(treatmentPreviews);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error fetching Treatment Previews", error });
  }
};

// READ: Get a single TreatmentPreviewByAgent document by ID
const getTreatmentPreviewByAgentById = async (req, res) => {
  const { id } = req.params;
  try {
    const treatmentPreview = await TreatmentPreviewByAgent.findById(id)
      .populate("agentId", "name email")
      .populate("linkedPatients", "name email")
      .populate("uploadedFiles.uploadedBy", "name email");

    if (!treatmentPreview) {
      return res
        .status(404)
        .json({ message: "Treatment Preview by Agent not found" });
    }

    res.status(200).json(treatmentPreview);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error fetching Treatment Preview by Agent", error });
  }
};

// UPDATE: Update a TreatmentPreviewByAgent document by ID
const updateTreatmentPreviewByAgent = async (req, res) => {
  const { id } = req.params;
  const { agentId, linkedPatients, uploadedFiles } = req.body;

  try {
    const updatedTreatmentPreview =
      await TreatmentPreviewByAgent.findByIdAndUpdate(
        id,
        { agentId, linkedPatients, uploadedFiles },
        { new: true } // Return the updated document
      );

    if (!updatedTreatmentPreview) {
      return res
        .status(404)
        .json({ message: "Treatment Preview by Agent not found" });
    }

    res.status(200).json({
      message: "Treatment Preview by Agent updated successfully",
      data: updatedTreatmentPreview,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error updating Treatment Preview by Agent", error });
  }
};

// DELETE: Delete a TreatmentPreviewByAgent document by ID
const deleteTreatmentPreviewByAgent = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedTreatmentPreview =
      await TreatmentPreviewByAgent.findByIdAndDelete(id);

    if (!deletedTreatmentPreview) {
      return res
        .status(404)
        .json({ message: "Treatment Preview by Agent not found" });
    }

    res.status(200).json({
      message: "Treatment Preview by Agent deleted successfully",
      data: deletedTreatmentPreview,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error deleting Treatment Preview by Agent", error });
  }
};

module.exports = {
  createTreatmentPreviewByAgent,
  getAllTreatmentPreviewByAgent,
  getTreatmentPreviewByAgentById,
  updateTreatmentPreviewByAgent,
  deleteTreatmentPreviewByAgent,
};
