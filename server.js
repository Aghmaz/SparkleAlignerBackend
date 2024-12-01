const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");
const authRoute = require("./routes/authRoutes");
const treatmentPreviewRoutes = require("./routes/treatmentPreviewRoutes");
const alignerTrackerRoutes = require("./routes/alignerTrackerRoutes");
// const { mongoURI } = require("./config");
const bodyParser = require("body-parser");

const app = express();
app.use(express.json());

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

app.use("/api/auth", authRoute);
app.use("/api/auth/treatment-previews", treatmentPreviewRoutes);
app.use("/api/aligner-trackers", alignerTrackerRoutes);
let PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
