//react native mobile app code

import React, { useEffect } from "react";
import messaging from "@react-native-firebase/messaging";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const App = () => {
  useEffect(() => {
    setupPushNotifications();
  }, []);

  const setupPushNotifications = async () => {
    try {
      // Request permission
      const authStatus = await messaging().requestPermission();
      const enabled = authStatus === messaging.AuthorizationStatus.AUTHORIZED;

      if (!enabled) {
        console.log("User declined push notifications");
        return;
      }

      // Get FCM token
      const fcmToken = await messaging().getToken();
      if (fcmToken) {
        const storedToken = await AsyncStorage.getItem("fcmToken");
        if (storedToken !== fcmToken) {
          // Send FCM token to backend
          await updateFCMToken(fcmToken);
          await AsyncStorage.setItem("fcmToken", fcmToken);
        }
      }

      // Listen for token refresh
      messaging().onTokenRefresh(async (newToken) => {
        await updateFCMToken(newToken);
        await AsyncStorage.setItem("fcmToken", newToken);
      });

      // Handle background messages
      messaging().setBackgroundMessageHandler(async (remoteMessage) => {
        console.log("Background message:", remoteMessage);
        handleNotification(remoteMessage);
      });

      // Handle foreground messages
      const unsubscribe = messaging().onMessage(async (remoteMessage) => {
        console.log("Foreground message:", remoteMessage);
        handleNotification(remoteMessage);
      });

      return unsubscribe;
    } catch (error) {
      console.error("Error setting up push notifications:", error);
    }
  };

  const updateFCMToken = async (token) => {
    try {
      await axios.post(
        "/api/user/fcm-token",
        { fcmToken: token },
        {
          headers: {
            Authorization: `Bearer ${yourAuthToken}`,
          },
        }
      );
    } catch (error) {
      console.error("Error updating FCM token:", error);
    }
  };

  const handleNotification = (remoteMessage) => {
    // Handle different notification types
    switch (remoteMessage.data?.type) {
      case "chat":
        // Navigate to chat screen
        break;
      case "reminder":
        // Show reminder notification
        break;
      default:
      // Handle other notification types
    }
  };

  return (
    // Your app components
    <></>
  );
};

export default App;
