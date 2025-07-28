

const functions = require("firebase-functions");
const admin = require("firebase-admin");
const webpush = require("web-push");
const { onValueCreated } = require("firebase-functions/v2/database");

admin.initializeApp();

const db = admin.database();

// --- YAHAN APNI VAPID KEYS DAALEIN (Jaisa pehle kiya tha) ---
const vapidKeys = {
      publicKey: "BD7ekfMaxKz0kUHWYFlGc1H4HJh_vVLlHVNA-AWhBbKgAakjBkpEXG8x9hWSnra5g8rxBH5dOd65L_oBukyBHfQ",
      privateKey: "QCL98nhFkGr6aatugOTI_PjqADxaFpQS5lPE8mL4lPs",
};

webpush.setVapidDetails(
  "mailto:hafijurnits@gmail.com",
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

exports.sendNewOrderNotification = onValueCreated(
  {
    ref: "/orders/{orderId}",
    region: "asia-southeast1", // <-- YEH LINE ADD KI GAYI HAI
  },
  async (event) => {
    const newOrder = event.data.val();

    if (!newOrder) {
        console.log("New order data is null, exiting function.");
        return null;
    }

    const notificationPayload = {
      title: "🚀 New QuickKart Order!",
      body: `New order from ${newOrder.customerName} for ₹${newOrder.totalAmount}.`,
      icon: "images/icons/icon-192x192.png",
    };

    try {
      const tokensSnapshot = await db.ref("admin_tokens").once("value");
      const tokensData = tokensSnapshot.val();

      if (!tokensData) {
        console.log("No admin tokens found to send notification.");
        return null;
      }

      const promises = [];
      for (const uid in tokensData) {
        if (Object.prototype.hasOwnProperty.call(tokensData, uid)) {
          const subscription = JSON.parse(tokensData[uid]);
          promises.push(
            webpush.sendNotification(
              subscription,
              JSON.stringify(notificationPayload)
            )
          );
        }
      }

      await Promise.all(promises);
      console.log("Notifications sent successfully.");
      return null;
    } catch (error) {
      console.error("Error sending notification:", error);
      return null;
    }
  }
);