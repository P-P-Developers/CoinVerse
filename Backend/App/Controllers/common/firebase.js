"use strict";

const admin = require("firebase-admin");

// Firebase Admin SDK Initialization (only once)
if (!admin.apps.length) {
  const serviceAccount = JSON.parse(process.env.FIREBASE_CREDENTIALS);
  console.log("Firebase Credentials", serviceAccount);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}
// Function to send push notifications Single User
const sendPushNotification = async (firebaseToken, title, message) => {
  try {
    const payload = {
      notification: {
        title: title,
        body: message,
      },
      token: firebaseToken,
    };

    console.log("Payload", payload);
    const response = await admin.messaging().send(payload);
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
};

// Multyple User
const sendMultiplePushNotification = async (firebaseTokens, title, message) => {
  if (firebaseTokens.length === 0) {
    return { success: false, error: "No firebase tokens provided" };
  } else {
    firebaseTokens.map(async (firebaseToken) => {
      if (
        firebaseToken === null ||
        firebaseToken === undefined ||
        firebaseToken === ""
      ) {
        console.log("Invalid firebase token");
        return { success: false, error: "Invalid firebase token" };

      }
      try {
        const payload = {
          notification: {
            title: title,
            body: message,
          },
          token: firebaseToken,
        };

        const response = await admin.messaging().send(payload);
        return { success: true };
      } catch (error) {
        console.error("Error sending push notification:", error);
        return { success: false, error };
      }
    });
  }
};

module.exports = { sendPushNotification, sendMultiplePushNotification };
