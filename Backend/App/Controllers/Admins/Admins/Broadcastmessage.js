"use strict";
const mongoose = require("mongoose");
const db = require("../../../Models");
const User_model = db.user;
const broadcasting = db.broadcasting;
const { sendPushNotification ,sendMultiplePushNotification} = require("../../common/firebase");

class broadcastingmessage {

  async broadcastmessage(req, res) {
    try {
      const { message, title, adminid, Role, UserName } = req.body;

      const newBroadcast = new broadcasting({
        message,
        title,
        adminid,
        Role,
        UserName,
        createdAt: new Date(),
      });

      const result = await newBroadcast.save();

      const firebaseToken = await User_model.find({ parent_id: adminid ,DeviceToken:{$ne:"",$ne: null} }).select("DeviceToken");


      const firebaseTokenArray = firebaseToken.map((item) => item.DeviceToken);



      const SendNotification = await sendMultiplePushNotification(firebaseTokenArray, title, message);


      return res.json({ status: true, message: "Mesaage send", data: result });
    } catch (error) {
      

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



module.exports = new broadcastingmessage();
