"use client";

import { useEffect, useState } from "react";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import firebaseApp from "@/lib/firebase";

const VAPID_KEY =
  "BD06szni0ox0inOvziZuKIdto8QC6nJpC5d5KY2QsX1yOsGBD68bkPDqM8HX0g2d3pFrgUz_c_DHt5kf72usKXM";

export function PushNotificationsManager() {
  const [permission, setPermission] =
    useState<NotificationPermission>("default");
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if we're in a browser environment with required APIs
    if (
      typeof window === "undefined" ||
      !("serviceWorker" in navigator) ||
      !("Notification" in window)
    ) {
      setError("Push notifications are not supported in this environment.");
      return;
    }

    // Initialize Firebase services only in browser
    const messaging = getMessaging(firebaseApp);
    const db = getFirestore(firebaseApp);

    if (permission === "granted" && !token) {
      getToken(messaging, { vapidKey: VAPID_KEY })
        .then((currentToken) => {
          console.log("FCM Token:", currentToken);
          if (currentToken) {
            setToken(currentToken);
            setDoc(doc(db, "fcmTokens", currentToken), {
              createdAt: new Date(),
              valid: true,
            });
          } else {
            setError("No registration token available.");
          }
        })
        .catch((err) => {
          setError("An error occurred while retrieving token. " + err);
        });
    }
  }, [permission, token]);

  useEffect(() => {
    // Only set up message listener if we have a token and are in browser
    if (
      typeof window === "undefined" ||
      !("serviceWorker" in navigator) ||
      !("Notification" in window) ||
      !token
    ) {
      return;
    }

    const messaging = getMessaging(firebaseApp);
    const unsubscribe = onMessage(messaging, (payload) => {
      alert(payload.notification?.title || "New notification");
    });
    return unsubscribe;
  }, [token]);

  const requestPermission = async () => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      setError("Notifications are not supported in this environment.");
      return;
    }
    const result = await Notification.requestPermission();
    setPermission(result);
  };

  if (error) {
    return <div className="text-red-600">{error}</div>;
  }
  if (permission !== "granted") {
    return (
      <button
        onClick={requestPermission}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Enable Notifications
      </button>
    );
  }
  if (token) {
    return <div className="text-green-600">Notifications enabled!</div>;
  }
  return null;
}
