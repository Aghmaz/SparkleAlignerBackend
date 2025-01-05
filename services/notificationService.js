const admin = require("firebase-admin");
const User = require("../models/user");

// Initialize Firebase Admin with your service account

var serviceAccount = require("../sparklealigner-firebase-adminsdk-bqavz-474463a343.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const notificationService = {
  sendPushNotification: async (tokens, title, body, data = {}) => {
    try {
      const message = {
        notification: {
          title,
          body,
        },
        data,
        tokens: tokens.filter((token) => token.length > 0),
      };

      const response = await admin.messaging().sendMulticast(message);
      console.log("Successfully sent notifications:", response);
      return response;
    } catch (error) {
      console.error("Error sending notification:", error);
      throw error;
    }
  },

  sendChatNotification: async (receiverId, senderName, messageText) => {
    try {
      const receiver = await User.findById(receiverId);
      if (!receiver?.fcmTokens?.length) return;

      await notificationService.sendPushNotification(
        receiver.fcmTokens,
        "New Message",
        `${senderName}: ${messageText}`,
        {
          type: "chat",
          senderId: senderName,
          messageId: messageText,
        }
      );
    } catch (error) {
      console.error("Error sending chat notification:", error);
    }
  },

  sendReminderNotification: async (user, reminderType) => {
    try {
      if (!user.fcmTokens?.length) return;

      await notificationService.sendPushNotification(
        user.fcmTokens,
        "Aligner Reminder",
        `Time to ${reminderType === "wear" ? "wear" : "remove"} your aligners!`,
        {
          type: "reminder",
          reminderType,
        }
      );
    } catch (error) {
      console.error("Error sending reminder notification:", error);
    }
  },
};

module.exports = notificationService;
