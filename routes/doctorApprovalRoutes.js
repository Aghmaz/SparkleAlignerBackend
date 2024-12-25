// routes/doctorApprovalRoutes.js
const express = require("express");
const router = express.Router();
const {
  approveOrDenyDoctor,
  getAllApprovals,
  getApprovalById,
  updateApproval,
  deleteApproval,
} = require("../controller/doctorApproval");

// Create or Update a doctor approval
router.post("/", approveOrDenyDoctor);

// Get all doctor approvals
router.get("/", getAllApprovals);

// Get a specific doctor approval by ID
router.get("/:id", getApprovalById);

// Update a doctor approval
router.put("/:id", updateApproval);

// Delete a doctor approval
router.delete("/:id", deleteApproval);

module.exports = router;
