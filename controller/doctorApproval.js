// controllers/doctorApproval.js
const DoctorApproval = require("../models/doctorApproval");

// Create or Update a doctor approval
const approveOrDenyDoctor = async (req, res) => {
  try {
    const { doctorId, status, comment } = req.body;

    if (!doctorId || !status || !comment) {
      return res
        .status(400)
        .json({
          message: "All fields (doctorId, status, comment) are required.",
        });
    }

    if (status !== "approve" && status !== "deny") {
      return res
        .status(400)
        .json({ message: 'Status must be "approve" or "deny".' });
    }

    // Check if approval for the doctor already exists
    const existingApproval = await DoctorApproval.findOne({ doctorId });
    if (existingApproval) {
      // Update the existing approval
      existingApproval.status = status;
      existingApproval.comment = comment;
      await existingApproval.save();
      return res
        .status(200)
        .json({
          message: "Doctor approval status updated.",
          approval: existingApproval,
        });
    }

    // Create a new approval if it does not exist
    const newApproval = new DoctorApproval({ doctorId, status, comment });
    await newApproval.save();

    res
      .status(201)
      .json({
        message: "Doctor approval status created.",
        approval: newApproval,
      });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Server error. Could not process the request." });
  }
};

// Get all doctor approvals
const getAllApprovals = async (req, res) => {
  try {
    const approvals = await DoctorApproval.find().populate(
      "doctorId",
      "name specialty"
    );
    res.status(200).json({ approvals });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Server error. Could not fetch approvals." });
  }
};

// Get a specific doctor approval by ID
const getApprovalById = async (req, res) => {
  try {
    const approval = await DoctorApproval.findById(req.params.id).populate(
      "doctorId",
      "name specialty"
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

// Update a doctor approval
const updateApproval = async (req, res) => {
  try {
    const { status, comment } = req.body;
    const approval = await DoctorApproval.findByIdAndUpdate(
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

// Delete a doctor approval
const deleteApproval = async (req, res) => {
  try {
    const approval = await DoctorApproval.findByIdAndDelete(req.params.id);
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
  approveOrDenyDoctor,
  getAllApprovals,
  getApprovalById,
  updateApproval,
  deleteApproval,
};
