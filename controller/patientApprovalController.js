// controllers/approvalController.js
const PatientApproval = require("../models/patientApproval");

// Create or Update a patient approval
const approveOrDenyPatient = async (req, res) => {
  try {
    const { patientId, status, comment } = req.body;

    if (!patientId || !status || !comment) {
      return res.status(400).json({
        message: "All fields (patientId, status, comment) are required.",
      });
    }

    if (status !== "approve" && status !== "deny") {
      return res
        .status(400)
        .json({ message: 'Status must be "approve" or "deny".' });
    }

    // Check if approval for the patient already exists
    const existingApproval = await PatientApproval.findOne({ patientId });
    if (existingApproval) {
      // Update the existing approval
      existingApproval.status = status;
      existingApproval.comment = comment;
      await existingApproval.save();
      return res.status(200).json({
        message: "Patient approval status updated.",
        approval: existingApproval,
      });
    }

    // Create a new approval if it does not exist
    const newApproval = new PatientApproval({ patientId, status, comment });
    await newApproval.save();

    res.status(201).json({
      message: "Patient approval status created.",
      approval: newApproval,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Server error. Could not process the request." });
  }
};

// Get all patient approvals
const getAllApprovals = async (req, res) => {
  try {
    const approvals = await PatientApproval.find().populate(
      "patientId",
      "name age gender"
    );
    res.status(200).json({ approvals });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Server error. Could not fetch approvals." });
  }
};

// Get a specific patient approval by ID
const getApprovalById = async (req, res) => {
  try {
    const approval = await PatientApproval.findById(req.params.id).populate(
      "patientId",
      "name age gender"
    );
    if (!approval) {
      return res.status(404).json({ message: "Approval not found." });
    }
    res.status(200).json({ approval });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Server error. Could not fetch approval." });
  }
};

// Update a patient approval
const updateApproval = async (req, res) => {
  try {
    const { status, comment } = req.body;
    const approval = await PatientApproval.findByIdAndUpdate(
      req.params.id,
      { status, comment },
      { new: true }
    );
    if (!approval) {
      return res.status(404).json({ message: "Approval not found." });
    }
    res.status(200).json({ message: "Approval updated.", approval });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Server error. Could not update approval." });
  }
};

// Delete a patient approval
const deleteApproval = async (req, res) => {
  try {
    const approval = await PatientApproval.findByIdAndDelete(req.params.id);
    if (!approval) {
      return res.status(404).json({ message: "Approval not found." });
    }
    res.status(200).json({ message: "Approval deleted." });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Server error. Could not delete approval." });
  }
};

module.exports = {
  approveOrDenyPatient,
  getAllApprovals,
  getApprovalById,
  updateApproval,
  deleteApproval,
};
