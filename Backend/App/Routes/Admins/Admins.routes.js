"use strict";

const router = require("express").Router();

const {
  GetDashboardData,
  apiPrice,
  apiPriceIntraday
} = require("../../Controllers/Admins/AdminDashboard/Dashboard");
const {
  AddUser,
  updateLicence,
  updateUser,
  DeleteUser,
  Update_Employe,
  Delete_Employee,
  getuserpaymentstatus,
  UpdateStatus,
  getsymbolholdoff,
  updatesymbolholoff,
  getbalancandLicence,
  countuserBalance,
  TotalcountLicence,
  getclienttradehistory,
  getlicensedata,
  employee_permission,
  getUsersName,
  brokerageData,
  AddResearch,
  getResearch,
  EditResearch,
  UpdatStatus,
  DeleteResearch,
  UpdateUpiDetails,
  getUpiDetails,
  getConversations,
  getMessages,
  message,
  conversation,
  GetReferralCode,
  UpdateReferPrice,
  Downloadapk,
  GetBonusDetails,
  setPrimaryBank,
  deleteBankDetails,
  updateBankDetails,
  getAllUser,
  getUserDetails,
  uploadApk
} = require("../../Controllers/Admins/Admins/Admin");
const {
  marginupdate,
  getmarginprice,
} = require("../../Controllers/Admins/Admins/MarginReq");

const upload = require("../../Helpers/Multer")

router.post("/admin/GetDashboardData", GetDashboardData);
router.post("/admin/AddUser", AddUser);
router.post("/admin/UserupdateLicence", updateLicence);
router.post("/admin/updateUser", updateUser);
router.post("/admin/DeleteUser", DeleteUser);
router.post("/admin/Update_Employe", Update_Employe);
router.post("/admin/Delete_Employee", Delete_Employee);
router.post("/admin/getuserpaymentstatus", getuserpaymentstatus);
router.post("/admin/Updatestatus", UpdateStatus);
router.post("/admin/getUsersName", getUsersName);

router.get("/api/prices", apiPrice);
router.get("/get/intrady/price",apiPriceIntraday)


router.post("/admin/getAllUser", getAllUser); // Get all users

// margin required

router.post("/admin/marginupdate", marginupdate);
router.post("/admin/getmarginprice", getmarginprice);
router.get("/admin/getsymbolholdoff", getsymbolholdoff);

router.post("/admin/brokerageData", brokerageData);
router.post("/admin/updatesymbolholoff", updatesymbolholoff);
router.post("/getbalancandLicence", getbalancandLicence);
router.post("/admin/countuserBalance", countuserBalance);
router.post("/TotalcountLicence", TotalcountLicence);
router.post("/getclienttradehistory", getclienttradehistory);
router.post("/getlicensedata", getlicensedata);
router.post("/employee_permission", employee_permission);


router.post("/admin/addresearch", AddResearch);
router.get("/admin/getresearch", getResearch);
router.post("/admin/editresearch", EditResearch);
router.post("/admin/updatstatus", UpdatStatus);
router.post("/admin/deleteresearch", DeleteResearch);

router.post("/admin/updateUpiDetails", UpdateUpiDetails);
router.post("/admin/getUpiDetails", getUpiDetails);
router.post("/admin/setPrimaryBank", setPrimaryBank);
router.post("/admin/deleteBankDetails", deleteBankDetails);
router.post("/admin/updateBankDetails", updateBankDetails);

router.post("/admin/conversation", conversation);
router.post("/admin/message", message);
router.get("/admin/messages/:conversationId", getMessages);
router.post("/admin/conversations/:id", getConversations);
router.post("/admin/getreferralcode", GetReferralCode);
router.post("/admin/updatereferprice", UpdateReferPrice);
router.post("/admin/getbonusdetails", GetBonusDetails);
router.post("/admin/getUserDetails", getUserDetails);

router.get("/Downloadapk", Downloadapk);

router.post("/upload-apk", upload.single("apk"), uploadApk);

module.exports = router;
