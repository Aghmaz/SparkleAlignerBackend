const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");

const {
  sendMessage,
  allMessage,
  deletemesage,
  getPresignedUrl,
} = require("../controller/messageController.js");

router.get("/presigned-url", auth, getPresignedUrl);
router.get("/:id/:userid", auth, allMessage);
router.post("/send", auth, sendMessage);
router.post("/delete", auth, deletemesage);

module.exports = router;
