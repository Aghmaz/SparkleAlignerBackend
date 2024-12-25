// routes/finalStagePreviewRoutes.js
const express = require("express");
const router = express.Router();
const {
  createFinalStagePreview,
  getAllFinalStagePreviews,
  getFinalStagePreviewById,
  updateFinalStagePreview,
  deleteFinalStagePreview,
} = require("../controller/finalStagePreviewForDoctorByAgentController");

// Create a new final stage preview
router.post("/", createFinalStagePreview);

// Get all final stage previews
router.get("/", getAllFinalStagePreviews);

// Get a specific final stage preview by ID
router.get("/:id", getFinalStagePreviewById);

// Update a final stage preview by ID
router.put("/:id", updateFinalStagePreview);

// Delete a final stage preview by ID
router.delete("/:id", deleteFinalStagePreview);

module.exports = router;
