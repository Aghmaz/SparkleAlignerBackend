const express = require("express");
const router = express.Router();
const { registerSchema, loginSchema } = require("../utilis/validate");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../config");
const errorHandler = require("../middleware/error");
const user = require("../models/user");

// client + doctor + agent (Signup route)
router.post(
  "/signup",
  errorHandler(async (req, res) => {
    const { error } = registerSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details });

    const { name, email, password } = req.body;

    const existingUser = await user.findOne({ email });
    if (existingUser) {
      return res.status(409).send({ message: "Email is already in use" });
    }

    const salt = await bcrypt.genSalt(1);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new user({
      name,
      email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();

    res.status(200).send({
      message: "Registration successful!",
      User: {
        name: savedUser.name,
        email: savedUser.email,
      },
    });
  })
);

// login route (agent,client,doctor)
router.post(
  "/login",
  errorHandler(async (req, res) => {
    try {
      const { error } = loginSchema.validate(req.body);
      if (error) return res.status(400).json({ error: error.details });
      // Find the user with the specified email address
      const user = await user.findOne({ email: req.body.email });
      if (!user) {
        return res.status(400).json({ error: "Invalid email or password" });
      }

      // Compare the password with the hashed password
      const passwordMatch = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (!passwordMatch) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      // Create and sign a JWT token
      const token = jwt.sign(
        {
          email: user.email,
          userId: user._id,
          password: user.password,
        },
        "abcdef"
      );

      // Send the token and userId in the response
      res.status(200).json({
        token: token,
        password: user.password,
        email: user.email,
        userId: user._id,
        name: user.name,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  })
);

// admin login route
router.post("/admin", async (req, res) => {
  try {
    const { email, password } = req.body; //destructing the req here

    const { error } = loginSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details });
    if (
      email !== "sparkleAligner@gmail.com" &&
      password !== "sparkleAlignerAdmin"
    ) {
      return res.status(400).json({ error: "Invalid email or password" });
    }
    // if creds match
    if (
      email === "sparkleAligner@gmail.com" &&
      password === "sparkleAlignerAdmin"
    ) {
      // Create and sign a JWT token
      const token = jwt.sign({ email }, "sparklealignertoken");

      // Send the token and userId in the response
      res.status(200).json({ message: "Login successfully", token });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});
module.exports = router;
