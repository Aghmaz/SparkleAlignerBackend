import { useEffect } from "react";

export const useNotifications = () => {
  useEffect(() => {
    const setupWebNotifications = async () => {
      try {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
          const registration = await navigator.serviceWorker.register("/sw.js");
          const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: process.env.REACT_APP_VAPID_PUBLIC_KEY,
          });

          // Send subscription to backend
          await updateWebPushSubscription(subscription);
        }
      } catch (error) {
        console.error("Error setting up notifications:", error);
      }
    };

    if ("Notification" in window) {
      setupWebNotifications();
    }
  }, []);
};
