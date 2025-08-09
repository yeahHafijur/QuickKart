// functions/index.js (FINAL CODE WITH NEW RULES)

const { onValueUpdated } = require("firebase-functions/v2/database");
const admin = require("firebase-admin");

admin.initializeApp();
const db = admin.database();

/**
 * Cloud Function to award coupons when an order's status is updated to 'Completed'.
 * New Rules: 50 coupons for referral, 1 coupon per Rs. 10 spent.
 */
exports.awardCouponsOnOrderComplete = onValueUpdated(
  {
    ref: "/orders/{orderId}",
    region: "asia-southeast1",
  },
  async (event) => {
    const beforeData = event.data.before.val();
    const afterData = event.data.after.val();

    // Sirf tabhi aage badho jab status 'Completed' hua ho
    if (beforeData.status === 'Completed' || afterData.status !== 'Completed') {
      console.log(`Order status not changed to 'Completed'. Exiting.`);
      return null;
    }

    console.log(`Order ${event.params.orderId} completed. Processing coupons.`);
    const userId = afterData.userId;
    const userRef = db.ref(`users/${userId}`);

    // 1. Check karo ki yeh user ka pehla COMPLETED order hai ya nahi
    const userOrdersSnapshot = await db.ref('orders').orderByChild('userId').equalTo(userId).once('value');
    const userOrders = userOrdersSnapshot.val();
    let completedOrderCount = 0;
    if (userOrders) {
        for (const orderId in userOrders) {
            if (userOrders[orderId].status === 'Completed') {
                completedOrderCount++;
            }
        }
    }
    
    // Sirf pehle completed order par hi bonus do
    if (completedOrderCount !== 1) {
        console.log(`Not the first completed order for user ${userId}. Exiting.`);
        return null;
    }

    // 2. Naye user ko khareedari ka coupon do
    // NAYA RULE: Har 10 rupay par 1 coupon
    const itemTotal = afterData.totalAmount - afterData.deliveryFee;
    const purchaseCoupons = Math.floor(itemTotal / 10); // 10 se divide karke 1 se multiply

    if (purchaseCoupons > 0) {
      await userRef.child('couponBalance').set(admin.database.ServerValue.increment(purchaseCoupons));
      console.log(`Awarded ${purchaseCoupons} purchase coupons to user ${userId}.`);
    }

    // 3. Jisne refer kiya hai, usko bonus do
    const userSnapshot = await userRef.once('value');
    const userData = userSnapshot.val();
    
    if (!userData || !userData.referredBy) {
      console.log(`User ${userId} was not referred. No bonus to award.`);
      return null;
    }
    
    const referrerCode = userData.referredBy;
    const referrerQuery = await db.ref('users').orderByChild('referralCode').equalTo(referrerCode).limitToFirst(1).once('value');

    if (!referrerQuery.exists()) {
      console.log(`Referrer with code ${referrerCode} not found.`);
      return null;
    }

    const [referrerId] = Object.keys(referrerQuery.val());
    const referrerRef = db.ref(`users/${referrerId}`);
    
    // NAYA RULE: Sirf 50 coupon ka bonus
    await referrerRef.child('couponBalance').set(admin.database.ServerValue.increment(50));
    
    console.log(`Successfully awarded 50 referral coupons to user ${referrerId}.`);
    return null;
  }
);