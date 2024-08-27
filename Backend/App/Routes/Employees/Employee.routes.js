"use strict"

const router = require("express").Router()
 
const {getEmployeedata , getEmployee_permissiondata,getEmployeeUserHistory
     ,GetEmployeeUserDashboardData,getEmployeeUserposition
} = require("../../Controllers/Employees/Employe")


router.post('/getEmployeedata', getEmployeedata);
router.post('/getEmployee_permissiondata', getEmployee_permissiondata);
router.post('/getEmployeeUserHistory', getEmployeeUserHistory);
router.post('/GetEmployeeUserDashboardData', GetEmployeeUserDashboardData);
router.post('/getEmployeeUserposition', getEmployeeUserposition);




module.exports = router;