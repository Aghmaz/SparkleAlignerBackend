const OneSignal = require("onesignal-node");

// Initialize OneSignal Client
const client = new OneSignal.Client("YOUR_APP_ID", "YOUR_API_KEY");

// Function to send a notification
const sendNotification = async (userId, message) => {
  try {
    const notification = {
      contents: { en: message },
      include_external_user_ids: [userId], // This should map to OneSignal's user ID
    };

    const response = await client.createNotification(notification);
    console.log("Notification sent:", response);
  } catch (err) {
    console.error("Error sending notification:", err);
  }
};

module.exports = sendNotification;
