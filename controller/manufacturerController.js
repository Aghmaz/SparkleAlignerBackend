const Manufacturer = require("../models/manufacturer");

// Create a new manufacturer
exports.createManufacturer = async (req, res) => {
  try {
    const manufacturer = new Manufacturer(req.body);
    const savedManufacturer = await manufacturer.save();
    res.status(201).json(savedManufacturer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all manufacturers
exports.getAllManufacturers = async (req, res) => {
  try {
    const manufacturers = await Manufacturer.find();
    res.status(200).json(manufacturers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a specific manufacturer by ID
exports.getManufacturerById = async (req, res) => {
  try {
    const manufacturer = await Manufacturer.findById(req.params.id);
    if (!manufacturer)
      return res.status(404).json({ message: "Manufacturer not found" });
    res.status(200).json(manufacturer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a manufacturer
exports.updateManufacturer = async (req, res) => {
  try {
    const updatedManufacturer = await Manufacturer.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updatedManufacturer)
      return res.status(404).json({ message: "Manufacturer not found" });
    res.status(200).json(updatedManufacturer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a manufacturer
exports.deleteManufacturer = async (req, res) => {
  try {
    const deletedManufacturer = await Manufacturer.findByIdAndDelete(
      req.params.id
    );
    if (!deletedManufacturer)
      return res.status(404).json({ message: "Manufacturer not found" });
    res.status(200).json({ message: "Manufacturer deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
