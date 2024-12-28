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
    const payload = {
      notification: {
        title: title,
        body: message,
      },
      token: firebaseToken,
    };

    const response = await admin.messaging().send(payload);
<<<<<<< HEAD
=======
  
>>>>>>> 02cc8c36e6353d84c1d3b45e475364735b7b30ab
    return { success: true, response };
  } catch (error) {
    console.error("Error sending push notification:", error);
    return { success: false, error };
  }
};


// Multyple User
const sendMultiplePushNotification = async (firebaseTokens, title, message) => {
    if(firebaseTokens.length === 0) {
        return { success: false, error: "No firebase tokens provided" };
        }
        else{
            firebaseTokens.map(async (firebaseToken) => {

            try {
                const payload = {
                  notification: {
                    title: title,
                    body: message,
                  },
                  token: firebaseToken,
                };
            
                const response = await admin.messaging().send(payload);
                return { success: true, response };
              } catch (error) {
                console.error("Error sending push notification:", error);
                return { success: false, error };
              }
            });
        }
  };
  

module.exports = { sendPushNotification,sendMultiplePushNotification };
