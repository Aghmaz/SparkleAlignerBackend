import messaging from "@react-native-firebase/messaging";

export async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled = authStatus === messaging.AuthorizationStatus.AUTHORIZED;
  return enabled;
}

export async function getFCMToken() {
  try {
    const token = await messaging().getToken();
    return token;
  } catch (error) {
    console.log("Error getting FCM token:", error);
    return null;
  }
}

export const setupFCMListeners = () => {
  // Handle background messages
  messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    console.log("Message handled in the background!", remoteMessage);
  });

  // Handle foreground messages
  const unsubscribe = messaging().onMessage(async (remoteMessage) => {
    // Show local notification
    showLocalNotification(remoteMessage);
  });

  return unsubscribe;
};
