"use strict";

const admin = require("firebase-admin");

// Firebase Admin SDK Initialization (only once)
if (!admin.apps.length) {
  const serviceAccount = JSON.parse(process.env.FIREBASE_CREDENTIALS);

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}
// Function to send push notifications Single User
const sendPushNotification = async (firebaseToken, title, message) => {
  try {
    if(firebaseToken === null || firebaseToken === undefined || firebaseToken === "") {
      return { success: false, error: "Invalid firebase token" };
    }
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
    return { success: false, error };
  }
};

// Multyple User
const sendMultiplePushNotification = async (firebaseTokens, title, message) => {
  if (!firebaseTokens.length) {
    return { success: false, error: "No firebase tokens provided" };
  }

  

  const results = await Promise.all(
    firebaseTokens.map(async (token) => {
      if (!token) return { success: false, error: "Invalid token" };

      try {
        const payload = {
          notification: { title, body: message },
          token,
        };

        await admin.messaging().send(payload);
        return { success: true };
      } catch (error) {
        return { success: false, error };
      }
    })
  );

  return results;
};

module.exports = { sendPushNotification, sendMultiplePushNotification };
