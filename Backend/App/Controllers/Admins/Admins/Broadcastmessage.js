"use strict";
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const db = require("../../../Models");
const User_model = db.user;
const Role = db.role;
const Wallet_model = db.WalletRecharge;
const broadcasting = db.broadcasting;
const admin = require("firebase-admin");


class broadcastingmessage {
    
    async broadcastmessage(req, res) {
      const serviceAccount = JSON.parse(process.env.FIREBASE_CREDENTIALS);
    try {


      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });

      const { message, title, adminid, Role, UserName } = req.body;
      let firebaseToken = [];

      const newBroadcast = new broadcasting({
        message,
        title,
        adminid,
        Role,
        UserName,
        createdAt: new Date(),
      });

      const notificationResult = await sendPushNotification(
        firebaseToken,
        title,
        message
      );
      console.log("notificationResult:", notificationResult);

      const result = await newBroadcast.save();

      return res.json({ status: true, message: "Mesaage send", data: result });
    } catch (error) {
      console.log("error:", error);

      return res.json({
        status: false,
        message: "Failed to save broadcast message",
        data: [],
      });
    }
  }

  // get broadcast message

  async getbroadcastmessage(req, res) {
    try {
      const { userid } = req.body;
      const result = await broadcasting
        .find({ adminid: userid })
        .sort({ createdAt: -1 });
      if (!result) {
        return res.json({
          status: false,
          message: "message not found",
          data: [],
        });
      }
      return res.json({ status: true, message: "message found", data: result });
    } catch (error) {
      return res.json({ status: false, message: "internal error", data: [] });
    }
  }

  async getbroadcastmessageforuser(req, res) {
    try {
      const { userid } = req.body;
      const result = await User_model.find({ _id: userid });
      const parentIDs = result.map((item) => item.parent_id);

      if (parentIDs.length === 0) {
        return res.json({ status: "false", message: "id not found", data: [] });
      }

      const messages = await broadcasting
        .find({ adminid: { $in: parentIDs } })
        .sort({ createdAt: -1 });
      return res.json({ status: true, message: "data found", data: messages });
    } catch (error) {
      return res.json({
        status: "false",
        message: "Internal server error",
        data: [],
      });
    }
  }
}


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
      console.log("Push notification sent:", response);
      return { success: true, response };
    } catch (error) {
      console.error("Error sending push notification:", error);
      return { success: false, error };
    }
  };

module.exports = new broadcastingmessage();
