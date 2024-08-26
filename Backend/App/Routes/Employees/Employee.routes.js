"use strict"

const router = require("express").Router()
 
const {getEmployeedata , getEmployee_permissiondata,getEmployeeUserHistory} = require("../../Controllers/Employees/Employe")


router.post('/getEmployeedata', getEmployeedata);
router.post('/getEmployee_permissiondata', getEmployee_permissiondata);
router.post('/getEmployeeUserHistory', getEmployeeUserHistory);




module.exports = router;