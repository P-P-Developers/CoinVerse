"use strict"

const router = require("express").Router()
 
const {getEmployeedata , getEmployee_permissiondata} = require("../../Controllers/Employees/Employe")


router.post('/getEmployeedata', getEmployeedata);
router.post('/getEmployee_permissiondata', getEmployee_permissiondata);




module.exports = router;