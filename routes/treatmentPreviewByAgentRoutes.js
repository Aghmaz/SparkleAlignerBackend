const express = require("express");
const router = express.Router();
const treatmentPreviewByAgentRoutes = require("../controller/treatmentPreviewByAgentController");

// CRUD Routes
router.post("/", treatmentPreviewByAgentRoutes.createTreatmentPreviewByAgent);
router.get("/", treatmentPreviewByAgentRoutes.getAllTreatmentPreviewByAgent);
router.get(
  "/:id",
  treatmentPreviewByAgentRoutes.getTreatmentPreviewByAgentById
);
router.put("/:id", treatmentPreviewByAgentRoutes.updateTreatmentPreviewByAgent);
router.delete(
  "/:id",
  treatmentPreviewByAgentRoutes.deleteTreatmentPreviewByAgent
);

module.exports = router;
