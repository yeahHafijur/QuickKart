// functions/index.js (Poori file ko isse badal dein)

const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

// Yeh function tab chalega jab 'orders' me koi naya order aayega
exports.sendNewOrderNotification = functions.database.ref("/orders/{orderId}")
    .onCreate(async (snapshot, context) => {
        
        // 1. Naye order ka data lena
        const orderData = snapshot.val();
        const customerName = orderData.customerName;

        // 2. Notification ka message banana
        const payload = {
            notification: {
                title: "🚀 New QuickKart Order!",
                body: `A new order has been received from ${customerName}.`,
                icon: "/images/icons/icon-512x512.png", // Aapka app icon
            }
        };

        try {
            // 3. Sabhi admin tokens ko database se nikalna
            const tokensSnapshot = await admin.database().ref("/admin_tokens").once("value");
            if (!tokensSnapshot.exists()) {
                console.log("No admin tokens found to send notification.");
                return null;
            }

            // Firebase me token JSON string ki tarah save hai, use parse karna hoga
            const tokens = Object.values(tokensSnapshot.val()).map(t => JSON.parse(t));

            // 4. Sabhi admin devices par notification bhejna
            console.log("Sending notification to all admin devices...");
            const response = await admin.messaging().sendToDevice(tokens, payload);
            console.log("Notifications sent successfully:", response);

        } catch (error) {
            console.error("Failed to send notifications:", error);
        }
        
        return null;
    });