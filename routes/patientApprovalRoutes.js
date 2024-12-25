// routes/approvalRoutes.js
const express = require("express");
const router = express.Router();
const {
  approveOrDenyPatient,
  getAllApprovals,
  getApprovalById,
  updateApproval,
  deleteApproval,
} = require("../controller/patientApprovalController");

// Create or Update a patient approval
router.post("/", approveOrDenyPatient);

// Get all patient approvals
router.get("/", getAllApprovals);

// Get a specific patient approval by ID
router.get("/:id", getApprovalById);

// Update a patient approval
router.put("/:id", updateApproval);

// Delete a patient approval
router.delete("/:id", deleteApproval);

module.exports = router;
