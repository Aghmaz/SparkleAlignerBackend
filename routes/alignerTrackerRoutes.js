const express = require("express");
const router = express.Router();
const alignerTrackerController = require("../controller/alignerTrackerController");

// CRUD Routes
router.post("/", alignerTrackerController.createAlignerTracker);
router.get("/", alignerTrackerController.getAllAlignerTrackers);
router.get("/:id", alignerTrackerController.getAlignerTrackerById);
router.put("/:id", alignerTrackerController.updateAlignerTracker);
router.delete("/:id", alignerTrackerController.deleteAlignerTracker);

module.exports = router;
