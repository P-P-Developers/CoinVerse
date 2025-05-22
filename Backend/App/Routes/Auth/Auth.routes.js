"use strict";
const router = require("express").Router();

const {
  login,
  SignIn,
  getSignIn,
  logoutUser,
  getlogsuser,
  PasswordChanged,
  DeleteSignIn,
  getReferClients,
  generatePin,
  matchPin,
  FingerAuth,
  changePin,
  ForgotPin,
} = require("../../Controllers/Auth/Auth.controller");

router.post("/login", login);
router.post("/SignIn", SignIn);
router.post("/getSignIn", getSignIn);
router.post("/logoutUser", logoutUser);
router.post("/getlogsuser", getlogsuser);
router.post("/PasswordChanged", PasswordChanged);

router.post("/DeleteSignIn", DeleteSignIn);
router.post("/getReferClients", getReferClients);



router.post('/user/generateMPin', generatePin)
router.post('/user/matchPin', matchPin);
router.post('/user/fingerauth', FingerAuth);

router.post('/user/changePin', changePin);
router.post('/user/ForgotPin', ForgotPin);

module.exports = router;
