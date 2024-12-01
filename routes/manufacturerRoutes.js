const express = require("express");
const router = express.Router();
const manufacturerController = require("../controller/manufacturerController");

// CRUD Routes
router.post("/", manufacturerController.createManufacturer);
router.get("/", manufacturerController.getAllManufacturers);
router.get("/:id", manufacturerController.getManufacturerById);
router.put("/:id", manufacturerController.updateManufacturer);
router.delete("/:id", manufacturerController.deleteManufacturer);

module.exports = router;
