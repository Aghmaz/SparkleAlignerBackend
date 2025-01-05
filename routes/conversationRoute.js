const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const {
  createConversation,
  getConversation,
  getConversationList,
} = require("../controller/conversationController");

// Debug middleware
router.use((req, res, next) => {
  console.log("Conversation Route:", req.method, req.originalUrl);
  console.log("Request Body:", req.body);
  console.log("Auth Header:", req.headers.authorization);
  next();
});

router.post("/", auth, createConversation);
router.get("/:id", auth, getConversation);
router.get("/", auth, getConversationList);

module.exports = router;
