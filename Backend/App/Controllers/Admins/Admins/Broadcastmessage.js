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

const serviceAccount = {
  type: "service_account",
  project_id: "coinverse-ae0e1",
  private_key_id: "c5064d98959c05f4502fd81cd3c95f3470721dde",
  private_key:
    "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC6v7VHf9VaeynL\n2QfzxrCbPSQ5uBkVbf17g/6/R2lS7O0vRnxFq1XavIAfjFER7WC7ydphWNSo5xj8\nf1A4YFIKQvhHQxFVhvRO3/9lPbcWoMPgjyeAlEhji/DZTq/Goat1dCADSmj25z15\np4eulWVE4JPunx+UOy49e5LDr5sh7KJCBTAazvoGuyNgSXf4zoQb28NHg3r4tsDt\nk5LchhXu7xH3/XtiPXoymNBGTZvgGKCmyAuAAdqCoJTShdqaOSWDQ2REJ2egSxD1\nTN8pEnMy2bI9UJo7R/Zid0bJgEy/WU2Phh+buVpPSx7FDPK+FGCJtqvzRDF/E7Hg\nHgX7XcyrAgMBAAECggEALKxek7ePVMFAytxkrBq8Na6nI02YZol0yV7WinBtUCKQ\nTK5aXRozBAvyxFk/LYAxE0sivAXRfYQm9IQKLypPhdfmZ7myBFkvyUyJXnEogre7\nk9T6+KXAOVwJJhrOLsCO8R5x6AedW28OxDLg4NEpNBRbHwqetcmAcsHEZp50CGWX\njsqCcwRfBxMybNyxr2JzIyK6L6C/uq0g2lVogDULqI9GtYuvAvpm3uuAqRqHBhHm\ndqMpZ6Fxr+O414sWc2dG4ekeHe2uAfmt1XD1jhlejHtlYrabme+mZ2LEGzM7tDzH\nMDfZJoG5qkFjsPoL5UnyB7wKTzRXvuminNvrs+hlEQKBgQDvxvwLyprNJhNmKJfV\nPJ27VtzTOF2vSUPJEytYNoNYM/Deistmd8r6WJCRLbqIbUIIlc0865VnXo58xqmU\nIL+j00Z7C5s/qUhjpoC4tBb1Gjz/lKge6uDcrA/DXfZ7MRZCh492IxRSI158sGQR\nACGxA8/HtVZxfnVWTVtDsQ3fWwKBgQDHYkFRfMbw2kAjkU5lBJNORFc/pD3qhi31\n9af9KMP3Sfa51aWNX4lnS6sxjrJHY9VBJU60kiPYYl4oz+Bj7JuOa8497XHod22J\nt2vuTNSNpu34W6I7DM/16QnIxTymDi0r4qi1d6aOTry3VdNMfxND5REkegq8K0fH\nvNDf3XoY8QKBgQDsdmkkW8c0H6Or8MZjtWa8VNprtz+02OTvjGcHlKMNPhQB9BDJ\nWcQkBWl0swss9crUWp9Pv+jUS0zrwqOEAJPdxULRn82YB6LrG04AWSH2z8xuJLVz\n4CCnn0vgWG72aJ9SNwwE7m1g356UCwR0O5P+VQr5IV1Bifu/g4RIinhq1wKBgDlh\niKTYATUdyqmxztr5tx8mQenZ7cvJ8/4+RatxCPzpN22CFBQcs6GbwFgR1jL/g0ct\nYnpLOK+0l56tPMnlNVuGoSNna4nYnRiuRgyd5eoiaYg5bvYJmOwPtjYmtW6g09U2\ndRFMrw1zkZI9zALO6491pDpYOTCwUAcmywIybkoxAoGBALnbxq0kRWyQ4/3Efu2O\nluTmHk0v1ZeFx6fRQ9qit3VI+Tc/9x1juI4o23IrHkhzh5Q44ZZJKu8e+F6nyaRs\nUMcKkxVy/cMjtQK9VZOCk2alluZNnnOvgH3Yl/efh6ursj8SikEAOORFI/iAdo1Y\nbAaEjI+e7w3PU4k1pURmqwDf\n-----END PRIVATE KEY-----\n",
  client_email:
    "firebase-adminsdk-ah418@coinverse-ae0e1.iam.gserviceaccount.com",
  client_id: "113679073933355634190",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url:
    "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-ah418%40coinverse-ae0e1.iam.gserviceaccount.com",
  universe_domain: "googleapis.com",
};

class broadcastingmessage {
  
  async broadcastmessage(req, res) {
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
