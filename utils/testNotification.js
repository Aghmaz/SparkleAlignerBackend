const notificationService = require("../services/notificationService");

const testNotification = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    await notificationService.sendPushNotification(
      user.fcmTokens,
      "Test Notification",
      "This is a test notification",
      { type: "test" }
    );

    console.log("Test notification sent successfully");
  } catch (error) {
    console.error("Error sending test notification:", error);
  }
};

module.exports = testNotification;
