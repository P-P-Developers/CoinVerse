"use strict"

const router = require("express").Router()

const {AddAdmin,walletRecharge , getAdminDetail} = require("../../Controllers/Superadmin/Admins/admin")




router.post('/superadmin/addminadd', AddAdmin);
router.post('/superadmin/walletRecharge', walletRecharge);
router.post('/superadmin/getAdminDetail', getAdminDetail);






module.exports = router;