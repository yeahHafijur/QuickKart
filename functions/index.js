// functions/index.js (CORRECTED CODE FOR LATEST FIREBASE SDK)

const { onValueCreated } = require("firebase-functions/v2/database");
const admin = require("firebase-admin");

admin.initializeApp();
const db = admin.database();

/**
 * Cloud Function to handle awarding referral and purchase coupons.
 * Triggers when a new order is created in `/orders/{orderId}`.
 * This uses the modern v2 SDK syntax.
 */
exports.awardCouponsOnFirstOrder = onValueCreated(
  {
    ref: "/orders/{orderId}",
    region: "asia-southeast1", // Aapke database ka region
  },
  async (event) => {
    // Naye SDK mein, data event.data ke andar hota hai
    const snapshot = event.data;
    const orderData = snapshot.val();
    
    if (!orderData) {
        console.log("Order data is null. Exiting function.");
        return null;
    }
    
    const userId = orderData.userId;

    // 1. Check if this is the user's first order
    const userOrdersSnapshot = await db.ref('orders').orderByChild('userId').equalTo(userId).once('value');
    if (userOrdersSnapshot.numChildren() !== 1) {
        console.log(`Not the first order for user ${userId}. Exiting.`);
        return null;
    }

    console.log(`Processing first order for user ${userId}.`);
    const userRef = db.ref(`users/${userId}`);

    // 2. Naye user ko uske order value ke hisaab se coupons do
    const itemTotal = orderData.totalAmount - orderData.deliveryFee;
    const purchaseCoupons = Math.floor(itemTotal / 100) * 10;

    if (purchaseCoupons > 0) {
        await userRef.child('couponBalance').set(admin.database.ServerValue.increment(purchaseCoupons));
        console.log(`Awarded ${purchaseCoupons} purchase coupons to new user ${userId}.`);
    }

    // 3. Check karo ki user ko kisi ne refer kiya hai ya nahi
    const userSnapshot = await userRef.once('value');
    const userData = userSnapshot.val();
    
    if (!userData || !userData.referredBy) {
        console.log(`User ${userId} was not referred. No referral bonus to award.`);
        return null;
    }
    
    const referrerCode = userData.referredBy;

    // 4. Jisne refer kiya hai use dhoondho aur 500 coupons do
    const referrerQuery = await db.ref('users').orderByChild('referralCode').equalTo(referrerCode).limitToFirst(1).once('value');

    if (!referrerQuery.exists()) {
        console.log(`Referrer with code ${referrerCode} not found.`);
        return null;
    }

    const [referrerId] = Object.keys(referrerQuery.val());
    
    const referrerRef = db.ref(`users/${referrerId}`);
    await referrerRef.child('couponBalance').set(admin.database.ServerValue.increment(500));
    
    console.log(`Successfully awarded 500 referral coupons to user ${referrerId} for referring ${userId}.`);
    return null;
  }
);