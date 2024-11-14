"use strict"

const router = require("express").Router()

const { GetDashboardData} = require("../../Controllers/Admins/AdminDashboard/Dashboard");
const {AddUser , updateLicence , updateUser , DeleteUser,Update_Employe ,Delete_Employee,getuserpaymentstatus,UpdateStatus , getsymbolholdoff ,updatesymbolholoff,getbalancandLicence,
    countuserBalance,
    TotalcountLicence,
    getclienttradehistory,
    getlicensedata,
    employee_permission,
    getUsersName
} = require("../../Controllers/Admins/Admins/Admin")
const {marginupdate , getmarginprice} = require("../../Controllers/Admins/Admins/MarginReq")


router.post('/admin/GetDashboardData', GetDashboardData);
router.post('/admin/AddUser', AddUser);
router.post('/admin/UserupdateLicence', updateLicence);
router.post('/admin/updateUser', updateUser);
router.post('/admin/DeleteUser', DeleteUser);
router.post('/admin/Update_Employe', Update_Employe);
router.post('/admin/Delete_Employee', Delete_Employee);
router.post('/admin/getuserpaymentstatus', getuserpaymentstatus);
router.post('/admin/Updatestatus', UpdateStatus);
router.get('/admin/getUsersName', getUsersName);


// margin required

router.post('/admin/marginupdate', marginupdate);
router.post('/admin/getmarginprice', getmarginprice);
router.get('/admin/getsymbolholdoff', getsymbolholdoff);
router.post('/admin/updatesymbolholoff', updatesymbolholoff);
router.post('/getbalancandLicence', getbalancandLicence);
router.post('/admin/countuserBalance', countuserBalance);
router.post('/TotalcountLicence', TotalcountLicence);
router.post('/getclienttradehistory', getclienttradehistory);
router.post('/getlicensedata', getlicensedata);
router.post('/employee_permission', employee_permission);

     




module.exports = router;