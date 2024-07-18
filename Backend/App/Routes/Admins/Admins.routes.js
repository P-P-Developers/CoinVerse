"use strict"

const router = require("express").Router()

const { GetDashboardData} = require("../../Controllers/Admins/AdminDashboard/Dashboard");
const {AddUser , updateLicence , updateUser , DeleteUser,Update_Employe ,Delete_Employee} = require("../../Controllers/Admins/Admins/Admin")



router.post('/admin/GetDashboardData', GetDashboardData);
router.post('/admin/AddUser', AddUser);
router.post('/admin/UserupdateLicence', updateLicence);
router.post('/admin/updateUser', updateUser);
router.post('/admin/DeleteUser', DeleteUser);
router.post('/admin/Update_Employe', Update_Employe);
router.post('/admin/Delete_Employee', Delete_Employee);
     




module.exports = router;