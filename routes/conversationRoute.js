const express = require("express");
const router = express.Router();

const {
  createConversation,
  getConversation,
  getConversationList,
} = require("../controller/conversationController.js");
// const fetchuser = require("../middleware/fetchUser.js");
const auth = require("../middleware/authMiddleware.js");
router.post("/", auth, createConversation);
router.get("/:id", auth, getConversation);
router.get("/", auth, getConversationList);

module.exports = router;
