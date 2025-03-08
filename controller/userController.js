const User = require("../models/user");
const bcrypt = require("bcrypt");
const { registerSchema, loginSchema } = require("../utilis/validate");
const jwt = require("jsonwebtoken");
const errorHandler = require("../middleware/error");

// Create a new user
exports.createUser = async (req, res) => {
  try {
    const user = new User(req.body);
    const savedUser = await user.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a specific user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a user
exports.updateUser = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedUser)
      return res.status(404).json({ message: "User not found" });
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// patient wear aligner
exports.patientWearAligner = async (req, res) => {
  try {
    const { selectedAligner, minutesLeft, outTime, notificationTimer, displayedAligner, isWearing } = req.body;
    const user = await User.findById(req.params.id);
    user.alignerReminders.push({ selectedAligner, minutesLeft, outTime, notificationTimer, displayedAligner, isWearing });
    await user.save();
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

// Delete a user
exports.deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser)
      return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// client, doctor, agent (Signup route )
exports.signup = errorHandler(async (req, res) => {
  const { error } = registerSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details });

  const { name, email, password, role, treatment_details, status, profile } =
    req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(409).send({ message: "Email is already in use" });
  }

  const salt = await bcrypt.genSalt(1);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = new User({
    name,
    email,
    password: hashedPassword,
    role,
    treatment_details,
    status,
    profile,
  });

  const savedUser = await newUser.save();

  res.status(200).send({
    message: "Registration successful!",
    user: {
      name: savedUser.name,
      email: savedUser.email,
      role: savedUser.role,
      password: savedUser.password,
      status: savedUser.status,
      profile: savedUser.profile,
      treatment_details: savedUser.treatment_details,
    },
  });
});

// login route (client, doctor, agent)
exports.login = errorHandler(async (req, res) => {
  try {
    console.log(req.body, "req.body");
    const { error } = loginSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details });
    // Find the user with the specified email address
    const user = await User.findOne({ email: req.body.email });
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
        role: user.role
      },
      "abcdef"
    );

    // Send the token and userId in the response
    res.status(200).json({
      token: token,
      password: user.password,
      email: user.email,
      id: user._id,
      name: user.name,
      role: user.role,
    });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// admin login route
exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body; //destructing the req here
    console.log(email, password, " email, password");
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
      res.status(200).json({
        message: "Login successfully",
        token,
        email,
        id: 1,
        role: "SuperAdmin",
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Fetch media for a specific patient
exports.getPatientMedia = async (req, res) => {
  try {
    // Fetch the user (patient) by ID
    const user = await User.findById(req.params.id);

    // Check if user exists and is a patient
    if (!user || user.role !== "Patient") {
      return res.status(404).json({ message: "Patient not found" });
    }

    // Return media array (previous images)
    res.status(200).json(user.media);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update the media for a patient (upload new media)
exports.uploadPatientMedia = async (req, res) => {
  try {
    // Assuming the media is sent as part of form-data with 'fileUrl'
    const { fileUrl } = req.body;

    // Validate that the media URL is provided
    if (!fileUrl) {
      return res.status(400).json({ message: "File URL is required" });
    }

    // Fetch the user (patient) by ID
    const user = await User.findById(req.params.id);

    // Check if user exists and is a patient
    if (!user || user.role !== "Patient") {
      return res.status(404).json({ message: "Patient not found" });
    }

    // Add the new media (image) to the media array
    user.media.push({ fileUrl });
    await user.save();

    res
      .status(200)
      .json({ message: "Media uploaded successfully", media: user.media });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getOnlineStatus = async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ isOnline: user.isOnline });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
};

const updateOneSignalId = async (req, res) => {
  try {
    const { oneSignalId } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { oneSignalId },
      { new: true }
    );
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to update OneSignal ID" });
  }
};

exports.updateFCMToken = async (req, res) => {
  try {
    const { fcmToken } = req.body;
    const userId = req.user._id;

    if (!fcmToken) {
      return res.status(400).json({ error: "FCM token is required" });
    }

    const user = await User.findById(userId);

    // Add token if it doesn't exist
    if (!user.fcmTokens.includes(fcmToken)) {
      user.fcmTokens.push(fcmToken);
      await user.save();
    }

    res.status(200).json({ message: "FCM token updated successfully" });
  } catch (error) {
    console.error("Error updating FCM token:", error);
    res.status(500).json({ error: "Failed to update FCM token" });
  }
};
