const express = require("express");
const router = express.Router();
const treatmentPreviewController = require("../controller/treatmentPreviewController");

// CRUD Routes
router.post("/", treatmentPreviewController.createTreatmentPreview);
router.get("/", treatmentPreviewController.getAllTreatmentPreviews);
router.get("/:id", treatmentPreviewController.getTreatmentPreviewById);
router.put("/:id", treatmentPreviewController.updateTreatmentPreview);
router.delete("/:id", treatmentPreviewController.deleteTreatmentPreview);

module.exports = router;
