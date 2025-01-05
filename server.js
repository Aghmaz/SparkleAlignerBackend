const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");
const authRoute = require("./routes/authRoutes");
const messageRoute = require("./routes/messageRoute");
const conversationRoute = require("./routes/conversationRoute");
const treatmentPreviewRoutes = require("./routes/treatmentPreviewRoutes");
const alignerTrackerRoutes = require("./routes/alignerTrackerRoutes");
// const { mongoURI } = require("./config");
const Chat = require("./models/chat");
const sendNotification = require("./routes/sendNotfication");
const patientDataByTheAgentForManufacturerRoutes = require("./routes/manufacturerRoutes");
const treatmentPreviewByAgentRoutes = require("./routes/treatmentPreviewByAgentRoutes");
const patientApprovalRoutes = require("./routes/patientApprovalRoutes");
const doctorApprovalRoutes = require("./routes/doctorApprovalRoutes");
const finalStagePreviewRoutes = require("./routes/finalStagePreviewForDoctorByAgentRoutes");
const http = require("http");
const { Server } = require("socket.io");
const bodyParser = require("body-parser");
const { initSocket } = require("./socket");
const { setupReminderJobs } = require("./services/reminderService");
const setupSocket = require("./socket/socketHandler");

const app = express();
app.use(express.json());
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("connected to mongodb"))
  .catch((error) => console.log("couldn't connected to mongodb"));

// Socket.io setup
// initSocket(server); // Initialize socket.io logic

// Setup socket
setupSocket(server);

// Routes
app.get("/", (req, res) => {
  res.send("Hello World");
});
app.use("/api/auth", authRoute);
app.use("/api/auth/treatment-previews", treatmentPreviewRoutes);
app.use("/api/aligner-trackers", alignerTrackerRoutes);
app.use(
  "/api/patient-Data-By-The-Agent-For-Manufacturer",
  patientDataByTheAgentForManufacturerRoutes
);
app.use("/message", messageRoute);
app.use("/conversation", conversationRoute);
app.use("/api/user/treatment-preview-by-agent", treatmentPreviewByAgentRoutes);
app.use("/api/user/patient-approval", patientApprovalRoutes);
app.use("/api/user/doctor-approval", doctorApprovalRoutes);
app.use("/api/final-stage-preview", finalStagePreviewRoutes);
server.listen(process.env.PORT || 8000, () => {
  console.log(`Server running on port ${process.env.PORT || 8000}`);
});

setupReminderJobs();

module.exports = app;
