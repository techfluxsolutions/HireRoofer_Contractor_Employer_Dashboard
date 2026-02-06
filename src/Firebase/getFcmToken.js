import { getToken } from "firebase/messaging";
import { messaging } from "./Firebase";

export const getFcmToken = async () => {
  try {
    if (!messaging) return "";

    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.warn("❌ Notification permission denied");
      return "";
    }

    const registration = await navigator.serviceWorker.ready;

    console.log("✅ SW ready:", registration);
    console.log("✅ SW controller:", navigator.serviceWorker.controller);

    const token = await getToken(messaging, {
      vapidKey:
        "BLJ3A-wDdIzT4GlJu_OxK8UaPzeQH32sZF8trUO1_-tHyRVmXnS8cODFO-N61JQHGVXb4pqH8WScbTiuPh3nDac",
      serviceWorkerRegistration: registration,
    });

    if (!token) {
      console.warn("❌ FCM token is NULL");
      return "";
    }

    console.log("🎯 FCM TOKEN:", token);
    return token;
  } catch (err) {
    console.error("❌ FCM token error:", err);
    return "";
  }
};
