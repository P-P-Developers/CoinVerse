"use strict"

const router = require("express").Router()

const {AddAdmin,walletRecharge} = require("../../Controllers/Superadmin/Admins/admin")




router.post('/admin/add', AddAdmin);
router.post('/admin/walletRecharge', walletRecharge);






module.exports = router;