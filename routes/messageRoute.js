const express = require("express");
const router = express.Router();

const {
  sendMessage,
  allMessage,
  deletemesage,
  getPresignedUrl,
} = require("../controller/messageController.js");
// const fetchuser = require("../middleware/fetchUser.js");

router.get("/presigned-url", getPresignedUrl);
router.get("/:id/:userid", allMessage);
router.post("/send", sendMessage);
router.post("/delete", deletemesage);

module.exports = router;
