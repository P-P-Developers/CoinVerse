"use strict"

const router = require("express").Router()

const {AddAdmin,walletRecharge , getAdminDetail, UpdateActiveStatusAdmin ,getadminhistory,Update_Admin ,Delete_Admin} = require("../../Controllers/Superadmin/Admins/admin")




router.post('/superadmin/addminadd', AddAdmin);
router.post('/admin/walletRecharge', walletRecharge);
router.post('/superadmin/getAdminDetail', getAdminDetail);
router.post('/admin/UpdateActiveStatusAdmin', UpdateActiveStatusAdmin);
router.get('/admin/getadminhistory', getadminhistory);
router.post('/admin/Update_Admin', Update_Admin);
router.post('/admin/Delete_Admin', Delete_Admin);







module.exports = router;