const Conversation = require("../models/conversation.js");
const User = require("../models/user.js");

const createConversation = async (req, res) => {
  try {
    const { members: memberIds } = req.body;

    if (!memberIds) {
      return res.status(400).json({
        error: "Please fill all the fields",
      });
    }

    // Get both users
    const users = await User.find({ _id: { $in: memberIds } });
    if (users.length !== 2) {
      return res.status(400).json({
        error: "Invalid users",
      });
    }

    // Check chat permissions based on roles
    const [user1, user2] = users;
    const isValidChat = checkChatPermissions(user1.role, user2.role);

    if (!isValidChat) {
      return res.status(403).json({
        error: "Users with these roles cannot chat with each other",
      });
    }

    const conv = await Conversation.findOne({
      members: { $all: memberIds },
    }).populate("members", "-password");

    if (conv) {
      // Filter out the current user from the members array
      const otherMembers = conv.members.filter(
        (member) => member._id.toString() !== req.user._id.toString()
      );
      conv.members = otherMembers;
      return res.status(200).json(conv);
    }

    const newConversation = await Conversation.create({
      members: memberIds,
      unreadCounts: memberIds.map((memberId) => ({
        userId: memberId,
        count: 0,
      })),
    });

    await newConversation.populate("members", "-password");

    // Filter out the current user from the members array
    const otherMembers = newConversation.members.filter(
      (member) => member._id.toString() !== req.user._id.toString()
    );
    newConversation.members = otherMembers;

    return res.status(200).json(newConversation);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server Error");
  }
};

// Helper function to check chat permissions
const checkChatPermissions = (role1, role2) => {
  // SuperAdmin can chat with everyone
  if (role1 === "SuperAdmin" || role2 === "SuperAdmin") return true;

  // Agent can chat with everyone
  if (role1 === "Agent" || role2 === "Agent") return true;

  // Manufacturer can only chat with Agent/SuperAdmin
  if (role1 === "Manufacturer" || role2 === "Manufacturer") {
    return false; // Already handled by SuperAdmin/Agent checks above
  }

  // Doctor can only chat with Agent/SuperAdmin
  if (role1 === "Doctor" || role2 === "Doctor") {
    return false; // Already handled by SuperAdmin/Agent checks above
  }

  // Patient can only chat with Agent/SuperAdmin
  if (role1 === "Patient" || role2 === "Patient") {
    return false; // Already handled by SuperAdmin/Agent checks above
  }

  return false;
};

const getConversation = async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.id).populate(
      "members",
      "-password",
      "-phoneNum"
    );

    if (!conversation) {
      return res.status(404).json({
        error: "No conversation found",
      });
    }

    res.status(200).json(conversation);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

const getConversationList = async (req, res) => {
  const userId = req.user.id;

  try {
    const conversationList = await Conversation.find({
      members: { $in: userId },
    }).populate("members", "-password");

    if (!conversationList) {
      return res.status(404).json({
        error: "No conversation found",
      });
    }

    // remove user from members and also other chatbots
    for (let i = 0; i < conversationList.length; i++) {
      conversationList[i].members = conversationList[i].members.filter(
        (member) => member.id !== userId
      );
    }

    conversationList.sort((a, b) => {
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });

    res.status(200).json(conversationList);
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = {
  createConversation,
  getConversation,
  getConversationList,
};
