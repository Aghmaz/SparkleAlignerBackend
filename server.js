const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");
const authRoute = require("./routes/authRoutes");
const treatmentPreviewRoutes = require("./routes/treatmentPreviewRoutes");
const alignerTrackerRoutes = require("./routes/alignerTrackerRoutes");
// const { mongoURI } = require("./config");
const Chat = require("./models/chat");
const sendNotification = require("./routes/sendNotfication");
const http = require("http");
const { Server } = require("socket.io");
const bodyParser = require("body-parser");

const app = express();
app.use(express.json());
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: "GET,POST,PUT,PATCH,DELETE",
    credentials: true,
  })
);
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("connected to mongodb"))
  .catch((error) => console.log("couldn't connected to mongodb"));

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Handle receiving a message
  socket.on("sendMessage", async (data) => {
    try {
      const newMessage = new Chat({
        senderId: data.senderId,
        receiverId: data.receiverId,
        message: data.message,
      });

      // Save to MongoDB
      await newMessage.save();

      // Broadcast the message to the receiver
      io.to(data.receiverId).emit("receiveMessage", newMessage);

      // Send a push notification to the receiver
      await sendNotification(data.receiverId, "You have a new message!");
    } catch (error) {
      console.error("Error handling message:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});

app.use("/api/auth", authRoute);
app.use("/api/auth/treatment-previews", treatmentPreviewRoutes);
app.use("/api/aligner-trackers", alignerTrackerRoutes);
let PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
