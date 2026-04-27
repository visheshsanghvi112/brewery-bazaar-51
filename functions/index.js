const functions = require("firebase-functions");
const admin = require("firebase-admin");
const crypto = require("crypto");

admin.initializeApp();
const db = admin.firestore();

/**
 * PRODUCTION REQUIREMENT: Secure backend payment verification
 * Validates the Razorpay HMAC signature to ensure the payment 
 * was legitimately executed by the gateway, not fabricated by a terminal user.
 */
exports.verifyRazorpayPayment = functions.https.onCall(async (data, context) => {
  const { 
    razorpay_order_id, 
    razorpay_payment_id, 
    razorpay_signature, 
    firestore_order_id 
  } = data;

  // Best practice: Store secret inside functions config 
  // (firebase functions:config:set razorpay.secret="YOUR_SECRET")
  const secret = functions.config().razorpay?.secret || "YOUR_FALLBACK_TEST_SECRET";

  try {
    // Generate HMAC SHA256 of order_id + "|" + payment_id using secret key
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      // ✅ Payment is 100% authentic. 
      // Safely update the Firestore Order status to "Processing"
      if (firestore_order_id) {
         await db.collection("orders").doc(firestore_order_id).update({
           paymentStatus: "Verified",
           paymentId: razorpay_payment_id,
           paymentSignature: razorpay_signature,
           updatedAt: new Date().toISOString()
         });
      }

      return { status: "success", message: "Payment verified atomically" };
    } else {
      // 🚨 Mismatch! A tampering attempt occurred.
      throw new functions.https.HttpsError(
        "invalid-argument", 
        "CRITICAL: Invalid Payment Signature. Tamper attempt logged."
      );
    }
  } catch (error) {
    console.error("Payment Verification Hard Failure:", error);
    throw new functions.https.HttpsError("internal", "Verification runtime failed.");
  }
});

/**
 * PRODUCTION REQUIREMENT: Secure Logistics Integration
 * Example Cloud Function to push an order to Shiprocket/Delhivery 
 * without exposing your Logistics API tokens to the frontend.
 */
exports.generateShippingAwb = functions.https.onCall(async (data, context) => {
  // Only allow admins to generate shipping labels
  if (!context.auth || context.auth.token.role !== 'admin') {
    throw new functions.https.HttpsError("permission-denied", "Only admins can perform this action");
  }

  const { order_id, customer_details, package_weight } = data;
  const shiprocketToken = functions.config().shiprocket?.token;

  try {
    // 1. Fetch from Firestore
    // 2. Format payload dynamically mapped to Shiprocket Standard
    // 3. await fetch('https://apiv2.shiprocket.in/v1/external/orders/create/adHoc', ...)
    
    return { status: "pending", message: "Shiprocket API integration placeholder." };
  } catch (error) {
    console.error("Logistics sync failed.", error);
    throw new functions.https.HttpsError("internal", "Failed to sync with courier.");
  }
});
