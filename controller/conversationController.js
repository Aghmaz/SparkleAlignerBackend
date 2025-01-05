const Conversation = require("../models/conversation");

const createConversation = async (req, res) => {
  console.log("=== Create Conversation ===");
  console.log("User:", req.user);
  console.log("Body:", req.body);

  try {
    const { members } = req.body;
    console.log("Creating conversation with members:", members);

    if (!members || !Array.isArray(members) || members.length !== 2) {
      console.log("Invalid members data:", members);
      return res.status(400).json({
        message: "Invalid members data",
        received: members,
      });
    }

    // Validate member IDs
    if (!members.every((id) => id && id.match(/^[0-9a-fA-F]{24}$/))) {
      console.log("Invalid member ID format");
      return res.status(400).json({
        message: "Invalid member ID format",
        received: members,
      });
    }

    // Check if conversation already exists
    const existingConversation = await Conversation.findOne({
      members: { $all: members },
    });

    if (existingConversation) {
      console.log("Found existing conversation:", existingConversation);
      return res.status(200).json(existingConversation);
    }

    // Create new conversation
    const newConversation = new Conversation({
      members,
      latestMessage: "",
      isGroup: false,
      unreadCounts: members.map((userId) => ({
        userId,
        count: 0,
      })),
    });

    const savedConversation = await newConversation.save();
    console.log("Created new conversation:", savedConversation);
    res.status(201).json(savedConversation);
  } catch (error) {
    console.error("Error in createConversation:", error);
    res.status(500).json({
      message: "Error creating conversation",
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};

const getConversation = async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.id);
    res.status(200).json(conversation);
  } catch (error) {
    console.error("Error in getConversation:", error);
    res.status(500).json(error);
  }
};

const getConversationList = async (req, res) => {
  try {
    const userId = req.user.userId; // From auth middleware
    const conversations = await Conversation.find({
      members: { $in: [userId] },
    });
    res.status(200).json(conversations);
  } catch (error) {
    console.error("Error in getConversationList:", error);
    res.status(500).json(error);
  }
};

module.exports = {
  createConversation,
  getConversation,
  getConversationList,
};
