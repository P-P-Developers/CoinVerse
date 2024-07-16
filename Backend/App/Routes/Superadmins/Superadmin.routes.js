"use strict"

const router = require("express").Router()

const {AddAdmin,walletRecharge , getAdminDetail, UpdateActiveStatusAdmin ,getadminhistory} = require("../../Controllers/Superadmin/Admins/admin")




router.post('/superadmin/addminadd', AddAdmin);
router.post('/admin/walletRecharge', walletRecharge);
router.post('/superadmin/getAdminDetail', getAdminDetail);
router.post('/admin/UpdateActiveStatusAdmin', UpdateActiveStatusAdmin);
router.get('/admin/getadminhistory', getadminhistory);







module.exports = router;