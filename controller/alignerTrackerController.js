const AlignerTracker = require("../models/alignerTracker");

// Create a new aligner tracker
exports.createAlignerTracker = async (req, res) => {
  try {
    const alignerTracker = new AlignerTracker(req.body);
    const savedTracker = await alignerTracker.save();
    res.status(201).json(savedTracker);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all aligner trackers
exports.getAllAlignerTrackers = async (req, res) => {
  try {
    const trackers = await AlignerTracker.find().populate("patientId");
    res.status(200).json(trackers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a specific aligner tracker by ID
exports.getAlignerTrackerById = async (req, res) => {
  try {
    const tracker = await AlignerTracker.findById(req.params.id).populate(
      "patientId"
    );
    if (!tracker) return res.status(404).json({ message: "Tracker not found" });
    res.status(200).json(tracker);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update an aligner tracker
exports.updateAlignerTracker = async (req, res) => {
  try {
    const updatedTracker = await AlignerTracker.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updatedTracker)
      return res.status(404).json({ message: "Tracker not found" });
    res.status(200).json(updatedTracker);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete an aligner tracker
exports.deleteAlignerTracker = async (req, res) => {
  try {
    const deletedTracker = await AlignerTracker.findByIdAndDelete(
      req.params.id
    );
    if (!deletedTracker)
      return res.status(404).json({ message: "Tracker not found" });
    res.status(200).json({ message: "Tracker deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
