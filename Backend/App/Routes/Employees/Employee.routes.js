"use strict"

const router = require("express").Router()
 
const {getEmployeedata} = require("../../Controllers/Employees/Employe")


router.post('/getEmployeedata', getEmployeedata);




module.exports = router;