const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");

// CRUD Routes
router.post("/user", userController.createUser);
router.get("/users", userController.getAllUsers);
router.get("/user/:id", userController.getUserById);
router.put("/user/:id", userController.updateUser);
router.delete("/user/:id", userController.deleteUser);

// client + doctor + agent (Signup route)
router.post("/signup", userController.signup);

// login route (agent,client,doctor)
router.post("/login", userController.login);

// admin login route
router.post("/admin", userController.adminLogin);

module.exports = router;
