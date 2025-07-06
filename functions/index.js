const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const { getMessaging } = require("firebase-admin/messaging");
const { logger } = require("firebase-functions/logger");

initializeApp();

exports.notifyNewOrder = onDocumentCreated(
  {
    document: "orders/{orderId}",
    region: "us-east1", // Explicit region
    maxInstances: 10, // Better concurrency control
  },
  async (event) => {
    try {
      const orderId = event.params.orderId;
      const orderData = event.data?.data();

      logger.log(`New order created: ${orderId}`, orderData);

      const payload = {
        notification: {
          title: "New Order!",
          body: `Order #${orderId} has been placed`,
          icon: "/icon-192x192.png",
          click_action: "https://your-app.com/orders",
        },
        data: {
          orderId: orderId,
          type: "new_order",
        },
      };

      const firestore = getFirestore();
      const tokensSnapshot = await firestore
        .collection("fcmTokens")
        .where("valid", "==", true)
        .get();

      const tokens = tokensSnapshot.docs.map((doc) => doc.id);

      if (tokens.length === 0) {
        logger.log("No valid FCM tokens found");
        return null;
      }

      logger.log(`Sending notification to ${tokens.length} tokens`);

      const messaging = getMessaging();
      const response = await messaging.sendToDevice(tokens, payload);

      // Simplified error handling - just log the response structure
      if (response) {
        logger.log("Response received from FCM");
        logger.log("Response structure:", JSON.stringify(response, null, 2));

        // Only process results if they exist and are in expected format
        if (response.results && Array.isArray(response.results)) {
          logger.log(`Processing ${response.results.length} results`);

          const failedTokens = [];

          for (let i = 0; i < response.results.length; i++) {
            const result = response.results[i];

            // Check if result exists and has expected structure
            if (result && typeof result === "object") {
              if (result.error) {
                logger.error(`Error sending to token ${i}:`, result.error);
                if (
                  result.error.code ===
                    "messaging/invalid-registration-token" ||
                  result.error.code ===
                    "messaging/registration-token-not-registered"
                ) {
                  failedTokens.push(tokensSnapshot.docs[i].ref);
                }
              } else if (result.messageId) {
                logger.log(`Successfully sent to token ${i}`);
              } else {
                logger.warn(
                  `Unexpected result structure for token ${i}:`,
                  result
                );
              }
            } else {
              logger.warn(`Invalid result for token ${i}:`, result);
            }
          }

          // Clean up failed tokens
          if (failedTokens.length > 0) {
            try {
              const batch = firestore.batch();
              failedTokens.forEach((ref) =>
                batch.update(ref, { valid: false })
              );
              await batch.commit();
              logger.log(`Marked ${failedTokens.length} tokens as invalid`);
            } catch (cleanupError) {
              logger.error("Error cleaning up failed tokens:", cleanupError);
            }
          }
        } else {
          logger.log("No results array in response");
        }
      } else {
        logger.log("No response received from FCM");
      }

      logger.log("Notification process completed");
      return null;
    } catch (error) {
      logger.error("Error in notifyNewOrder:", error);
      throw error;
    }
  }
);
