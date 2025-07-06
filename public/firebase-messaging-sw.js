importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyDg3fiwXB_F0_kUB3bLdkAYdWYKUPIsP4A",
  authDomain: "yums-food.firebaseapp.com",
  projectId: "yums-food",
  storageBucket: "yums-food.appspot.com",
  messagingSenderId: "609112477058",
  appId: "1:609112477058:web:8233839cbda6ab6f1ad39b",
});

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage(function (payload) {
  console.log("Received background message:", payload);

  const notificationTitle = payload.notification?.title || "New Order!";
  const notificationOptions = {
    body: payload.notification?.body || "A new order has arrived",
    icon: "/icon-192x192.png",
    badge: "/icon-192x192.png",
    data: payload.data || {},
    requireInteraction: true, // Keep notification until user interacts
    actions: [
      {
        action: "view",
        title: "View Order",
      },
      {
        action: "close",
        title: "Close",
      },
    ],
  };

  console.log("Showing notification:", notificationTitle, notificationOptions);

  return self.registration.showNotification(
    notificationTitle,
    notificationOptions
  );
});

// Handle notification clicks
self.addEventListener("notificationclick", function (event) {
  console.log("Notification click received:", event);
  event.notification.close();

  if (event.action === "view") {
    event.waitUntil(clients.openWindow("/orders"));
  } else if (event.action === "close") {
    // Just close the notification
    event.notification.close();
  } else {
    // Default action - open the app
    event.waitUntil(clients.openWindow("/"));
  }
});

// Handle push events (for compatibility)
self.addEventListener("push", function (event) {
  console.log("Push event received:", event);

  if (event.data) {
    try {
      const data = event.data.json();
      console.log("Push data:", data);

      const options = {
        body: data.body || data.notification?.body || "New notification",
        icon: data.icon || "/icon-192x192.png",
        badge: "/icon-192x192.png",
        data: data.data || {},
        requireInteraction: true,
      };

      event.waitUntil(
        self.registration.showNotification(
          data.title || data.notification?.title || "Notification",
          options
        )
      );
    } catch (error) {
      console.error("Error parsing push data:", error);
    }
  }
});

// Log when service worker is installed
self.addEventListener("install", function (event) {
  console.log("Firebase messaging service worker installed");
});

// Log when service worker is activated
self.addEventListener("activate", function (event) {
  console.log("Firebase messaging service worker activated");
});
