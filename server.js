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
const manufacturerRoutes = require("./routes/manufacturerRoutes");

const http = require("http");
const { Server } = require("socket.io");
const bodyParser = require("body-parser");
const { initSocket } = require("./socket");

const app = express();
app.use(express.json());
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET,POST,PUT,PATCH,DELETE",
    credentials: true,
  })
);
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("connected to mongodb"))
  .catch((error) => console.log("couldn't connected to mongodb"));

// Socket.io setup
initSocket(server); // Initialize socket.io logic

// Routes
app.get("/", (req, res) => {
  res.send("Hello World");
});
app.use("/api/auth", authRoute);
app.use("/api/auth/treatment-previews", treatmentPreviewRoutes);
app.use("/api/aligner-trackers", alignerTrackerRoutes);
app.use("/api/manufacturers", manufacturerRoutes);
app.use("/message", messageRoute);
app.use("/conversation", conversationRoute);
let PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
