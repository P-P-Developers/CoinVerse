"use strict"

const router = require("express").Router()

const {employee_request} = require("../../Controllers/Employees/Employe")

router.post('/employee_request', employee_request);



module.exports = router;