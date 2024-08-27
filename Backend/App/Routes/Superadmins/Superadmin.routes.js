"use strict"

const router = require("express").Router()

const {AddAdmin,walletRecharge , getAdminDetail, UpdateActiveStatusAdmin ,getadminhistory,Update_Admin ,Delete_Admin 
    , SuperadminGetDashboardData,getAllclent , getadminuserdetail ,getEmployeeuserdetail
     ,getlicencedetail } = require("../../Controllers/Superadmin/Admins/admin")




router.post('/superadmin/addminadd', AddAdmin);
router.post('/admin/walletRecharge', walletRecharge);
router.post('/superadmin/getAdminDetail', getAdminDetail);
router.post('/admin/UpdateActiveStatusAdmin', UpdateActiveStatusAdmin);
router.get('/admin/getadminhistory', getadminhistory);
router.post('/admin/Update_Admin', Update_Admin);
router.post('/admin/Delete_Admin', Delete_Admin);
router.post('/SuperadminGetDashboardData', SuperadminGetDashboardData);
router.post('/getAllclent', getAllclent);
router.post('/getadminuserdetail', getadminuserdetail);
router.post('/getEmployeeuserdetail', getEmployeeuserdetail);
router.post('/getlicencedetail', getlicencedetail);








module.exports = router;