const express = require("express");
const router = express.Router();

const {
  createConversation,
  getConversation,
  getConversationList,
} = require("../controller/conversationController.js");
// const fetchuser = require("../middleware/fetchUser.js");

router.post("/", createConversation);
router.get("/:id", getConversation);
router.get("/", getConversationList);

module.exports = router;
